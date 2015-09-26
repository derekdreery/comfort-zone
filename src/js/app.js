import React from 'react';
import {Link} from 'react-router';

export default class App extends React.Component {
  static defaultProps = {
    activePage: 0
  }
  static propTypes = {
    activePage: React.PropTypes.number
  }
  state = {

  }
  render() {
    const {pages, ...props} = this.props;
    return <div className="container">
      <header>
        <Link className="btn-nav" to='/'>Home</Link>
        <nav>
          <ul>
            <li><Link className="btn-nav" to='/config'>Config</Link></li>
            <li><Link className="btn-nav" to='/about'>About</Link></li>
          </ul>
        </nav>
      </header>
      {this.props.children}
    </div>;
  }
}
