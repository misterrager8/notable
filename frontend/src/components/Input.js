export default function Input({
  value,
  onChange,
  type_ = "text",
  placeholder,
  className = "",
  style,
  border = true,
  size = "sm",
  required = true,
}) {
  return (
    <input
      required={required}
      type={type_}
      onChange={onChange}
      placeholder={placeholder}
      style={style}
      value={value}
      autoComplete="off"
      className={
        className +
        " form-control" +
        (border ? "" : " border-0") +
        (size ? ` form-control-${size}` : "")
      }
    />
  );
}
