import { useContext } from "react";
import { MultiContext } from "../../App";
import Icon from "../atoms/Icon";
import Badge from "../atoms/Badge";

export default function NoteItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);

  return (
    <div
      className={
        className +
        " py-2 rounded px-3 item" +
        (multiCtx.currentNote.name === item.name ? " selected" : "")
      }
      onClick={() => multiCtx.setCurrentNote({ ...item })}>
      <div className="between">
        <div
          className={
            "pe-4 text-truncate fw-bold" +
            (item.favorited && multiCtx.currentNote.name !== item.name
              ? " highlight"
              : "")
          }>
          {item.name}
        </div>
        {item.favorited && (
          <Icon className="py-1 small orange" name="pin-angle-fill" />
        )}
      </div>
      <div className="between small mt-1">
        {multiCtx.settings.sort === "date_created" ? (
          <div className="opacity-75 text-truncate">
            <Icon name="plus-lg" className="me-1" />
            {item.date_created}
          </div>
        ) : (
          <div className="opacity-75 text-truncate">
            <Icon name="pencil" className="me-1" />
            {item.last_modified}
          </div>
        )}
        {item.folder && <Badge text={item.folder} />}
      </div>
    </div>
  );
}
