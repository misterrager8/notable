import { useEffect, useState } from "react";

export default function Button({
  text,
  type_ = "button",
  onClick,
  icon,
  size = "sm",
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      type={type_}
      className={className + " btn " + `btn-${size}`}>
      {icon && <i className={(text ? "me-2 " : "") + "bi bi-" + icon}></i>}
      {text}
    </button>
  );
}
