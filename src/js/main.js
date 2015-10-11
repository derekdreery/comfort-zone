import React from 'react';
import {Router, Route, IndexRoute} from 'react-router';

import {} from './lib/polyfill';
import {} from '../assets/css/font-awesome.css';
import {} from '../stylus/main.styl';

import App from './components/app';
import Zone from './components/zone';
import Detail from './components/detail';
import About from './components/about';
import Config from './components/config';
import NoMatch from './components/no-match';

import {getData} from './lib/data';
import {fastDebounce} from './lib/util';

function render() {
  React.render((<Router>
    <Route path="/" component={App}>
      <IndexRoute component={Zone} />
      <Route path="detail/:area_idx/:target_idx" component={Zone} />
      <Route path="config" component={Config}/>
      <Route path="about" component={About}/>
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>), document.body);
}
render();

window.addEventListener('resize', () => {
  fastDebounce(render);
}, true);
