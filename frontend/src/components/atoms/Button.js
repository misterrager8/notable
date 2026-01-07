export default function Button({
  text,
  onClick,
  border = false,
  active = false,
  truncate = true,
  className = "",
  type_ = "button",
  icon,
}) {
  return (
    <button
      onClick={onClick}
      type={type_}
      className={
        className +
        " btn" +
        (truncate ? " text-truncate" : "") +
        (active ? " active" : "") +
        (border ? "" : " border-0")
      }>
      {icon && <i className={"bi bi-" + icon + (text ? " me-1" : "")}></i>}
      {text && <span className="">{text}</span>}
    </button>
  );
}
