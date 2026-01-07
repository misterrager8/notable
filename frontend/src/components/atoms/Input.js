export default function Input({
  value,
  onChange,
  type_ = "text",
  required = false,
  placeholder,
  border = true,
  className = "",
}) {
  return (
    <input
      placeholder={placeholder}
      required={required}
      type={type_}
      autoComplete="off"
      value={value}
      onChange={onChange}
      className={className + " form-control" + (border ? "" : " border-0")}
    />
  );
}
