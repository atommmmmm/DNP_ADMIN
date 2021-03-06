import React from "react";
import { MdCheckCircle, MdError } from "react-icons/md";

export default function StatusIcon({ success, message }) {
  const styleSvg = { fontSize: "1.8rem", marginRight: "0.5rem" };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center"
      }}
    >
      {success ? (
        <MdCheckCircle style={{ ...styleSvg, color: "var(--success-color" }} />
      ) : (
        <MdError style={{ ...styleSvg, color: "var(--danger-color" }} />
      )}

      <span>{message}</span>
    </div>
  );
}
