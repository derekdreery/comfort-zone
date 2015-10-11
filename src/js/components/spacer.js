import React from 'react';
import cx from 'classnames';

export default class Spacer extends React.Component {
  static propTypes = {
    stretch: React.PropTypes.bool
  }
  static defaultProps = {
    stretch: true
  }

  render() {
    const {className, stretch, ...props} = this.props;
    const newClassName = cx({
      stretch: stretch,
    }, className);
    return <span className={newClassName} {...props} />;
  }
}
