export default function Button({
  onClick,
  text,
  icon,
  active,
  border = true,
  size = "sm",
  type_ = "button",
  className = "",
}) {
  return (
    <button
      type={type_}
      onClick={onClick}
      className={
        className +
        " btn" +
        (active ? " active" : "") +
        (border ? "" : " border-0") +
        (size ? ` btn-${size}` : "")
      }>
      {icon && <i className={"bi bi-" + icon + (text ? " me-2" : "")}></i>}
      {text && <span>{text}</span>}
    </button>
  );
}
