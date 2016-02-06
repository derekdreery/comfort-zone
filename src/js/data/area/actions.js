import Reflux from 'reflux';
import {dbPromise} from '../../lib/db';

export function initDB(builder) {
    builder
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
    });
}

const areaActions = Reflux.createActions({
    createArea: {asyncResult: true},
    deleteArea: {asyncResult: true}
});

actionActions.createArea.listen(function() {
    const me = this;
    dbPromise().then(() => {
        console.log(arguments);
    });
});

export default areaActions;
