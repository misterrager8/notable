import { useContext } from "react";
import { MultiContext } from "../../context";
import Icon from "../atoms/Icon";
import Badge from "../atoms/Badge";

export default function NoteItem({ item }) {
  const multiCtx = useContext(MultiContext);

  return (
    <div
      className={
        "note-item" +
        (multiCtx.currentNote?.path === item.path ? " active" : "")
      }
      onClick={() =>
        multiCtx.setCurrentNote(
          multiCtx.currentNote?.path === item.path ? null : item
        )
      }>
      <div className="between">
        <div title={item.name} className="text-truncate">
          {item.name}
        </div>
        {item.favorited && <Icon name="bookmark-fill" />}
      </div>
      <div className="between mt-3">
        <div className="small opacity-50 d-flex me-3">
          <Icon
            className="me-1"
            name={multiCtx.sort === "date_created" ? "plus-lg" : "pencil"}
          />
          <span
            title={
              multiCtx.sort === "date_created"
                ? item.date_created
                : item.last_modified
            }
            className="text-truncate">
            {multiCtx.sort === "date_created"
              ? item.date_created
              : item.last_modified}
          </span>
        </div>
        {item.folder && <Badge text={item.folder} icon="folder" />}
      </div>
    </div>
  );
}
