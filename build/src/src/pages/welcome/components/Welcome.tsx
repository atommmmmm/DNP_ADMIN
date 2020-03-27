import React from "react";
import { Switch, Route, Redirect, RouteComponentProps } from "react-router-dom";
import * as api from "API/calls";
import Introduction from "./Introduction";
import WelcomeHome from "./WelcomeHome";
import Repository from "./Repository";
import AutoUpdates from "./AutoUpdates";
import ChangeHostPassword from "./ChangeHostPassword";
import Finished from "./Finished";
// styles
import "./welcome.scss";

const subPathHome = "home";
const subPathIntroduction = "introduction";
const subPathRepository = "repository";
const subPathAutoUpdates = "auto-updates";
const subPathChangeHostPassword = "change-host-password";
const subPathFinished = "finished";

interface WelcomeProps {}

/**
 * Handles routing and each subroute should have "Next" & "Back"
 */

const Welcome: React.FunctionComponent<WelcomeProps & RouteComponentProps> = ({
  match,
  // From RouteComponent props
  history,
  location
}) => {
  const routes: { subPath: string; render: any }[] = [
    {
      subPath: subPathHome,
      render: () => <WelcomeHome onNext={goNext} />
    },
    {
      subPath: subPathRepository,
      render: () => <Repository onBack={goBack} onNext={goNext} />
    },
    {
      subPath: subPathAutoUpdates,
      render: () => <AutoUpdates onBack={goBack} onNext={goNext} />
    },
    {
      subPath: subPathChangeHostPassword,
      render: () => <ChangeHostPassword onBack={goBack} onNext={goNext} />
    },
    {
      subPath: subPathFinished,
      render: () => <Finished onBack={goBack} onNext={goNext} />
    }
  ];

  // Compute the route index for the stepper display
  const currentSubRoute =
    (location.pathname || "").split(match.url + "/")[1] || "";
  const currentIndex = routes.findIndex(
    ({ subPath }) => subPath && currentSubRoute.includes(subPath)
  );

  function goNext() {
    const nextIndex = currentIndex + 1;
    if (nextIndex > routes.length - 1) {
      // Has finished the welcome flow, flag it
      api
        .uiWelcomeStatusSet({ uiWelcomeStatus: "done" })
        .then(() => console.log("Success on uiWelcomeStatusSet"))
        .catch((e: Error) => console.error("Error on uiWelcomeStatusSet", e));

      // Prevent re-renders and pushing the same route
      const finalRoute = "/";
      if (location.pathname !== finalRoute) history.push(finalRoute);
    } else {
      const nextStep = routes[nextIndex];
      if (nextStep) history.push(`${match.url}/${nextStep.subPath}`);
    }
  }

  function goBack() {
    const prevStep = routes[currentIndex - 1];
    if (prevStep) history.push(`${match.url}/${prevStep.subPath}`);
    else history.push(match.url);
  }

  return (
    <div className="welcome">
      <Switch>
        {routes.map(route => (
          <Route
            key={route.subPath}
            path={`${match.path}/${route.subPath}`}
            exact={route.subPath === ""}
            render={route.render}
          />
        ))}

        <Redirect to={`${match.url}/${routes[0].subPath}`} />
      </Switch>
    </div>
  );
};

export default Welcome;
