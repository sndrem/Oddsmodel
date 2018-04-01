import React, { Component } from "react";
import {
  Header,
  Table,
  Segment,
  Dimmer,
  Loader,
  Button,
  TextArea,
  Grid
} from "semantic-ui-react";
import moment from "moment";
import Abbreviations from "../../Tools/Abbreviations";

class MatchFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        matches: [],
        freeText: ""
      },
      loading: true
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      {
        data: {
          matches: nextProps.matches
        },
        loading: false
      },
      () => {
        this.formatFreeText(this.props.league);
      }
    );
  }

  createElements = matches => {
    return matches.map(m => (
      <Table.Row key={m.matchId}>
        <Table.Cell>
          {m.homeTeamName} - {m.awayTeamName}
        </Table.Cell>
        <Table.Cell>{moment(m.start).format("dddd DD. MMMM HH:mm")}</Table.Cell>
        <Table.Cell>
          {this.formatPercent(m.bets.oddsMarkets[0].homeValue)}
        </Table.Cell>
        <Table.Cell>
          {this.formatPercent(m.bets.oddsMarkets[0].drawValue)}
        </Table.Cell>
        <Table.Cell>
          {this.formatPercent(m.bets.oddsMarkets[0].awayValue)}
        </Table.Cell>
      </Table.Row>
    ));
  };

  formatPercent = value => `${(value * 100).toFixed(2)} %`;

  formatFreeText = league => {
    if (this.state.data.matches.length > 0) {
      const abbrevs = new Abbreviations();
      const text = this.state.data.matches
        .map(m => {
          const homeTeamAbbrev = abbrevs.getAbbreviations(
            m.homeTeamName,
            league
          );
          const awayTeamAbbrev = abbrevs.getAbbreviations(
            m.awayTeamName,
            league
          );

          const homeTeamBet = this.formatPercent(
            m.bets.oddsMarkets[0].homeValue
          );

          const drawBet = this.formatPercent(m.bets.oddsMarkets[0].drawValue);

          const awayTeamBet = this.formatPercent(
            m.bets.oddsMarkets[0].awayValue
          );

          return `${homeTeamAbbrev} - ${awayTeamAbbrev}\nH: ${homeTeamBet} U: ${drawBet} B: ${awayTeamBet}`;
        })
        .join("\n\n");
      this.setState({
        data: {
          freeText: text,
          matches: this.state.data.matches
        }
      });
    }
  };

  render() {
    const elements = this.createElements(this.state.data.matches);
    return (
      <Grid columns={2}>
        <Grid.Column>
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
                  <Table.HeaderCell>Hjemme</Table.HeaderCell>
                  <Table.HeaderCell>Uavgjort</Table.HeaderCell>
                  <Table.HeaderCell>Borte</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>{elements}</Table.Body>
            </Table>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Header as="h3">Fritekst til stolpe</Header>
          <TextArea autoHeight value={this.state.data.freeText} />
        </Grid.Column>
      </Grid>
    );
  }
}
export default MatchFeed;
