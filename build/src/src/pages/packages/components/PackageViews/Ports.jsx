import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { api } from "api";
import { createStructuredSelector } from "reselect";
import { withToast } from "components/toast/Toast";
// Components
import Card from "components/Card";
import TableInputs from "components/TableInputs";
import Button from "components/Button";
// Utils
import { shortNameCapitalized } from "utils/format";
import { MdAdd } from "react-icons/md";
// Selectors
import { getIsLoadingStrict } from "services/loadingStatus/selectors";
import { getHostPortMappings } from "services/dnpInstalled/selectors";
// Style
import "./ports.scss";

const maxPortNumber = 32768 - 1;

function getPortsFromDnp(dnp) {
  return (dnp.ports || [])
    .filter(({ host }) => host)
    .sort((a, b) => a.container - b.container)
    .sort((a, b) =>
      a.deletable && !b.deletable ? 1 : !a.deletable && b.deletable ? -1 : 0
    );
}

function Ports({ dnp, loading, hostPortMapping }) {
  const [ports, setPorts] = useState(getPortsFromDnp(dnp));
  const [updating, setUpdating] = useState(false);
  useEffect(() => {
    setPorts(getPortsFromDnp(dnp));
  }, [dnp]);

  async function onUpdateEnvsSubmit() {
    const id = dnp.name;
    try {
      setUpdating(true);
      await withToast(
        () => api.updatePortMappings({ id, portMappings: ports }),
        {
          message: `Updating ${shortNameCapitalized(id)} port mappings...`,
          onSuccess: `Updated ${shortNameCapitalized(id)} port mappings`
        }
      );
    } catch (e) {
      console.error(`Error requesting Backup: ${e.message}`);
    } finally {
      setUpdating(false);
    }
  }

  function addNewPort({ container = "", protocol = "TCP" } = {}) {
    setPorts(ps => [...ps, { host: "", container, protocol, deletable: true }]);
  }

  function editPort(i, data) {
    setPorts(ps =>
      ps.map((p, _i) => {
        if (i === _i) return { ...p, ...data };
        else return p;
      })
    );
  }

  function removePort(i) {
    setPorts(ps =>
      ps.filter(({ deletable }, _i) => {
        return _i !== i || !deletable;
      })
    );
  }

  function getDuplicatedContainerPort() {
    const portsObj = {};
    for (const { container, protocol } of ports) {
      if (container) {
        const key = `${container}-${protocol}`;
        if (portsObj[key]) return { container, protocol };
        else portsObj[key] = true;
      }
    }
    return null;
  }

  function getDuplicatedHostPort() {
    const portsObj = {};
    for (const { host, protocol } of ports) {
      if (host) {
        const key = `${host}-${protocol}`;
        if (portsObj[key]) return { host, protocol };
        else portsObj[key] = true;
      }
    }
    return null;
  }

  function getConflictingPort() {
    for (const { host, protocol } of ports) {
      const owner = hostPortMapping[`${host}/${protocol}`];
      if (owner && owner !== dnp.name) return { host, protocol, owner };
    }
  }

  function getPortOverTheMax() {
    return ports.find(
      ({ container, deletable }) => deletable && container > maxPortNumber
    );
  }

  function getArePortsTheSame() {
    function portsToId(_ports) {
      return _ports
        .map(({ host, container, protocol }) =>
          [host, container, protocol].join("")
        )
        .join("");
    }
    return portsToId(getPortsFromDnp(dnp)) === portsToId(ports);
  }

  const areNewMappingsInvalid = ports.some(
    ({ container, protocol, deletable }) =>
      deletable && (!container || !protocol)
  );
  const duplicatedContainerPort = getDuplicatedContainerPort();
  const duplicatedHostPort = getDuplicatedHostPort();
  const conflictingPort = getConflictingPort();
  const portOverTheMax = getPortOverTheMax();

  const thereAreNewPorts = ports.some(({ deletable }) => deletable);
  const arePortsTheSame = getArePortsTheSame();

  // Aggregate error messages as an array of strings
  const errors = [];
  if (duplicatedHostPort)
    errors.push(
      `Duplicated mapping for host port ${duplicatedHostPort.host}/${duplicatedHostPort.protocol}. Each host port can only be mapped once.`
    );

  if (duplicatedContainerPort)
    errors.push(
      `Duplicated mapping for package port ${duplicatedContainerPort.container}/${duplicatedContainerPort.protocol}. Each package port can only be mapped once.`
    );

  if (conflictingPort)
    errors.push(
      `Port ${conflictingPort.host}/${
        conflictingPort.protocol
      } is already mapped by the DAppNode Package ${shortNameCapitalized(
        conflictingPort.owner
      )}`
    );

  if (portOverTheMax)
    errors.push(
      `Port mapping ${portOverTheMax.container}/${portOverTheMax.protocol} is in the ephemeral port range (32768-65535). It must be avoided.`
    );

  // Aggregate conditions to disable the update
  const disableUpdate =
    areNewMappingsInvalid ||
    duplicatedContainerPort ||
    duplicatedHostPort ||
    conflictingPort ||
    portOverTheMax ||
    arePortsTheSame ||
    updating ||
    loading;

  return (
    <Card spacing className="ports-editor">
      <TableInputs
        headers={[
          "Host port",
          "Package port number",
          "Protocol",
          ...(thereAreNewPorts ? [""] : [])
        ]}
        numOfRows={3}
        rowsTemplate={
          thereAreNewPorts
            ? "auto auto minmax(min-content, max-content) min-content"
            : "auto auto minmax(min-content, max-content)"
        }
        content={[
          ...ports.map(({ host, container, protocol, deletable }, i) => [
            {
              placeholder: "Ephemeral port if unspecified",
              value: host || "",
              onValueChange: value => editPort(i, { host: value })
            },

            deletable
              ? {
                  placeholder: "enter container port...",
                  value: container,
                  onValueChange: value => editPort(i, { container: value })
                }
              : { lock: true, value: container },

            deletable
              ? {
                  select: true,
                  options: ["TCP", "UDP"],
                  value: protocol,
                  onValueChange: value => editPort(i, { protocol: value })
                }
              : { lock: true, value: protocol },

            ...(thereAreNewPorts
              ? [
                  deletable
                    ? { deleteButton: true, onClick: () => removePort(i) }
                    : { empty: true }
                ]
              : [])
          ])
        ]}
      />

      {errors.map(error => (
        <div className="error" key={error}>
          {error}
        </div>
      ))}

      <div className="button-row">
        <Button
          variant={"dappnode"}
          onClick={onUpdateEnvsSubmit}
          disabled={disableUpdate}
        >
          Update port mappings
        </Button>

        <Button className="add-button" onClick={addNewPort}>
          <MdAdd />
        </Button>
      </div>
    </Card>
  );
}

// Container

const mapStateToProps = createStructuredSelector({
  loading: getIsLoadingStrict.dnpInstalled,
  hostPortMapping: getHostPortMappings
});

const mapDispatchToProps = null;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Ports);
