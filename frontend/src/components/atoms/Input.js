import { useEffect, useState } from "react";

export default function Input({
  type_ = "text",
  onChange,
  size = "sm",
  className = "",
  value,
  placeholder = "...",
}) {
  return (
    <input
      placeholder={placeholder}
      autoComplete="off"
      value={value}
      onChange={onChange}
      type={type_}
      className={className + " form-control " + `form-control-${size}`}
    />
  );
}
