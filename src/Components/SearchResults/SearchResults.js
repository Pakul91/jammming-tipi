import React from "react";
import "./SearchResults.css";
import TrackList from "../TrackList/TrackList";
import Pagination from "../Pogination/Pagination";

class SearchResults extends React.Component {
  render() {
    const start = (this.props.page - 1) * this.props.resultsPerPage;
    const end = this.props.page * this.props.resultsPerPage;

    const tracksToDisplay = this.props.searchResults
      .filter((track) => !this.props.playlistTracks.includes(track))
      .slice(start, end);

    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <TrackList
          tracks={tracksToDisplay}
          onAdd={this.props.onAdd}
          isRemoval={false}
          resultsPerPage={this.props.resultsPerPage}
        />

        {this.props.searchResults.length !== 0 ? (
          <Pagination
            page={this.props.page}
            tracks={this.props.searchResults}
            changePage={this.props.changePage}
            resultsPerPage={this.props.resultsPerPage}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default SearchResults;
