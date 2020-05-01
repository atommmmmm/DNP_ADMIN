import React, { useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { fetchDappnodeStats } from "services/dappnodeStatus/actions";
// Selectors
import { getDappnodeVolumes } from "services/dnpInstalled/selectors";
import { getChainData } from "services/chainData/selectors";
import { getDappnodeStats } from "services/dappnodeStatus/selectors";
// Own module
import { title } from "../data";
import ChainCard from "./ChainCard";
import StatsCard from "./StatsCard";
import VolumeCard from "./VolumeCard";
import "./dashboard.scss";
// Components
import SubTitle from "components/SubTitle";
import Title from "components/Title";
import { ChainData, HostStats } from "types";

/**
 * @param {array} chainData = [{
 *   name: "Geth",
 *   message: "Syncing 4785835/3748523",
 *   progress: 0.647234,
 *   syncing: true
 * }, ... ]
 * @param {object} dappnodeStats = {
 *   cpu: 35%,
 *   disk: 86%,
 *   memory: 56%
 * }
 * @param {array} dappnodeVolumes = [{
 *   name: "IPFS size",
 *   size: "53.45 GB"
 * }, ... ]
 */

function Dashboard({
  chainData,
  dappnodeStats,
  dappnodeVolumes,
  fetchDappnodeStats
}: {
  chainData: ChainData[];
  dappnodeStats: HostStats;
  dappnodeVolumes: { name: string; size: number }[];
  // Action
  fetchDappnodeStats: () => void;
}) {
  useEffect(() => {
    const interval = setInterval(fetchDappnodeStats, 5 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, [fetchDappnodeStats]);

  return (
    <>
      <Title title={title} />

      <SubTitle>Chains</SubTitle>
      <div className="dashboard-cards">
        {chainData.map(chain => (
          <ChainCard key={chain.dnpName} {...chain} />
        ))}
      </div>

      <SubTitle>Machine stats</SubTitle>
      <div className="dashboard-cards">
        {Object.entries(dappnodeStats).map(([id, percent]) => (
          <StatsCard key={id} id={id} percent={percent} />
        ))}
      </div>

      <SubTitle>Volumes</SubTitle>
      <div className="dashboard-cards">
        {dappnodeVolumes.map(vol => (
          <VolumeCard key={vol.name} {...vol} />
        ))}
      </div>
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  chainData: getChainData,
  dappnodeStats: getDappnodeStats,
  dappnodeVolumes: getDappnodeVolumes
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = {
  fetchDappnodeStats
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
