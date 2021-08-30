import React from "react";
import "./Playlist.css";
import Loader from "../Loader/Loader";

import TrackList from "../TrackList/TrackList";

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(e) {
    this.props.onNameChange(e.target.value);
    console.log(e.target.value);
  }

  render() {
    return (
      <div className="Playlist">
        <input
          value={this.props.playlistName}
          onInput={this.handleNameChange}
        />

        {this.props.isLoading ? (
          <Loader message="Uploading your playlist!" />
        ) : (
          <TrackList
            playlistName={this.props.playlistName}
            tracks={this.props.playlistTracks}
            onRemove={this.props.onRemove}
            isRemoval={true}
          />
        )}

        {this.props.isLoading || !this.props.isConnected ? (
          ""
        ) : (
          <button className="Playlist-save" onClick={this.props.onSave}>
            SAVE TO SPOTIFY
          </button>
        )}

        {/* <button onClick={this.props.x}>X</button> */}
      </div>
    );
  }
}

export default Playlist;
