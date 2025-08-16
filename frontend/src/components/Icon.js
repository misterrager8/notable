export default function Icon({ name, className = "", style }) {
  return <i style={style} className={className + " bi bi-" + name}></i>;
}
