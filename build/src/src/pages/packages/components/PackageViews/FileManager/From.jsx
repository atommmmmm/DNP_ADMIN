import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "API/rpcMethods";
// Components
import Input from "components/Input";
import { ButtonLight } from "components/Button";
// Utils
import { shortName } from "utils/format";
import dataUriToBlob from "utils/dataUriToBlob";
import { saveAs } from "file-saver";

function From({ id, path, filename }) {
  const [fromPath, setFromPath] = useState("");

  useEffect(() => {
    setFromPath(path);
  }, [path]);

  useEffect(() => {
    setFromPath([(path || "").replace(/\/+$/, ""), filename].join("/"));
  }, [filename]);

  async function downloadFile() {
    try {
      /**
       * [copyFileFrom]
       * Copy file from a DNP and download it on the client
       *
       * @param {string} id DNP .eth name
       * @param {string} fromPath path to copy file from
       * - If path = path to a file: "/usr/src/app/config.json".
       *   Downloads and sends that file
       * - If path = path to a directory: "/usr/src/app".
       *   Downloads all directory contents, tar them and send as a .tar.gz
       * - If path = relative path: "config.json".
       *   Path becomes $WORKDIR/config.json, then downloads and sends that file
       *   Same for relative paths to directories.
       * @returns {string} dataUri = "data:application/zip;base64,UEsDBBQAAAg..."
       */
      const dataUri = await api.copyFileFrom(
        { id, fromPath },
        { toastMessage: `Copying file from ${shortName(id)} ${fromPath}...` }
      );
      if (!dataUri) return;

      const blob = dataUriToBlob(dataUri);
      const fileName = parseFileName(fromPath, blob.type);

      saveAs(blob, fileName);
    } catch (e) {
      console.error(`Error on copyFileFrom ${id} ${fromPath}: ${e.stack}`);
    }
  }

  return (
    <div className="card-subgroup">
      <div className="section-card-subtitle">Download from DAppNode Package</div>
      {/* FROM, chose path */}
      <Input
        placeholder="Container from path"
        value={fromPath}
        onValueChange={setFromPath}
        append={
          <ButtonLight onClick={downloadFile} disabled={!fromPath}>
            Download
          </ButtonLight>
        }
      />
    </div>
  );
}

function parseFileName(path, mimeType) {
  if (!path || typeof path !== "string") return path;
  const subPaths = path.split("/");
  let fileName = subPaths[subPaths.length - 1] || "";

  // Add extension in case it is a compressed directory
  if (
    mimeType === "application/gzip" &&
    !fileName.endsWith(".gzip") &&
    !fileName.endsWith(".gz")
  )
    fileName = `${fileName}.tar.gz`;

  return fileName;
}

From.propTypes = {
  id: PropTypes.string.isRequired
};

export default From;
