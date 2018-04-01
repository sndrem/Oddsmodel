import React, { Component } from "react";
import { Header, Table, Segment, Dimmer, Loader } from "semantic-ui-react";
import moment from "moment";

class MatchFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        matches: []
      },
      loading: true
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: {
        matches: nextProps.matches
      },
      loading: false
    });
  }

  createElements = matches => {
    return matches.map(m => (
      <Table.Row key={m.matchId}>
        <Table.Cell>
          {m.homeTeamName} - {m.awayTeamName}
        </Table.Cell>
        <Table.Cell>{moment(m.start).format("dddd DD. MMMM HH:mm")}</Table.Cell>
        <Table.Cell>
          <b>H:</b> {this.formatPercent(m.bets.oddsMarkets[0].homeValue)}
          <b>U:</b> {this.formatPercent(m.bets.oddsMarkets[0].drawValue)}
          <b>B:</b> {this.formatPercent(m.bets.oddsMarkets[0].awayValue)}
        </Table.Cell>
      </Table.Row>
    ));
  };

  formatPercent = value => `${(value * 100).toFixed(2)} %`;

  render() {
    const elements = this.createElements(this.state.data.matches);
    return (
      <Segment>
        <Dimmer active={this.state.loading}>
          <Loader>Henter kamper for {this.props.league}</Loader>
        </Dimmer>
        <Header as="h3">{this.props.league}</Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Kamp</Table.HeaderCell>
              <Table.HeaderCell>Dato/Kl.</Table.HeaderCell>
              <Table.HeaderCell>Odds</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>{elements}</Table.Body>
        </Table>
      </Segment>
    );
  }
}
export default MatchFeed;
