import React from "react";
import "./Track.css";
import playIcon from "./play.png";
import pauseIcon from "./pause.png";

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.playSample = this.playSample.bind(this);
    this.pauseSample = this.pauseSample.bind(this);

    this.sample = new Audio(this.props.track.preview);

    this.state = {
      isPlaying: false,
    };
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  playSample() {
    this.setState({ isPlaying: true });
    this.sample.play();
    this.sample.addEventListener("ended", () => {
      this.setState({ isPlaying: false });
    });
  }

  pauseSample() {
    this.setState({ isPlaying: false });
    this.sample.pause();
  }

  renderAction() {
    if (this.props.isRemoval === true) {
      return (
        <button className="Track-action" onClick={this.removeTrack}>
          -
        </button>
      );
    } else {
      return (
        <button className="Track-action" onClick={this.addTrack}>
          +
        </button>
      );
    }
  }

  sampleBtn() {
    if (!this.props.track.preview) {
      return (
        <div className="notAvail" title="Sample not available">
          <span>X</span>
        </div>
      );
    }
    if (!this.state.isPlaying) {
      return (
        <img
          className="icon"
          onClick={this.playSample}
          src={playIcon}
          alt=""
          title="Press to play a sample of the track!"
        />
      );
    }

    if (this.state.isPlaying) {
      return (
        <img
          className="icon"
          onClick={this.pauseSample}
          src={pauseIcon}
          alt=""
          title="Pause sample."
        />
      );
    }
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name} </h3>
          <p>
            {this.props.track.artist} | {this.props.track.album}
          </p>
        </div>
        {this.sampleBtn()}
        {this.renderAction()}
      </div>
    );
  }
}

export default Track;
