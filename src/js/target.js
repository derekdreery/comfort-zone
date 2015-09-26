import React from 'react';
import cx from 'classnames';
import {Navigation} from 'react-router';

const TransitionGroup = React.TransitionGroup;

export default class Target extends React.Component {
  static propTypes = {
    data: React.PropTypes.object,
    position: React.PropTypes.number,
    area_position: React.PropTypes.number,
    total: React.PropTypes.number,
    area_angle: React.PropTypes.arrayOf(React.PropTypes.number),
    selected: React.PropTypes.oneOf(['selected', 'before', false]),
    show_extra: React.PropTypes.number.isRequired,
    hide_when_selected: React.PropTypes.bool.isRequired
  }

  static defaultProps = {
    show_extra: 0.1,
    hide_when_selected: true
  }

  /**
   * The renderer will assume we are in a normalized co-ordinate space where
   * the containing circle is origin (0,0) with radius 1, it also assumes that
   *
   */
  render() {
    const {data, position, total, area_total, area_angle, hide_when_selected,
      area_position, selected, onSelect, show_extra, ...props} = this.props;
    const segment_ratio = 1 / total;
    const inner_ratio_noselected = position * segment_ratio;
    const outer_ratio_noselected = (position + 1) * segment_ratio;
    const inner_ratio = selected == 'before' ?
      inner_ratio_noselected + show_extra : inner_ratio_noselected;
    const outer_ratio = selected == 'selected' || selected == 'before' ?
      outer_ratio_noselected + show_extra : outer_ratio_noselected;
    const outer_start = [Math.sin(area_angle[0]) * outer_ratio,
      Math.cos(area_angle[0]) * outer_ratio].join(' ');
    const outer_end = [Math.sin(area_angle[1]) * outer_ratio,
      Math.cos(area_angle[1]) * outer_ratio].join(' ');
    const inner_start = [Math.sin(area_angle[0]) * inner_ratio,
      Math.cos(area_angle[0]) * inner_ratio].join(' ');
    const inner_end = [Math.sin(area_angle[1]) * inner_ratio,
      Math.cos(area_angle[1]) * inner_ratio].join(' ');
    // The following are necessary as the arcs must go the opposite way
    // for the whole circle (it's to do with greater arcs or something)
    const single = area_total === 1 ? "1" : "0";
    const single_complement = area_total === 1 ? "0" : "1";
    // Stuff for color
    const not_selected = hide_when_selected &&
      !(selected === 'selected' || selected === null);
    const MAX_COUNT = 4;
    const action_ratio = data.count / MAX_COUNT;
    const no_action_ratio = 1 - action_ratio;
    const hue = 30 /* orange */ * (1-action_ratio) + 120 /* green */ * action_ratio;
    const saturation = 50;
    const lightness = not_selected ? 80 : 70; // lighter when not selected
    return <path
      onClick={(event) => {
        onSelect(event);
        window.location.hash = `#/detail/${area_position}/${position}`
      }}
      style={{
        fill: `hsl(${hue},${saturation}%,${lightness}%)`
      }}
      d={`M ${outer_start} `+
        `A ${outer_ratio} ${outer_ratio} 0 0 ${single} ${outer_end} `+
        `L ${inner_end} `+
        `A ${inner_ratio} ${inner_ratio} 0 0 ${single_complement} ${inner_start} `+
        `Z`} className={cx({
          segment: true,
        })} />;
  }
}
