import React from "react";
import "./App.css";

import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../util/Spotify";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: "My Playlist",
      playlistTracks: [],
      isConnected: false,
      displayPage: 1,
      resultsPerPage: 11,
      isLoading: false,
    };

    this.changeIsConnected = this.changeIsConnected.bind(this);
    this.changePage = this.changePage.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.updateIsLoading = this.updateIsLoading.bind(this);
  }

  changeIsConnected() {
    Spotify.getAccessToken();
    this.setState({ isConnected: true });
  }

  changePage(value = 0) {
    const currentPage = this.state.displayPage;

    if (value === 0) {
      this.setState({ displayPage: 1 });
    } else {
      this.setState({ displayPage: currentPage + value });
    }
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;

    // check if playlistTracks contains 'track'
    if (tracks.some((currentTrack) => currentTrack.id === track.id)) {
      //return if true
      return;
    }

    tracks.push(track);
    this.setState({ playlistTracks: tracks });
  }

  removeTrack(track) {
    //create array without selected track
    const tracks = this.state.playlistTracks.filter(
      (currentTrack) => currentTrack.id !== track.id
    );

    this.setState({ playlistTracks: tracks });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  updateIsLoading() {
    !this.state.isLoading
      ? this.setState({ isLoading: true })
      : this.setState({ isLoading: false });
  }

  savePlaylist() {
    this.updateIsLoading();
    const trackUris = this.state.playlistTracks.map((track) => track.uri);

    Spotify.savePlaylist(this.state.playlistName, trackUris)
      .then(() =>
        this.setState({
          playlistName: "New Playlist",
          playlistTracks: [],
        })
      )
      .then(() => setTimeout(this.updateIsLoading, 2000));
  }

  search(term) {
    //Set search results to an empty array
    this.setState({ searchResults: [] });
    //Set current page to 1
    this.changePage(0);
    //Load and display search results from spotify
    Spotify.search(term).then((searchResults) => {
      this.setState({ searchResults: searchResults });
    });
  }

  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar
            onSearch={this.search}
            onConnection={this.changeIsConnected}
            isConnected={this.state.isConnected}
            changePage={this.changePage}
          />
          <div className="App-playlist">
            <SearchResults
              page={this.state.displayPage}
              resultsPerPage={this.state.resultsPerPage}
              changePage={this.changePage}
              searchResults={this.state.searchResults}
              playlistTracks={this.state.playlistTracks}
              onAdd={this.addTrack}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              isLoading={this.state.isLoading}
              onSave={this.savePlaylist}
              x={this.updateIsLoading}
            />
          </div>
        </div>
      </div>
    );
  }
  // componentDidMount() {
  //   console.log("accessToken");
  //   if (accessToken) {
  //     console.log(accessToken);
  //     Spotify.getAccessToken();
  //   }
  // }
}

export default App;
