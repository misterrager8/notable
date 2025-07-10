import { useEffect, useState } from "react";

export default function Input({
  type_ = "text",
  onChange,
  size = "sm",
  className = "",
  value,
  placeholder,
  style = null,
}) {
  return (
    <input
      style={style}
      placeholder={placeholder}
      autoComplete="off"
      value={value}
      onChange={onChange}
      type={type_}
      className={className + " form-control " + `form-control-${size}`}
    />
  );
}
