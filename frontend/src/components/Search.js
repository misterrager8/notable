import { useContext, useState } from "react";
import Input from "./atoms/Input";
import Button from "./atoms/Button";
import { MultiContext } from "../context";

export default function Search({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [query, setQuery] = useState("");
  const onChangeQuery = (e) => setQuery(e.target.value);

  return (
    <form
      className={className + " d-flex"}
      onSubmit={(e) => multiCtx.searchNotes(e, query)}>
      <Input value={query} onChange={onChangeQuery} />
      <Button icon="search" type_="submit" />
      {multiCtx.searchResults.length > 0 && (
        <Button
          icon="arrow-left"
          onClick={() => multiCtx.setSearchResults([])}
        />
      )}
    </form>
  );
}
