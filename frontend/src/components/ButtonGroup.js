export default function ButtonGroup({ className = "", size = "sm", children }) {
  return (
    <div
      className={className + " btn-group" + (size ? ` btn-group-${size}` : "")}>
      {children}
    </div>
  );
}
