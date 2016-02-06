import Reflux from 'reflux';
import {dbPromise} from '../../lib/db';

export function initDB(builder) {
    builder
    .addStore(1, 'config', 'key')
    .addFixture(1, 'config', {
        key: 'config',
        configs: {}
    });
}

const configActions = Reflux.createActions({
    createConfig: {asyncResult: true},
    deleteConfig: {asyncResult: true}
});

configActions.createConfig.listen(function() {
    dbPromise().then(() => {
        console.log(arguments);
    });
});

export default configActions;
