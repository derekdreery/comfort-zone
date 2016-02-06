import Reflux from 'reflux';
import {dbPromise} from '../../lib/db';

export function initDB(builder) {
    builder
    .addStore(1, 'actions', 'key')
    .addIndex(1, 'actions', 'date')
    .addIndex(1, 'actions', 'area')
    .addIndex(1, 'actions', 'target_idx');
}

const actionActions = Reflux.createActions({
    addAction: {asyncResult: true},
    deleteAction: {asyncResult: true}
});

actionActions.addAction.listen(function(area, target_idx, date) {
    const me = this;
    const date_or_default = date || new Date();
    const strdate = date_or_default.getFullYear()+'-'+
        (date_or_default.getMonth()+1) + '-' +
        date_or_default.getDate();
    const record = {
        key: JSON.stringify([area, target_idx ,strdate]),
        area: area,
        target_idx: target_idx,
        date: strdate
    };
    dbPromise().then((db) => {
        db.add('actions', record)
    })
    .then(me.completed)
    .catch(me.failed);
});

actionActions.addAction.listen(function() {
    me.failed("Not implemented");
});

export default actionActions;
