import React from "react";
import "./SearchBar.css";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: "",
    };

    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }
  search() {
    this.props.onSearch(this.state.term);
  }

  handleTermChange(e) {
    this.setState({ term: e.target.value });
  }

  ConnectOrSearch() {
    if (this.props.isConnected || window.location.hash) {
      return (
        <div className="SearchBar">
          <input
            placeholder="Enter A Song, Album, or Artist"
            onChange={this.handleTermChange}
          />
          <button
            className="btn SearchButton"
            onClick={() => {
              this.props.onConnection();
              this.search();
            }}
          >
            SEARCH
          </button>
        </div>
      );
    } else {
      return (
        <div className="SearchBar">
          <button
            className="btn connectButton"
            onClick={this.props.onConnection}
          >
            Click to connect to Spotify!
          </button>
          <p className="description">
            Clicking the above button will connect the application to your
            Spotify account. This will allow you to search for songs and artists
            to create your own custom-made playlist and upload it to your
            Spotify account!
          </p>
        </div>
      );
    }
  }

  render() {
    return this.ConnectOrSearch();
  }
}

export default SearchBar;
