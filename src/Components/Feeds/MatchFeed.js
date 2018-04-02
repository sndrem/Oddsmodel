import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Header,
  Table,
  Segment,
  Dimmer,
  Loader,
  TextArea,
  Grid
} from "semantic-ui-react";
import moment from "moment";
import "moment/locale/nb";
import Abbreviations from "../../Tools/Abbreviations";
import "./MatchFeed.css";

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
    return matches.filter(m => m.bets.oddsMarkets.length > 0).map(m => {
      const { homeValue, drawValue, awayValue } = m.bets.oddsMarkets[0];
      return (
        <Table.Row key={m.matchId}>
          <Table.Cell>
            {m.homeTeamName} - {m.awayTeamName}
          </Table.Cell>
          <Table.Cell width={5}>
            {moment(m.start)
              .add(2, "hours")
              .format("dddd DD. MMMM HH:mm")}
          </Table.Cell>
          {this.createBetCell(homeValue, homeValue > awayValue)}
          {this.createBetCell(drawValue)}
          {this.createBetCell(awayValue, awayValue > homeValue)}
        </Table.Row>
      );
    });
  };

  createBetCell = (bet, bestBet = null) => {
    const cssColor = this.getBestBetColor(bestBet);
    if (bet) {
      return (
        <Table.Cell className={cssColor} width={3}>
          {this.formatPercent(bet)}
        </Table.Cell>
      );
    }
    return <Table.Cell>-</Table.Cell>;
  };

  getBestBetColor = bet => {
    if (bet === null) {
      return "";
    }
    return bet ? "green" : "red";
  };

  // createTableCellsForBets = (bet, rest) => {
  //   if (rest.length === 2) {
  //     const rest1 = rest[0];
  //     const rest2 = rest[1];
  //     if (bet > draw && home > away) {
  //           <Table.Cell color="green">{this.formatPercent(home)}</Table.Cell>
  //           <Table.Cell>{this.formatPercent(draw)}</Table.Cell>
  //           <Table.Cell>{this.formatPercent(away)}</Table.Cell>
  //     } else if (draw > home && draw > away) {
  //           <Table.Cell>{this.formatPercent(home)}</Table.Cell>
  //           <Table.Cell color="orange">{this.formatPercent(draw)}</Table.Cell>
  //           <Table.Cell>{this.formatPercent(away)}</Table.Cell>
  //     } else if (away > home && away > draw) {
  //           <Table.Cell>{this.formatPercent(home)}</Table.Cell>
  //           <Table.Cell>{this.formatPercent(draw)}</Table.Cell>
  //           <Table.Cell color="green">{this.formatPercent(away)}</Table.Cell>
  //         </span>
  //     }
  //   }
  //   return <Table.Cell>Odds ikke tilgjengelig</Table.Cell>;
  // };

  formatPercent = value => `${(value * 100).toFixed(1)} %`;

  formatFreeText = league => {
    if (this.state.data.matches.length > 0) {
      const abbrevs = new Abbreviations();
      const text = this.state.data.matches
        .filter(m => {
          const start = moment(m.start)
            .add(2, "hours")
            .hour();
          return start === 18;
        })
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
    } else {
      this.setState({
        data: {
          freeText: "",
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

            <Table striped>
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
          <span>Her dukker bare kamper som begynner kl. 18.00 opp.</span>
          <TextArea
            className="wide-text"
            autoHeight
            value={this.state.data.freeText}
          />
        </Grid.Column>
      </Grid>
    );
  }
}
MatchFeed.propTypes = {
  league: PropTypes.string.isRequired
};
export default MatchFeed;
