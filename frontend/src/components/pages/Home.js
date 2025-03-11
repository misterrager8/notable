import { useContext } from "react";
import NotesPanel from "../organisms/NotesPanel";
import Editor from "../organisms/Editor";
import { MultiContext } from "../../MultiContext";

export default function Home({ className }) {
  const multiCtx = useContext(MultiContext);

  return (
    <div className={className}>
      <div className="row view">
        <NotesPanel className="col-2 border-end" />
        {multiCtx.currentNote.length !== 0 && <Editor className="col-10" />}
      </div>
    </div>
  );
}
