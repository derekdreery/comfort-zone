import React from 'react';
import Zone from './zone';
import Data from '../lib/data';

export default class Detail extends React.Component {

  state = {
    data: null
  }

  getActions = (actions) => {
    this.setState({
      data: actions ? actions.map((action) => {
        action.date = new Date(action.date).toString();
        return action;
      }) : null
    })
  }

  recordAction = () => {
    const {area, target_idx} = this.props;
    Data.getData().addAction(area.name, target_idx).catch((err) => {
      if(err.name === "ConstraintError") {
        alert("You have already done this exposure today");
      } else {
          throw err;
      }
    });
  }

  componentDidMount() {
    Data.getData().registerActions(this.getActions, this.props.area.name,
      this.props.target_idx);
  }

  componentWillUnmount() {
    Data.getData().unregisterActions(this.getActions);
  }

  componentWillReceiveProps(nextProps) {
    const props = this.props;
    if(props.area !== nextProps.area ||
      props.target_idx !== nextProps.target_idx
    ) {
      this.setState({
        actions: []
      });
      const data = Data.getData();
      data.unregisterActions(this.getActions);
      data.registerActions(this.getActions, nextProps.area.name,
      nextProps.target_idx);
    }
  }

  render() {
    const {area, target, ...props} = this.props;
    const {data} = this.state;
    return <div className="detail-container" onClick={(evt) => {
      evt.stopPropagation();
    }}>
      <h1 className="title">
        <span>{area.name}</span>
        <span className="spacer">{'≫'}</span>
        <span>{target.name}</span>
      </h1>
      { data ? data.map((action, idx) => {
        return <div key={idx}>{action.date}</div>;
      }) : <span>Loading data</span>}
      <button onClick={() => {
        this.recordAction();
      }}>Record Action</button>
    </div>;
  }
}
