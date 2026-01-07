export default function Dropdown({
  text,
  icon,
  classNameMenu = "",
  classNameBtn = "",
  target,
  showCaret = true,
  border = false,
  children,
}) {
  return (
    <>
      <a
        style={{ maxWidth: "135px" }}
        data-bs-target={"#" + target}
        data-bs-toggle="dropdown"
        className={
          classNameBtn +
          " btn text-truncate" +
          (border ? "" : " border-0") +
          (showCaret ? " dropdown-toggle" : "")
        }>
        {icon && <i className={"bi bi-" + icon + (text ? " me-2" : "")}></i>}
        {text && <span>{text}</span>}
      </a>
      <div className={classNameMenu + " dropdown-menu"}>{children}</div>
    </>
  );
}
