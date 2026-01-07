import Input from "../atoms/Input";

export default function Search({ className = "" }) {
  return (
    <div className={className}>
      <Input placeholder="Search" />
    </div>
  );
}
