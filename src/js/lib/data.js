
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

  areasListeners = [];
  actionsListeners = [];

  areas = null;
  actions = null;

  filter_helper = (area, target_idx, date_start, date_end, itm) => {
    return (area === undefined || itm.area === area) &&
      (target_idx === undefined || itm.target_idx === target_idx) &&
      (date_start === undefined || itm.date > date_start) &&
      (date_end === undefined || itm.date < date_end)
  }

  /**
   * Get data from persistent store, or create a sensible default
   */
  constructor() {
    this.dbPromise = new DBBuilder()
      .setName(DB_NAME)
      .addStore(1, 'areas', 'name')
        .addFixture(1, 'areas', {
          name: 'Example3',
          targets: [{
            name: "Target 1"
          }, {
            name: "Target 2"
          }, {
            name: "Target 3"
          }]
        })
      .addStore(1, 'config', 'key')
        .addFixture(1, 'config', {
          key: 'config',
          configs: {}
        })
      .addStore(1, 'actions', 'key')
        .addIndex(1, 'actions', 'date')
        .addIndex(1, 'actions', 'area')
        .addIndex(1, 'actions', 'target_idx')
      .getDbPromise();
  }

  /**
   *
   */
  getAreas() {
    return this.dbPromise.then((db) => {
      return Promise.all([db.getAll("areas"), db.getAll('actions')]);
    }).then((values) => {
      const [areas, actions] = values;
      // Count completions
      areas.forEach((area) => {
        area.targets.forEach((target, idx) => {
          target.count = 0;
          actions.forEach((action) => {
            if(action.area === area.name && action.target_idx === idx) {
              target.count++;
            }
          });
        });
      });
      //console.log(areas);
      return this.areas = areas;
    });
  }

  /**
   * Add a new target area
   */
  setAreas(areas) {
    // invalidate cache
    this.areas = null;
    this.dbPromise.then((db) => {
      db.setAll("areas", areas).then(() => {
        this.publishAreas();
      }).catch((error) => {
        alert(error.message);
      })
    });
  }

  registerAreas(cb) {
    this.areasListeners.push(cb);
    this.updateAreas();
  }

  unregisterAreas(cb) {
    const listen = this.areasListeners;
    listen.splice(listen.findIndex((itm) => {
      return itm === cb;
    }));
  }

  publishAreas = (areas) => {
    this.areasListeners.forEach((cb) => {
      cb(areas);
    });
  }

  updateAreas() {
    this.getAreas().then(this.publishAreas);
  }

  // Actions (when user completes exposure practise)

  /**
   * Get all actions
   *
   * Optionally use parameters to filter results
   */
  getActions(area, target_idx, date_start, date_end) {
    return this.dbPromise.then((db) => {
      return db.getAll("actions");
    }).then((actions) => {
      return this.actions = actions;
    });
  }

  /**
   * Record an action being performed
   */
  addAction(area, target_idx, date) {
    const date_or_default = date || new Date();
    const strdate = date_or_default.getFullYear()+'-'+
      (date_or_default.getMonth()+1) + '-' +
      date_or_default.getDate();
    const record = {
      key: JSON.stringify([area,target_idx,strdate]),
      area: area,
      target_idx: target_idx,
      date: strdate
    };
    return this.dbPromise.then((db) => {
      return db.add('actions', record);
    }).then(() => {
      this.updateAreas();
      this.updateActions();
    });
  }

  registerActions(cb, area, target_idx, date_start, date_end) {
    this.actionsListeners.push({cb, area, target_idx, date_start, date_end});
    this.updateActions().then(this.publishActions);
    this.publishActions();
  }

  unregisterActions(cb) {
    const listen = this.actionsListeners;
    listen.splice(listen.findIndex((itm) => {
      return itm.cb === cb;
    }));
  }

  /**
   * Non-standard filtering stuff
   */
  publishActions = () => {
    this.actionsListeners.forEach((subs) => {
      if(this.actions === null) {
        subs.cb(null);
      } else {
        subs.cb(this.actions.filter(this.filter_helper.bind(null, subs.area,
          subs.target_idx, subs.date_start, subs.date_end)));
      }
    });
  }

  updateActions() {
    return this.getActions().then(this.publishActions);
  }
}

const data = new Data();

export default {
  getData: () => {
    return data;
  }
};
