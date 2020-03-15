import React from "react";
import { Switch, Route, Redirect, RouteComponentProps } from "react-router-dom";
import WelcomeHome from "./WelcomeHome";
import ChooseBlockchain from "./ChooseBlockchain";
import ChangeHostPassword from "./ChangeHostPassword";
import Finished from "./Finished";
import Introduction from "./Introduction";

// styles
import "./welcome.scss";

const subPathHome = "home";
const subPathIntroduction = "introduction";
const subPathChooseBlockchain = "choose-blockchain";
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
      subPath: subPathChooseBlockchain,
      render: () => <ChooseBlockchain onBack={goBack} onNext={goNext} />
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
      // Prevent re-renders and pushing the same route
      if (location.pathname !== match.url) history.push(match.url);
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
