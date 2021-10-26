import React from "react";
import "./TrackList.css";
import Track from "../Track/Track";

class TrackList extends React.Component {
  render() {
    return (
      <div className="TrackList">
        {this.props.tracks.map((track) => {
          return (
            <Track
              track={track}
              key={track.id}
              playing={track.playing}
              onAdd={this.props.onAdd}
              onRemove={this.props.onRemove}
              isRemoval={this.props.isRemoval}
              playTrack={this.props.playTrack}
              pauseTrack={this.props.pauseTrack}
            />
          );
        })}
      </div>
    );
  }

  componentDidUpdate() {}
}

export default TrackList;
