
const DEFAULT_ERR_MSG = "Your browser doesn't support persistent storage.";
// TODO add support for createIndex in different version change to table
// creation (if possible)
/**
 * This class implements a promise interface to IndexedDB.
 */
export default class IndexedDBBuilder {
  constructor() {
    this.dbName = null;
    this.version = 1;
    this.tables = {};
    this.dbError = (event) => {
      console.warn("Unhandled database error: " + event.target.errorCode+
      "\nmaybe you didn't give me permission");
    }
  }

  /**
   * Set the name of the database
   */
  setName(name) {
    this.dbName = name;
    return this;
  }

  /**
   * WARNING: you shouldn't need to use this
   */
  setUpgradeNeeded(fn) {
    this.dbUpgradeNeeded = fn;
    return this;
  }

  /**
   * Set generic db error handler
   */
  setError(fn) {
    this.dbError = fn;
    return this;
  }

  /**
   *
   */
  addStore(ver, name, key) {
    if(this.tables[name] !== undefined) {
      throw new Error(`Trying to add already existing table ${name}`);
    }
    this.version = Math.max(this.version, ver);
    this.tables[name] = {
      name: name,
      version: ver,
      key: key,
      indexes: [],
      fixtures: []
    };
    return this;
  }

  addIndex(ver, table_name, field_name, unique) {
    const table = this.tables[table_name];
    if(table === undefined) {
      throw new Error(`Cannot find table (${table_name}) to add `+
      `index (${field_name}) to`);
    }
    if(table.indexes.find((itm) => {
      return itm.name === field_name;
    }) || field_name === table.key) {
      throw new Error(`Cannot add index ${field_name} to table `+
        `${table}, index already exists`);
    }
    if(table.version !== ver) {
      throw new Error(`Cannot add index ${index_name} to table ${table_name} `+
        `in different version to table creation`);
    }
    table.indexes.push({
      name: field_name,
      version: ver,
      unique: unique
    });
    return this;
  }

  /**
   * Add a record to any table.
   *
   * This really should be used when just created a new table
   */
  addFixture(ver, table_name, fixture) {
    const table = this.tables[table_name];
    if(table === undefined) {
      throw new Error(`Cannot find table (${table_name}) to add `+
      `index (${field_name}) to`);
    }
    if(table.version > ver) {
      throw new Error(`Table "${table_name}" (v${table.version}) is newer `+
      `than fixture (v${ver})`);
    }
    this.version = Math.max(this.version, ver);
    table.fixtures.push({
      version: ver,
      fixture: fixture
    });
    return this;
  }

  /**
   * Get a promise which will resolve with the db
   */
  getDbPromise() {
    return IndexedDB.new(this);
  }
}

/**
 * Don't export this as the constructor is a bit messy
 */
class IndexedDB {
  static new = (builder) => {
    return new Promise((resolve, reject) => {
      new IndexedDB(builder, resolve, reject);
    });
  };
  constructor(builder, resolve, reject) {
    const me = this;
    var oldVersion;
    if(!window.indexedDB) {
      reject(new DOMError(DEFAULT_ERR_MSG));
    }
    const request = window.indexedDB.open(builder.dbName, builder.version);
    request.onerror = (event) => {
      reject(new DOMError(`Unhandled database error during creation: `+
        `${event.target.errorCode} - maybe you didn't give me permission`));
    };
    // Add extra stuff as required, also store old version
    request.onupgradeneeded = (event) => {
      const transaction = event.target;
      const db = transaction.result;
      oldVersion = event.oldVersion;
      Object.keys(builder.tables).forEach((table_name) => {
        const table = builder.tables[table_name];
        var store;
        if(table.version > oldVersion) {
          if(table.key) {
            store = db.createObjectStore(table_name, {
              keyPath: table.key
            });
          } else {
            store = db.createObjectStore(table_name, {
              autoIncrement: true
            });
          }
          table.indexes.forEach((idx) => {
            store.createIndex(idx.name, idx.name, {unique: idx.unique});
          });
        }
      });
    }
    request.onsuccess = (event) => {
      me.db = event.target.result;
      me.db.onerror = onerror;
      if(oldVersion !== undefined) {
        const transaction = me.db.transaction(Object.keys(builder.tables),
          "readwrite");
        for(let table_name in builder.tables) {
          const table = builder.tables[table_name];
          let store = transaction.objectStore(table_name);
          table.fixtures.forEach((itm) => {
            if(itm.version < table.version) {
              throw new Error(`Fixture version ${itm.version} is less than `+
                `table version ${table.version}`);
            }
            if(itm.version > oldVersion) {
              store.add(itm.fixture);
            }
          });
        }
      }
      resolve(me);
    };
  }

  getAll(name) {
    const me = this;
    return new Promise((resolve, reject) => {
      const transaction = me.db.transaction([name]);
      const store = transaction.objectStore(name);
      const cursor = store.openCursor();
      let results = [];
      cursor.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      cursor.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  setAll(name, values) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([name], "readwrite");
      const store = transaction.objectStore(name);
      store.clear();
      values.forEach((value) => {
        store.add(value);
      })
      transaction.onerror = (event) => {
        reject(event.target.error);
      }
      transaction.onsuccess = (event) => {
        resolve();
      }
    });
  }

  set(name, value) {
    var db = this.db;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([name], "readwrite");
      const store = transaction.objectStore(name);
      store.put(value);
      transaction.onerror = (event) => {
        reject(event.target.error);
      }
      transaction.onsuccess = (event) => {
        resolve();
      }
    });
  }

  add(name, value) {
    var me = this;
    return new Promise((resolve, reject) => {
      const transaction = me.db.transaction([name], "readwrite");
      const store = transaction.objectStore(name);
      store.add(value);
      transaction.onerror = (event) => {
        reject(event.target.error);
      }
      transaction.oncomplete = (event) => {
        resolve();
      }
    });
  }
}
