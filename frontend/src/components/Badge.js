export default function Badge({
  border = true,
  text,
  icon,
  className = "",
  style,
}) {
  return (
    <span
      style={style}
      className={"badge " + className + (border ? "" : " border-0")}>
      {icon && <i className={"bi bi-" + icon + (text ? " me-2" : "")}></i>}
      {text && <span>{text}</span>}
    </span>
  );
}
