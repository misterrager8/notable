import { useContext } from "react";
import { MultiContext } from "../../context";

export default function SearchResultItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);

  return (
    <div
      className={className + " search-item"}
      onClick={() => multiCtx.getNote(item.path)}>
      <div className="fw-bold mb-2">{item.file}</div>
      <div className="small fst-italic opacity-75">"{item.match}"</div>
    </div>
  );
}
