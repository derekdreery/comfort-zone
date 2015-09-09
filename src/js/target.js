import React from 'react';
import cx from 'classnames';

export default class Target extends React.Component {
  static propTypes = {
    data: React.PropTypes.object,
    position: React.PropTypes.number,
    total: React.PropTypes.number,
    area_angle: React.PropTypes.arrayOf(React.PropTypes.number)
  }
  /**
   * The renderer will assume we are in a normalized co-ordinate space where
   * the containing circle is origin (0,0) with radius 1, it also assumes that
   *
   */
  render() {
    const {data, position, total, area_angle, ...props} = this.props;
    const segment_ratio = 1 / total
    const inner_ratio = position * segment_ratio;
    const outer_ratio = inner_ratio + segment_ratio;
    const outer_start = [Math.sin(area_angle[0]) * outer_ratio,
      Math.cos(area_angle[0]) * outer_ratio].join(' ');
    const outer_end = [Math.sin(area_angle[1]) * outer_ratio,
      Math.cos(area_angle[1]) * outer_ratio].join(' ');
    const inner_start = [Math.sin(area_angle[0]) * inner_ratio,
      Math.cos(area_angle[0]) * inner_ratio].join(' ');
    const inner_end = [Math.sin(area_angle[1]) * inner_ratio,
      Math.cos(area_angle[1]) * inner_ratio].join(' ');
    return <path
      d={`M ${outer_start} `+
        `A ${outer_ratio} ${outer_ratio} 0 0 0 ${outer_end} `+
        `L ${inner_end} `+
        `A ${inner_ratio} ${inner_ratio} 0 0 1 ${inner_start} `+
        `Z`} className={cx({
          segment: true,
          achieved: data.achieved
        })}/*style={{
          strokeWidth: 0.1,
          stroke: `hsl(${((area_angle[0] + inner_ratio) * 100) % 360}, 100%, 50%)`
        }}*/ />;
  }
}
