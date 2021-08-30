import React from "react";
import "./App.css";

import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../util/Spotify";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.storage = window.localStorage;

    this.state = {
      searchResults: [],
      playlistName: "My New Playlist",
      playlistTracks: [],
      isConnected: false,
      displayPage: 1,
      resultsPerPage: 11,
      isLoading: false,
    };

    // 1 Local storage methods
    this.storePlaylist = this.storePlaylist.bind(this);
    this.initiateStorage = this.initiateStorage.bind(this);
    this.loadStoredData = this.loadStoredData.bind(this);
    this.storePlaylistName = this.storePlaylistName.bind(this);
    // 2 Connection and loading methods
    this.changeIsConnected = this.changeIsConnected.bind(this);
    this.setDisconect = this.setDisconect.bind(this);
    this.updateIsLoading = this.updateIsLoading.bind(this);
    // 3 Pagination methods
    this.changePage = this.changePage.bind(this);
    // 4 Search and playlists related methods
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.clearPlaylist = this.clearPlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  //  ========== 1) Local storage methods =============
  // Create storage items
  initiateStorage() {
    // if storage item playlistTracks exists don't do anything if not create new
    this.storage.getItem("playlistTracks") ||
      this.storage.setItem("playlistTracks", []);
    // if storage item playlistName exists don't do anything if not create new
    this.storage.getItem("playlistName") ||
      this.storage.setItem("playlistName", "");
  }

  // update playlist on the local store
  storePlaylist(input) {
    const playlist = input;
    this.storage.setItem("playlistTracks", JSON.stringify(playlist));
  }

  // update playlistName on the local store
  storePlaylistName(input) {
    this.storage.setItem("playlistName", JSON.stringify(input));
  }

  // Load stored data
  loadStoredData() {
    if (this.storage.getItem("playlistTracks")) {
      this.setState({
        playlistTracks: JSON.parse(this.storage.getItem("playlistTracks")),
      });
    }

    if (this.storage.getItem("playlistName")) {
      this.setState({
        playlistName: JSON.parse(this.storage.getItem("playlistName")),
      });
    }
  }
  //  ======================================================

  // ========== 2) Connection and loading methods =============

  changeIsConnected() {
    // generate access token
    Spotify.getAccessToken();
    // if token is granted and placed in url change state to connected
    if (window.location.hash) this.setState({ isConnected: true });
  }

  setDisconect() {
    this.setState({ isConnected: false });
  }

  updateIsLoading() {
    !this.state.isLoading
      ? this.setState({ isLoading: true })
      : this.setState({ isLoading: false });
  }

  //  ======================================================

  // ========== 3) Pagination methods =============

  changePage(value = 0) {
    const currentPage = this.state.displayPage;

    if (value === 0) {
      this.setState({ displayPage: 1 });
    } else {
      this.setState({ displayPage: currentPage + value });
    }
  }

  //  ======================================================

  // ========== 4) Search and playlists related methods =============

  // Add track to the playlist
  addTrack(track) {
    let tracks = this.state.playlistTracks;

    // check if playlistTracks contains 'track'
    if (tracks.some((currentTrack) => currentTrack.id === track.id)) {
      //return if true
      return;
    }

    tracks.push(track);
    this.setState({ playlistTracks: tracks });
    this.storePlaylist(this.state.playlistTracks);
  }

  // Romve track from the tracklist
  removeTrack(track) {
    //create array without selected track
    const tracks = this.state.playlistTracks.filter(
      (currentTrack) => currentTrack.id !== track.id
    );

    this.setState({ playlistTracks: tracks });
    this.storePlaylist(this.state.playlistTracks);
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });

    this.storePlaylistName(name);
  }

  savePlaylist() {
    this.updateIsLoading();
    const trackUris = this.state.playlistTracks.map((track) => track.uri);

    Spotify.savePlaylist(this.state.playlistName, trackUris)
      .then(() =>
        this.setState({
          playlistName: "My New Playlist",
          playlistTracks: [],
        })
      )
      .then(() => setTimeout(this.updateIsLoading, 2000));
  }

  clearPlaylist() {
    this.setState({ playlistTracks: [], playlistName: "My New Playlist" });
    this.storePlaylist([]);
    this.storePlaylistName("My New Playlist");
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
              storeName={this.storePlaylistName}
              clearPlaylist={this.clearPlaylist}
              isLoading={this.state.isLoading}
              isConnected={this.state.isConnected}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    // Pass the function to the Spotify object. This will allow it to access the state: isConnected
    Spotify.importFunction(this.setDisconect);

    // Create local storage in the browser
    this.initiateStorage();

    // if there is access token in url
    if (window.location.hash) {
      // assign access token from url
      Spotify.getAccessToken();
      // set state to connected
      this.setState({ isConnected: true });
      // Load stored data
      this.loadStoredData();
    }
  }
}

export default App;
