import React from "react";
import "./Pagination.css";

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    console.log(e.target.innerHTML);
    e.target.innerHTML === "Next"
      ? this.props.changePage(1)
      : this.props.changePage(-1);
  }

  render() {
    const lastPage = Math.ceil(
      this.props.tracks.length / this.props.resultsPerPage
    );

    return (
      <div className="pagination">
        <button
          className={`paginationBtn ${this.props.page < 2 ? "hidden" : ""}`}
          onClick={this.handleChange}
        >
          Previous
        </button>
        <span>Page {this.props.page}</span>
        <button
          className={`paginationBtn ${
            this.props.page === lastPage ? "hidden" : ""
          }`}
          onClick={this.handleChange}
        >
          Next
        </button>
      </div>
    );
  }
}

export default Pagination;
