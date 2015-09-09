import Immutable from 'immutable';
import DBBuilder from './indexed-db';
/**
 * This file is responsible for managing data
 */
const DB_NAME = "ComfortZone";
const DEFAULT_ERR_MSG = "Your browser doesn't support persistent storage.";

/**
 * Singleton class for data storage
 */
class Data {

  /**
   * Get data from persistent store, or create a sensible default
   */
  constructor() {
    this.dbPromise = new DBBuilder()
      .setName(DB_NAME)
      .setVersion(1)
      .addStore(1, 'areas', 'name')
      .addStore(1, 'config', 'key')
      .addFixture(1, 'areas', {
        name: 'Example',
        targets: [{
          name: "Target 1",
          accomplished: true
        }, {
          name: "Target 2",
          accomplished: true
        }, {
          name: "Target 3",
          accomplished: false
        }]
      })
      .addFixture(1, 'config', {
        key: 'config',
        configs: {}
      })
      .getDbPromise();
  }

  getAreas() {
    return new Promise((accept, reject) => {
      const transaction = this.db.transaction(["areas"]);
      const areaStore = transaction.areaStore("areas");
      const cursor = areaStore.openCursor();
      let results = [];
      cursor.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          accept(Immutable.fromJS(results));
        }
      };
    });
  }

  /**
   * Add a new target area
   */
  addArea(area) {

  }
}

const data = new Data();

export default {
  getData: () => {
    return data;
  }
};
