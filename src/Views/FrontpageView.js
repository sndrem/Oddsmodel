import React, { Component } from "react";
import moment from "moment-timezone";
import { Header, Segment, Loader, Dimmer, Divider } from "semantic-ui-react";
import MatchFeed from "../Components/Feeds/MatchFeed";
import DateFilter from "../Components/Filters/DateFilter";

class FrontpageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        eliteserien: [],
        obosligaen: []
      },
      dateFilter: new Date(),
      loading: true
    };
  }

  componentDidMount() {
    document.title = "Odds";
    Promise.all([this.fetchMatches(), this.fetchBets()]).then(values => {
      const eliteserien = values[0].competitions[0].matches;
      const obosligaen = this.addHours(values[0].competitions[1].matches, 2);
      console.log(values[0].competitions);

      const bets = values[1].feed;
      const eliteserieBets = this.connectGamesAndBets(eliteserien, bets);
      const obosligaBets = this.connectGamesAndBets(obosligaen, bets);
      this.setState({
        data: {
          eliteserien: eliteserieBets,
          obosligaen: obosligaBets
        },
        loading: false
      });
    });
  }

  addHours = (matches, hour) =>
    matches.map(match => ({
      ...match,
      start: moment(match.start)
        .add(hour, "hours")
        .format()
    }));

  filterMatchesByDate = (matches, date = new Date()) => {
    return matches.filter(match => {
      const matchDay = new Date(match.start).toDateString();
      return matchDay === date.toDateString();
    });
  };

  connectGamesAndBets = (matches, bets) => {
    return matches.map(match => {
      const foundBet = bets.find(bet => bet.matchId === match.matchId);
      match.bets = foundBet;
      return match;
    });
  };

  fetchMatches = () => {
    return fetch(
      "https://api-starfleet.oddsmodel.com/Customers/TV2/MatchFeed?apiKey=a1476rz9nz3wh0x5denb8ij54cxo47yr"
    ).then(response => response.json());
  };

  fetchBets = () => {
    return fetch(
      "https://api-starfleet.oddsmodel.com/Customers/Tv2/OddsFeed/Pregame?apiKey=a1476rz9nz3wh0x5denb8ij54cxo47yr"
    ).then(response => response.json());
  };

  updateDate = date => this.setState({ dateFilter: date });

  render() {
    let { eliteserien, obosligaen } = this.state.data;
    eliteserien = this.filterMatchesByDate(eliteserien, this.state.dateFilter);
    obosligaen = this.filterMatchesByDate(obosligaen, this.state.dateFilter);
    return (
      <Segment>
        <Dimmer active={this.state.loading}>
          <Loader>Henter kamper</Loader>
        </Dimmer>
        <Header as="h1">Oddsmodel-Dashboard</Header>
        <DateFilter updateDate={this.updateDate} />
        <Divider />
        <MatchFeed matches={eliteserien} league="Eliteserien" />
        <MatchFeed matches={obosligaen} league="Obosligaen" />
      </Segment>
    );
  }
}
export default FrontpageView;
