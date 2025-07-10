import { useEffect, useState } from "react";

export default function InputGroup({ size = "sm", children, className = "" }) {
  return (
    <div
      className={
        "input-group " + (size ? `input-group-${size} ` : "") + className
      }>
      {children}
    </div>
  );
}
