import { useState } from "react";
import Input from "../Input";

export function Search({ className = "" }) {
  const [query, setQuery] = useState("");

  const onChangeQuery = (e) => setQuery(e.state.value);

  return (
    <form className={className}>
      <Input onChange={onChangeQuery} value={query} placeholder="Search" />
    </form>
  );
}
