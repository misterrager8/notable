export default function Icon({ name, className = "" }) {
  return <i className={className + " icon bi bi-" + name}></i>;
}
