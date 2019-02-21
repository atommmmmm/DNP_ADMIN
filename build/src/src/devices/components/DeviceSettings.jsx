import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";
import { NavLink } from "react-router-dom";
import QRCode from "qrcode.react";
import "./adminBadge.css";
import { guestsName, guestsIpRange } from "../constants";

class DevicesSettings extends React.Component {
  render() {
    const idUrl = this.props.match.params.id;
    const device = this.props.deviceList.find(d => d.id === idUrl) || {};

    const margin = "5px";
    const padding = "0.7rem";
    // <QRCode
    //   value={url}
    //   renderAs="svg"
    //   style={{ width: "100%", height: "100%" }}
    // />
    const { id, url, isAdmin, ip } = device;
    const ipField = id
      ? id === guestsName
        ? guestsIpRange
        : ip
      : "Go back to the device list";

    return (
      <div>
        <div className="section-title">
          <span style={{ opacity: 0.3, fontWeight: 300 }}>Devices </span>
          {id || "Device not found"}
        </div>
        <div className="card mb-3" id={id}>
          <div className="card-body" style={{ padding }}>
            <div className="d-flex justify-content-between">
              <div style={{ margin, width: "200px" }}>
                <h5 className="card-title">{id}</h5>
                <p className="card-text">
                  {ipField && <span className="ipBadge">{ipField}</span>}
                  {isAdmin && <span className="adminBadge">ADMIN</span>}
                </p>
              </div>
              <div className="btn-group" role="group" style={{ margin }}>
                <NavLink to={"/devices/"}>
                  <button type="button" className="btn btn-outline-secondary">
                    Back
                  </button>
                </NavLink>
              </div>
            </div>

            <div className="d-flex justify-content-center">
              <div className="mt-3" style={{ margin }}>
                {url && (
                  <div className="alert alert-warning" role="alert">
                    Beware of shoulder surfing attacks (unsolicited observers),
                    This QR code will grant them access to your DAppNode
                  </div>
                )}
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <div style={{ maxWidth: "400px", margin }}>
                {url && (
                  <QRCode
                    value={url}
                    renderAs="svg"
                    style={{ width: "100%", height: "100%" }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  deviceList: selector.getDevices
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesSettings);
