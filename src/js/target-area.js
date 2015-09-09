import React from 'react';

import Target from './target';

export default class TargetArea extends React.Component {
  static propTypes = {
      data: React.PropTypes.shape({
          targets: React.PropTypes.array,
          name: React.PropTypes.string
      }).isRequired,
      position: React.PropTypes.number.isRequired,
      total: React.PropTypes.number.isRequired
  }

  render() {
    const {position, total, angle, data, ...props} = this.props;
    const targets = data.targets;
    const targets_count = targets.length;
    const start_angle = position * angle;
    const end_angle = (position + 1) * angle;
    return <g>
      {targets.map((target, target_idx) => {
        return <Target data={target}
                       key={target_idx}
                       area_angle={[start_angle, end_angle]}
                       position={target_idx}
                       total={targets_count} />
      })}
    </g>;
  }
}
