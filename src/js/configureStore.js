import {createStore, applyMiddleware, compose} from 'redux';

// import {createDevTools} from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

import {rootReducer} from './reducers';

/**
 * Create a configureStore function for redux to use to create the store
 * @override
 */
export default function configureStore(initialState) {
    return createStore(
        rootReducer,
        initialState,
        compose(
            applyMiddleware(
                LogMonitor,
                DockMonitor
            ),
            window.devToolsExtension ? window.devToolsExtension() : (val) => { return val; }
        )
    );
}
