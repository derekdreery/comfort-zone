import React from 'react';
import Zone from './zone';
import Detail from './detail';

export default class ZoneDetail extends React.Component {

  _reset_selected = () => {
    window.location.hash = '#/';
  }

  _setSelected = (evt, area_idx, idx) => {
    evt.stopPropagation();
    window.location.hash = `#/detail/${area_idx}/${idx}`;
  }

  componentDidMount() {
    window.addEventListener('click', this._reset_selected, false);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this._reset_selected, false);
  }

  render() {
    const {...props} = this.props;
    return <Zone onSelect={this._setSelected} {...props}>
      <Detail />
    </Zone>;
  }
}
