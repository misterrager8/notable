import { useEffect, useState } from "react";

export default function Button({
  text,
  type_ = "button",
  onClick,
  icon,
  size = "sm",
  className = "",
  active = false,
  style,
}) {
  return (
    <button
      style={style}
      onClick={onClick}
      type={type_}
      className={
        className + " btn" + ` btn-${size}` + (active ? " active" : "")
      }>
      {icon && <i className={(text ? "me-2 " : "") + "bi bi-" + icon}></i>}
      {text}
    </button>
  );
}
