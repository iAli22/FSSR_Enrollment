import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import routes from "./routes";
import { ROUTE } from "./constants/Routes";
import { ScrollToTop } from "./components";

import PrivateRoute from "./routes/PrivateRoute";
import { Login } from "./views";

function App() {
  return (
    <Router>
      <ScrollToTop />

      <Switch>
        {routes.map((route, index) => (
          <PrivateRoute
            key={index}
            path={route.path}
            exact={route.exact}
            component={route.component}
            isAdmin={route.isAdmin}
          />
        ))}

        {/* Public Routes */}
        <Route path={ROUTE.LOGIN} exact component={Login} />
      </Switch>
    </Router>
  );
}

export default App;
