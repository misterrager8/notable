export default function Dropdown({
  size = "sm",
  text,
  icon,
  children,
  target,
  showCaret = true,
  classNameBtn,
  classNameMenu,
  border = true,
}) {
  return (
    /* eslint-disable jsx-a11y/anchor-is-valid */
    <>
      <a
        className={
          classNameBtn +
          " btn" +
          (size ? ` btn-${size}` : "") +
          (showCaret ? " dropdown-toggle" : "") +
          (border ? "" : " border-0")
        }
        data-bs-toggle="dropdown"
        data-bs-target={"#" + target}>
        <i className={"bi bi-" + icon + (text ? " me-1" : "")}></i>
        {text && <span>{text}</span>}
      </a>
      <div className={classNameMenu + " dropdown-menu"}>{children}</div>
    </>
  );
}
