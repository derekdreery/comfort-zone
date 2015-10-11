import React from 'react';

import Target from './target';

export default class TargetArea extends React.Component {
  static propTypes = {
      data: React.PropTypes.shape({
          targets: React.PropTypes.array,
          name: React.PropTypes.string
      }).isRequired,
      position: React.PropTypes.number.isRequired,
      total: React.PropTypes.number.isRequired,
      selected: React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.bool
      ]),
      onSelect: React.PropTypes.func
  }

  static defaultProps = {
    onSelect: () => {}
  }

  render() {
    const {position, total, angle, selected, data,
      onSelect, ...props} = this.props;
    const targets = data.targets;
    const targets_count = targets.length;
    const start_angle = position * angle;
    const end_angle = (position + 1) * angle;
    const mid_angle = (position + 0.5) * angle;
    // Arc starts at PI and goes backward (don't ask me why)
    const pi2 = Math.PI / 2.0;
    const edgex = -(Math.cos(mid_angle + pi2) * 1.01);
    const edgey = Math.sin(mid_angle + pi2) * 1.01;
    const idname = `areapath${position}`;
    return <g>
      <defs>
        <path id={idname} d={`M ${edgex} ${edgey} L 1 ${edgey}`}/>
      </defs>
      {targets.map((target, target_idx) => {
        var sel;
        if(selected === null) {
          sel = null;
        } else if(selected === false) {
          sel = false;
        } else if(selected === target_idx) {
          sel = 'selected';
        } else if(selected < target_idx) {
          sel = 'before';
        }
        return <Target data={target}
                       key={target_idx}
                       area_angle={[start_angle, end_angle]}
                       position={target_idx}
                       area_position={position}
                       area_total={total}
                       selected={sel}
                       onSelect={onSelect}
                       total={targets_count} />
      })}
      <text>
        <textpath xlinkHref={idname}>{data.name}</textpath>
      </text>
    </g>;
  }
}
