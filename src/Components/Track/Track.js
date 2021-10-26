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
  }

  addTrack() {
    this.props.onAdd(this.props.track);
    this.pauseSample();
  }

  removeTrack() {
    this.pauseSample();
    this.props.onRemove(this.props.track);
  }

  playSample() {
    this.props.playTrack(this.props.track);
    this.sample.play();
    this.sample.addEventListener("ended", () => {
      this.pauseSample();
    });
  }

  pauseSample() {
    this.props.pauseTrack(this.props.track);
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
    if (!this.props.playing) {
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

    if (this.props.playing) {
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

  componentDidUpdate(prevProps) {
    if (this.props.playing === false) {
      this.sample.pause();
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
