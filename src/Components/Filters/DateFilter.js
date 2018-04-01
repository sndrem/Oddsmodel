import React, { Component } from "react";
import moment from "moment";
class DateFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        date: moment(new Date()).format("YYYY-MM-DD")
      },
      loading: true
    };
  }

  handleChange = event => {
    event.preventDefault();
    this.props.updateDate(new Date(event.target.value));
    this.setState({ data: { date: event.target.value } });
  };
  render() {
    return (
      <input
        type="date"
        value={this.state.data.date}
        onChange={this.handleChange}
      />
    );
  }
}
export default DateFilter;
