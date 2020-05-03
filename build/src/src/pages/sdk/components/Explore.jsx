import React from "react";
import * as selector from "../selectors";
import { connect } from "react-redux";
import { fetchRegistry } from "../actions";
import { createStructuredSelector } from "reselect";
import { title } from "../data";
// Components
import Title from "components/Title";

const padding = "0.7rem";

class Explore extends React.Component {
  componentDidMount() {
    this.props.fetchRegistry("dnp.dappnode.eth");
    this.props.fetchRegistry("public.dappnode.eth");
  }
  render() {
    const id = "Explore";

    const registries = this.props.registries || {};
    return (
      <>
        <Title title={title} subtitle={id} />

        {/* {registry.address ? <div>Address: {registry.address}</div> : null} */}

        {/* registry = {name, address, repos, fetching} */}
        {Object.values(registries).map(registry => {
          const repos = registry.repos || {};
          return (
            <React.Fragment key={registry.name}>
              <div className="section-subtitle">
                {registry.name}
                {registry.fetching ? "Loading..." : null}
              </div>

              <div className="card mb-3">
                <div className="card-body" style={{ padding }}>
                  {/* repo = {id, name, address, blockNumber} */}
                  {Object.values(repos).map(repo => {
                    const versions = Object.values(repo.versions || {});
                    const latestVersion = versions[0];
                    return (
                      <details key={repo.id}>
                        <summary>
                          <span>{repo.name}</span>
                          {repo.fetching ? (
                            "Loading..."
                          ) : latestVersion ? (
                            <span style={{ opacity: 0.4 }}>
                              {"  "}
                              {versions.length} versions, latest:{" "}
                              {latestVersion.version} ({latestVersion.date})
                            </span>
                          ) : null}
                        </summary>
                        <div>Deployed at: {repo.date}</div>
                        <div>
                          Address:{" "}
                          <span style={{ opacity: 0.4 }}>{repo.address}</span>
                        </div>
                        <summary>Versions ({versions.length})</summary>
                        <ul>
                          {versions.map(
                            ({ version, date, sender, contentUri }) => (
                              <li key={version}>
                                <strong>{version}:</strong> published at: {date}
                                , by {sender}:{" "}
                                <span style={{ opacity: 0.4 }}>
                                  {contentUri}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </details>
                    );
                  })}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </>
    );
  }
}

// Container

const mapStateToProps = createStructuredSelector({
  registries: selector.registries
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = { fetchRegistry };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Explore);
