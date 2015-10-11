import React from 'react';
import {Router} from 'react-router';

import {Vect, getInts} from '../lib/number';
import {getData} from '../lib/data';
import TargetArea from './target-area';
import Detail from './detail';
import NoMatch from './no-match';

export default class Zone extends React.Component {

  _areas_callback = (areas) => {
    this.setState({
      target_areas: areas
    });
  }

  _reset_selected = () => {
    window.location.hash = `#/`;
  }

  state = {
    target_areas: []
  }

  static defaultProps = {
    selected: null,
    /**
     * TODO this should use something in router so it works with
     * HTML5 as well as hash
     */
    onSelect: (evt, area_idx, idx) => {
      evt.stopPropagation();
      const newloc = `#/detail/${area_idx}/${idx}`;
      const home = `#/`;
      const hash = window.location.hash.substring(
        0,
        window.location.hash.indexOf('?')
      );
      if(hash === newloc) {
        window.location.hash = home;
      } else {
        window.location.hash = newloc;
      }
    }
  }

  static propTypes = {
    selected: React.PropTypes.array,
    onSelect: React.PropTypes.func
  }

  /**
   * Register event listeners and make sure the display is square
   */
  componentDidMount() {
    this.makeSquare();
    getData().registerAreas(this._areas_callback);
    window.addEventListener('click', this._reset_selected, false);
  }

  /**
   * Re-square after browser resize
   */
  componentDidUpdate() {
    this.makeSquare();
  }

  /**
   * Unregister event listeners
   */
  componentWillUnmount() {
    window.removeEventListener('click', this._reset_selected, false);
    getData().unregisterAreas(this._areas_callback);
  }

  /**
   *
   */
  render() {
    //console.log("Render: "+new Date());
    const PI2 = 2 * Math.PI;
    const target_areas = this.state.target_areas;
    const target_areas_count = target_areas.length;
    const target_area_angle = PI2 / target_areas_count;

    let {target_idx, area_idx} = getInts(this.props.params);

    const {children, onSelect, params, ...props} = this.props;
    let detail = null;
    if(target_idx !== undefined) {
      const area = target_areas[area_idx];
      if(!area) {
        return <NoMatch />;
      }
      const target = area.targets[target_idx];
      if(!target) {
        return <NoMatch />;
      }
      detail = <Detail area={area} target_idx={target_idx} target={target}/>
    }
    return (<section className="main-container">
      <div className="svg-container">
        <svg version="1.1"
             ref="svg"
             baseProfile="full"
             className="zone-container"
             xmlns="http://www.w3.org/2000/svg">
          <g ref="main_group">
            {target_areas.map((target_area, idx) => {
              return <TargetArea key={idx}
                data={target_area}
                position={idx}
                angle={target_area_angle}
                total={target_areas_count}
                onSelect={onSelect}
                selected={
                  target_idx !== undefined ? (
                    area_idx === idx ?
                      target_idx : false
                  ) : null
                }
              />
            })}
          </g>
        </svg>
      </div>
      {detail}
      {children}
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
    // bail if we are on 404
    if(!dom) {
      return;
    }
    const sectionDom = dom.parentNode;
    const containerDom = sectionDom.parentNode;
    const height = sectionDom.getBoundingClientRect().height;
    const width = sectionDom.getBoundingClientRect().width;
    const size = Math.min(width, height);
    dom.setAttribute('height', size);
    dom.setAttribute('width', size);
    let g = React.findDOMNode(this.refs.main_group);
    g.setAttribute('transform', 'scale('+size+') translate(0.5, 0.5) '+
    'scale(0.45)');
  }
}
