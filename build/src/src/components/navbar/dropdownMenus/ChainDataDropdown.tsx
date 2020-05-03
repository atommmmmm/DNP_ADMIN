import React from "react";
import { useSelector } from "react-redux";
import BaseDropdown from "./BaseDropdown";
import { getChainData } from "services/chainData/selectors";
import { shortNameCapitalized } from "utils/format";
// Icons
import { FiBox } from "react-icons/fi";

export default function ChainDataDropdown() {
  const chainData = useSelector(getChainData);

  if (!chainData || !Array.isArray(chainData)) {
    console.error("chainData must be an array");
    return null;
  }

  return (
    <BaseDropdown
      name="Chain status"
      messages={chainData.map(
        ({ dnpName, name, message, help, error, syncing, progress }) => ({
          title: name || shortNameCapitalized(dnpName),
          body: message,
          help: help,
          type: error ? "danger" : syncing ? "warning" : "success",
          progress: progress,
          showProgress: syncing
        })
      )}
      Icon={() => <FiBox size={"1.4em"} />}
      className="chainstatus"
      placeholder="No chains installed"
    />
  );
}
