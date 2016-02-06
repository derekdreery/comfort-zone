import React from 'react';
import {Link} from 'react-router';

import Spacer from './spacer';

export default class App extends React.Component {
    static defaultProps = {
        activePage: 0
    };

    static propTypes = {
        activePage: React.PropTypes.number
    };

    render() {
        const {pages, ...props} = this.props;
        return <div className="container">
        <header>
            <nav>
                <Link className="btn-nav" to="/">Home</Link>
                <Spacer stretch={true} />
                <Link activeClassName="active"
                      className="btn-nav" to="/config">Config</Link>
                <Link activeClassName="active"
                      className="btn-nav" to="/about">About</Link>
            </nav>
        </header>
        {this.props.children}
        </div>;
    }
}
