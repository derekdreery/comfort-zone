import React from 'react';
import {Router, Route, IndexRoute} from 'react-router';

import {} from './lib/polyfill';
import {} from '../stylus/main.styl';

import App from './app';
import Zone from './zone';
import Detail from './detail';
import About from './about';
import NoMatch from './no-match';

import Data from './lib/data';
import {fastDebounce} from './lib/util';

function render() {
  React.render((<Router>
    <Route path="/" component={App}>
      <IndexRoute component={Zone}>
        <Route path="detail/:area_idx/:target_idx" component={Detail} />
      </IndexRoute>
      <Route path="about" component={About}/>
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>), document.body);
}

render();

window.addEventListener('resize', () => {
  fastDebounce(render);
}, true);
