import React from 'react';

export default class NoMatch extends React.Component {
  render() {
    return (<p className="paragraph">
      We're sorry, but the current url doesn't point to any page in this app.
      <br />Please click a link above to continue.
      </p>);
  }
}
