import uniqArray from "./uniqArray";

/**
 * Parses ports
 * @param {Object} manifest or portsArray = ['32323:30303/udp']
 * @return {Array} ['8080 UDP', '4001 TCP']
 */
function parsePorts(manifest) {
  if (!manifest) return [];
  let portsArray;
  // if the manifest is an Array, assume it's already the portsArray
  if (Array.isArray(manifest)) portsArray = manifest;
  else portsArray = (manifest.image || {}).ports || [];

  //                host : container / type
  // portsArray = ['32323:30303/udp']
  //               container / type
  // portsArray = ['30303/udp']
  const portsFormatted = portsArray
    // Ignore ports that are not mapped
    .filter(e => e.includes(":"))
    // Transform ['30303:30303/udp'] => ['30303 UDP']
    .map(p => {
      const hostPortNumber = p.split(":")[0];
      const portType = p.split("/")[1] || "TCP";
      return {
        number: hostPortNumber,
        type: portType ? portType.toUpperCase() : portType
      };
    });
  return uniqArray(portsFormatted);
}

export default parsePorts;