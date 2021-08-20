import React from "react";
import "./Track.css";

class Track extends React.Component {
  renderAction() {
    return (
      <button className="Track-action">
        {this.props.isRemoval ? "-" : "+"}
      </button>
    );
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>track name </h3>
          <p>track artist | track album </p>
          {this.renderAction}
        </div>
      </div>
    );
  }
}

export default Track;
