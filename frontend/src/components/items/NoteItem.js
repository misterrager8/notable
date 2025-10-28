import { useContext } from "react";
import { MultiContext } from "../../context";

export default function NoteItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);

  return (
    <div
      className={
        className +
        " note-item" +
        (multiCtx.currentNote?.path === item.path ? " active" : "")
      }
      onClick={() => multiCtx.setCurrentNote(item)}>
      <div className="w-100">
        <div className="between">
          <div className="text-truncate">{item.name}</div>
          {item.favorited && <i className="bi bi-pin-angle-fill red"></i>}
        </div>

        <div className="between mt-2">
          <div className="small opacity-50 my-auto">
            <i
              className={
                "me-2 bi bi-" +
                (multiCtx.sort === "date_created" ? "plus-lg" : "pencil")
              }></i>
            {multiCtx.sort === "date_created"
              ? item.date_created
              : item.last_modified}
          </div>
          {item.folder && (
            <div className="badge-custom text-truncate">
              <i className="me-2 bi bi-folder-fill"></i>
              {item.folder}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
