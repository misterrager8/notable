import { useContext } from "react";
import { MultiContext } from "../../App";
import NotesPanel from "../organisms/NotesPanel";
import Editor from "../organisms/Editor";

export default function Home({ className }) {
  const multiCtx = useContext(MultiContext);

  return (
    <div className={className}>
      <div className="row view">
        <NotesPanel className="col-2 border-end h-100" />
        {multiCtx.currentNote.length !== 0 && (
          <Editor className="col-10 h-100" />
        )}
      </div>
    </div>
  );
}