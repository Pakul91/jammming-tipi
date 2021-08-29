import React from "react";
import "./Loader.css";
import loadingImg from "./Loader.ico";

class Loader extends React.Component {
  render() {
    return (
      <div className="loader">
        <img src={loadingImg} alt="" />
        <p>{this.props.message}</p>
      </div>
    );
  }
}

export default Loader;
