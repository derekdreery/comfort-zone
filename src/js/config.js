import React from 'react';
import cx from 'classnames';

import {getData} from './lib/data';

export default class Config extends React.Component {

  state = {
    target_areas: [],
    editing: {
      type: null,
      idx: null
    },
    highlighted: {
      type: null,
      idx: null
    }
  };
  /**
   *
   */
  componentDidMount() {
    getData().registerAreas(this.updateAreas);
    window.addEventListener('click', this.clearEditing, false);
    window.addEventListener('click', this.clearHighlighted, false);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.clearEditing, false);
    window.removeEventListener('click', this.clearHighlighted, false);
    getData().unregisterAreas(this.updateAreas);
  }

  /**
   *
   */
  render() {
    return (<section className="config-container">
      <div>
        {this.state.target_areas.map((area, area_idx) => {
          const editing = this.state.editing;

          const name_el = editing.type === "area" && editing.idx === area_idx ?
            <input value={area.name} onChange={(evt) => {
              const value = evt.target.value;
              this.setState((state) => {
                area.name = value;
              })
            }} onClick={(evt) => {
              evt.stopPropagation();
            }}/> : <span onClick={(event) => {
                this.setEditing("area", area_idx);
              }}>
                {area.name}
              </span>;

          return (<div key={area_idx} className="area-config">
            <div className="area-config-name" onClick={(event) => {
              // highlight this rown
              this.setHighlighted('area', area_idx);
              event.stopPropagation();
            }}>
              {name_el}
              <span className="icon-remove btn"
                onClick={() => {
                  this.removeTargetArea(area_idx)
                }} />
            </div>
            <div className="area-config-targets">
              <div className="current-targets">
                {area.targets.map((target, target_idx) => {

                  const name_el =
                    this.isEditing("target", area_idx, target_idx) ?
                    <input value={target.name} onChange={(evt) => {
                      const value = evt.target.value;
                      this.setState((state) => {
                        target.name = value;
                      })
                    }} onClick={(evt) => {
                      evt.stopPropagation();
                    }}/> :
                    <span key="name" onClick={(event) => {
                      event.stopPropagation();
                      this.setEditing("target", area_idx, target_idx)
                    }}>
                      {target.name}
                    </span>;

                  return (<div key={target_idx} className={cx({
                      target: true,
                      highlighted: this.isHighlighted("target",
                        area_idx, target_idx)
                    })}>
                    {name_el}
                    <span className="btn-row">
                      <span key="reset" className="icon-refresh btn" />
                      <span key="delete" className="icon-remove btn"
                            onClick={() => {
                              this.removeTarget(area_idx, target_idx);
                            }} />
                    </span>
                  </div>);
                })}
              </div>
              <button className="btn-add-target"
                      onClick={this.addTarget.bind(this, area_idx)}>
                Add new target
              </button>
            </div>
          </div>);
        })}
      </div>
      <button className="btn-add-area"
              onClick={this.addTargetArea.bind(this)}>
        Add new Target Area
      </button>
      <button className="btn-add-area"
              onClick={this.saveTargetAreas}>
        Save
      </button>
    </section>);
  }

  addTargetArea = () => {
    this.setState((state) => {
      state.target_areas.push({
        name: `New Target Area ${state.target_areas.length}`,
        targets: [{
          name: "New Target 0",
          accomplished: false
        }]
      });
      return state;
    });
  }

  removeTargetArea = (area_idx) => {
    this.setState((state) => {
      state.target_areas.splice(area_idx, 1);
    });
  }

  addTarget = (area_idx) => {
    this.setState((state) => {
      const targets = state.target_areas[area_idx].targets;
      targets.push({
        name: `New target ${targets.length}`,
        accomplished: false
      })
    })
  }

  removeTarget = (area_idx, target_idx) => {
    this.setState((state) => {
      state.target_areas[area_idx].targets.splice(target_idx, 1);
    })
  }

  setEditing = (type, area_idx, target_idx) => {
    this.setHighlighted(type, area_idx, target_idx);
    this.setState({
      editing: {
        type: type,
        idx: target_idx === undefined ? area_idx : [area_idx, target_idx]
      }
    })
  }

  /**
   *
   */
  clearEditing = () => {
    this.setState({
      editing: {
        type: null,
        idx: null
      }
    });
  }

  /*
   *
   */
  isEditing(type, area_idx, target_idx) {
    const editing = this.state.editing;
    return editing.type === type &&
      editing.idx[0] === area_idx &&
      editing.idx[1] === target_idx;
  }

  setHighlighted = (type, area_idx, target_idx) => {
    this.setState({
      highlighted: {
        type: type,
        idx: target_idx === undefined ? area_idx : [area_idx, target_idx]
      }
    })
  }

  /**
   *
   */
  clearHighlighted = () => {
    this.setState({
      highlighted: {
        type: null,
        idx: null
      }
    });
  }

  /*
   *
   */
  isHighlighted(type, area_idx, target_idx) {
    const highlighted = this.state.highlighted;
    return highlighted.type === type &&
      highlighted.idx[0] === area_idx &&
      highlighted.idx[1] === target_idx;
  }

  /**
   *
   */
  saveTargetAreas = () => {
    getData().setAreas(this.state.target_areas);
  }

  updateAreas = (areas) => {
      this.setState({
        target_areas: areas
      });
    }

}
