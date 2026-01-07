export default function Badge({ text, icon, border = true, className = "" }) {
  return (
    <span className={className + " badge" + (border ? "" : " border-0")}>
      {icon && <i className={"me-1 bi bi-" + icon}></i>}
      <span>{text}</span>
    </span>
  );
}
