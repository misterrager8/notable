export default function Input({
  onChange,
  required = false,
  placeholder,
  value,
  type_ = "text",
  border,
  size,
  className = "",
}) {
  return (
    <input
      required={required}
      value={value}
      placeholder={placeholder}
      type={type_}
      onChange={onChange}
      className={
        className +
        " form-control" +
        (border ? "" : " border-0") +
        (size ? ` form-control-${size}` : "")
      }
    />
  );
}
