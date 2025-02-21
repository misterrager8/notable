import { useEffect, useState } from "react";

export default function InputGroup({ size = "sn", children, className = "" }) {
  return (
    <div className={"input-group input-group-" + size + className}>
      {children}
    </div>
  );
}
