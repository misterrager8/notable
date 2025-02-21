import { useEffect, useState } from "react";

export default function ButtonGroup({ children, size, className = "" }) {
  return (
    <div className={className + " btn-group btn-group-" + size}>{children}</div>
  );
}
