import React from "react";
import { Switch, Route } from "react-router-dom";

import Main from "../pages/Main";
import Room from "../pages/Room";

function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Main} />
      <Route path="/room/:roomId" component={Room} />
    </Switch>
  );
}

export default Routes;
