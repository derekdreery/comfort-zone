
const DEFAULT_ERR_MSG = "Your browser doesn't support persistent storage.";

// Helper function to add store
function addStore(promise, db, name, idxs, key, fixtures) {
  return new Promise((resolve, reject) => {
    promise.then(() => {
      console.log(`Processing ${name}`)
      // if there is no key, then use auto-increment
      const store = key ? db.createObjectStore(name, {
        keyPath: key
      }) : db.createObjectStore(name, {
        autoIncrement: true
      });

      idxs.forEach((itm) => {
        console.log(`Adding index ${itm.name} to ${name}`);
        store.createIndex(itm.name, itm.name, {unique: !!itm.unique});
      });

      store.transaction.onabort = (event) => {
        console.warn(`Rejecting ${name}: ${event.target.errorCode}`)
        reject(event.target.errorCode || "Abort");
      };
      store.transaction.onerror = (event) => {
        console.warn(`Rejecting ${name}: ${event.target.errorCode}`)
        reject(event.target.errorCode);
      };
      store.transaction.oncomplete = (event) => {
        console.log(`Completing creation of ${name}`)
        const transaction = db.transaction(name, "readwrite");
        transaction.onerror = (event) => {
          console.warn(`Rejecting ${name}: ${event.target.errorCode}`)
          reject(event.target.errorCode || "Unknown");
        }
        transaction.onabort = (event) => {
          console.warn(`Rejecting ${name}: ${event.target.errorCode}`)
          reject(event.target.errorCode || "Unknown");
        }
        transaction.onsuccess = (event) => {
          console.log(`resolving ${name}`);
          resolve(event.target);
        }
        const store = transaction.objectStore(name);
        fixtures.forEach((fixture) => {
          store.add(fixture);
        });
      };
    }, (msg) => {
      reject(msg);
    });
  });
}

/**
 * This class implements a promise interface to IndexedDB.
 */
export default class IndexedDBBuilder {
  constructor() {
    this.dbName = null;
    this.dbVer = 1;
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
   * Increment this to trigger upgrade
   */
  setVersion(ver) {
    this.dbVer = ver;
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
    if(ver > this.dbVer) {
      throw new Error(`Cannot create db action with version (${ver}) `
      `higher than current version (${this.dbVer})`);
    }
    if(this.tables[name] !== undefined) {
      throw new Error(`Trying to add already existing table ${name}`);
    }
    this.tables[name] = {
      name: name,
      key: key,
      indexes: [],
      fixtures: []
    };
    return this;
  }

  addIndex(ver, table_name, field_name, unique) {
    if(ver > this.dbVer) {
      throw new Error(`Cannot create db action with version (${ver}) `
      `higher than current version (${this.dbVer})`);
    }
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
    table.indexes.push({
      name: field_name,
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
    if(ver > this.dbVer) {
      throw new Error(`Cannot create db action with version (${ver}) `
      `higher than current version (${this.dbVer})`);
    }
    const table = this.tables[table_name];
    if(table === undefined) {
      throw new Error(`Cannot find table (${table_name}) to add `+
      `index (${field_name}) to`);
    }
    table.fixtures.push(fixture);
    return this;
  }

  /**
   * Get a promise which will resolve with the db
   */
  getDbPromise() {
    const me = this;
    const upgrade = me.dbUpgradeNeeded ? me.dbUpgradeNeeded : (event) => {
      console.log(event);
      const db = event.target.result;
      let createPromise = Promise.resolve();
      Object.keys(me.tables).forEach((table_name) => {
        const table = me.tables[table_name];
        createPromise = addStore(createPromise, db, table_name, table.indexes,
          table.key, table.fixtures);
      });
      createPromise.catch((err) => {
        console.error(err);
      })
    };
    return IndexedDB.new(me.dbName, this.dbVer, this.dbError, upgrade);
  }

}

/**
 * Don't export this as the constructor is a bit messy
 */
class IndexedDB {
  static new = (name, ver, onerror, onupgradeneeded, tables) => {
    return new Promise((resolve, reject) => {
      //args.push(resolve);
      //args.push(reject);
      new IndexedDB(name, ver, onerror, onupgradeneeded, tables, resolve, reject);
    });
  };
  constructor(name, ver, onerror, onupgradeneeded, tables, resolve, reject) {
    const me = this;
    if(!window.indexedDB) {
      reject(DEFAULT_ERR_MSG);
    }
    const request = window.indexedDB.open(name, ver);
    request.onerror = (event) => {
      reject("Unhandled database error during creation: " +
      event.target.errorCode + "\nmaybe you didn't give me permission");
    };
    request.onupgradeneeded = onupgradeneeded;
    request.onsuccess = (event) => {
      me.db = event.target.result;
      me.db.onerror = onerror;
      resolve(me);
    };
  }
}
