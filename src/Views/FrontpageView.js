import React, { Component } from "react";
class FrontpageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: true
    };
  }
  render() {
    return <p>Frontpage</p>;
  }
}
export default FrontpageView;
