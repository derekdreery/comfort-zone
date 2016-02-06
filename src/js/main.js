import ReactDOM from 'react-dom';
import {configureStore} from './configureStore';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {syncHistory} from 'redux-simple-router';

import './lib/polyfill';
import '../assets/css/font-awesome.css';
import '../stylus/main.styl';

import {App, Zone, About, Config, NoMatch} from './components/app';

import {fastDebounce} from './lib/util';

const reduxRouterMiddleware = syncHistory(browserHistory);

const store = configureStore(reduxRouterMiddleware);

reduxRouterMiddleware.listenForReplays(store);

/**
 * Primary application renderer
 * @returns {undefined}
 */
function render() {
    ReactDOM.render(
        <Provider store={store}>
            <Router history={browserHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={Zone} />
                    <Route path="detail/:area_idx/:target_idx" component={Zone} />
                    <Route path="config" component={Config}/>
                    <Route path="about" component={About}/>
                    <Route path="*" component={NoMatch}/>
                </Route>
            </Router>
        </Provider>,
        document.getElementById('mount')
    );
}
render();

window.addEventListener('resize', () => {
    fastDebounce(render);
}, true);
