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

  ConnectBar() {
    return (
      <div className="SearchBar">
        <button className="btn connectButton" onClick={this.props.onConnection}>
          Click to connect to Spotify!
        </button>
        <div className="description">
          <h3>You haven't connected yet or your access token has expired.</h3>
          <p>
            Clicking the above button will connect the application to your
            Spotify account. This will allow you to search for songs and artists
            to create your own custom-made playlist and upload it to your
            Spotify account!
          </p>
        </div>
      </div>
    );
  }

  searchBar() {
    return (
      <div className="SearchBar">
        <input
          placeholder="Enter A Song, Album, or Artist"
          onChange={this.handleTermChange}
        />
        <button
          className="btn SearchButton"
          onClick={() => {
            this.search();
          }}
        >
          SEARCH
        </button>
      </div>
    );
  }

  render() {
    return this.props.isConnected ? this.searchBar() : this.ConnectBar();
  }
}

export default SearchBar;
