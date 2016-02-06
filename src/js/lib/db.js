import DBBuilder from './indexed-db';
import {initDB as initActionDB} from '../data/action/actions';
import {initDB as initAreaDB} from '../data/area/actions';
import {initDB as initConfigDB} from '../data/config/actions';

/**
 * This file is responsible for setting up the db
 */
const DB_NAME = "ComfortZone";
const DEFAULT_ERR_MSG = "Your browser doesn't support persistent storage.";

const dbPromiseObj = new Promise();
export function dbPromise() {
    return dbPromiseObj;
}

export default function initDB() {
    const builder = new DBBuilder(DB_NAME);
    initActionDB(builder);
    initAreaDB(builder);
    initConfigDB(builder);
    const promise = builder.getDbPromise();
    promise.then(() => {
        dbPromiseObj.resolve(arguments);
    }, () => {
        dbPromiseObj.reject(arguments);
    });
    return promise;
}

