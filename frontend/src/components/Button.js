export default function Button({
  type_ = "button",
  onClick,
  active = false,
  border = true,
  size = "sm",
  text,
  icon,
  className = "",
  children,
  style,
}) {
  return (
    <button
      style={style}
      type={type_}
      onClick={onClick}
      className={
        "btn " +
        className +
        (active ? " active" : "") +
        (border ? "" : " border-0") +
        (size ? ` btn-${size}` : "")
      }>
      {icon && <i className={"bi bi-" + icon + (text ? " me-1" : "")}></i>}
      {text && <span>{text}</span>}
      {children}
    </button>
  );
}
