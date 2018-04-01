import React, { Component } from "react";
import { Container } from "semantic-ui-react";
import { HashRouter, Route, Switch } from "react-router-dom";
import FrontpageView from "./Views/FrontpageView";

class App extends Component {
  render() {
    return (
      <Container>
        <HashRouter>
          <Switch>
            <Route exact path="/" component={props => <FrontpageView />} />
          </Switch>
        </HashRouter>
      </Container>
    );
  }
}

export default App;
