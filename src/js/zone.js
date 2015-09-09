import React from 'react';

import {Vect} from './lib/number';
import TargetArea from './target-area';

export default class Zone extends React.Component {
  static defaultProps = {
    target_areas: [{
      name: "example",
      targets: [{
        name: "r1",
        achieved: true
      }]
    }, {
      name: "example 2",
      targets: [{
        name: "r21",
        achieved: true
      }, {
        name: "r22",
        achieved: false
      }]
    }, {
      name: 'tanksy',
      targets: [{
        name: "love me",
        achieved: true
      }, {
        name: "get thin",
        achieved: true
      }, {
        name: "get self confidence",
        achieved: false
      }]
    }]
  }

  componentDidMount() {
    this.makeSquare();
  }

  componentDidUpdate() {
    this.makeSquare();
  }

  /**
   *
   */
  render() {
    //console.log("Render: "+new Date());
    const RADIUS = 0.45;
    const target_areas = this.props.target_areas;
    const target_areas_count = target_areas.length;
    const target_area_angle = 2 * Math.PI * (1 / target_areas.length);
    const {children, ...props} = this.props;

    return (<section className="main-container">
        {this.props.children}
        <svg version="1.1"
             ref="svg"
             baseProfile="full"
             className="zone-container"
             xmlns="http://www.w3.org/2000/svg">
          <g ref="main_group">
            {target_areas.map(function(target_area, area_idx) {
              return <TargetArea key={area_idx}
                                 data={target_area}
                                 position={area_idx}
                                 angle={target_area_angle}
                                 total={target_areas_count} />
            })}
          </g>
        </svg>
    </section>);
  }

  /**
   * Make sure we are a square
   *
   * We have to use parent for height and parent.parent for width (because
   * parent.width is small because of auto centering margin)
   * TODO this is a target for optimization
   */
  makeSquare() {
    const dom = React.findDOMNode(this.refs.svg);
    const sectionDom = dom.parentNode;
    const containerDom = sectionDom.parentNode;
    const height = sectionDom.getBoundingClientRect().height;
    const width = containerDom.getBoundingClientRect().width;
    const size = Math.min(width, height);
    dom.setAttribute('height', size);
    dom.setAttribute('width', size);
    let g = React.findDOMNode(this.refs.main_group);
    g.setAttribute('transform', 'scale('+size+') translate(0.5, 0.5) '+
    'scale(0.45)');
  }
}
