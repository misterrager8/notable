import { useContext } from "react";
import Badge from "../Badge";
import Icon from "../Icon";
import { MultiContext } from "../../context";

export default function NoteItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);

  return (
    <div
      onClick={() => multiCtx.setCurrentNote(item)}
      className={
        className +
        " note-item" +
        (multiCtx.currentNote?.name === item.name ? " active" : "")
      }>
      <div className="between mb-3">
        <div className="fw-bold text-truncate">{item.name}</div>
        {item.favorited && <Icon className="red" name="bookmark-fill" />}
      </div>
      <div className="between">
        <div className="small text-truncate opacity-50">
          <Icon name={multiCtx.sort === "date_created" ? "plus" : "pencil"} />
          <span className="ms-1">
            {multiCtx.sort === "date_created"
              ? item.date_created
              : item.last_modified}
          </span>
        </div>
        {item.folder && <Badge icon="folder" text={item.folder} />}
      </div>
    </div>
  );
}
