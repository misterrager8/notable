import { Fragment, useContext, useEffect, useState } from "react";
import { MultiContext } from "../../App";
import Dropdown from "../molecules/Dropdown";
import Icon from "../atoms/Icon";
import ButtonGroup from "../molecules/ButtonGroup";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Badge from "../atoms/Badge";
import FolderItem from "./FolderItem";
import NoteItem from "./NoteItem";
import { api, sorts } from "../../util";

export default function NotesPanel({ className }) {
  const multiCtx = useContext(MultiContext);
  const [showFolders, setShowFolders] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(
    () => multiCtx.getNotes(),
    [multiCtx.settings, multiCtx.currentFolder]
  );
  useEffect(() => multiCtx.getFolders(), []);
  useEffect(() => setShowFolders(false), [multiCtx.currentFolder]);

  const onChangeSearch = (e) => setSearch(e.target.value);

  const searchNotes = (e) => {
    e.preventDefault();
    api("search", { query: search }, (data) => {
      setSearchResults(data.results);
    });
  };

  return (
    <div className={className} id="notes-panel">
      <div className="between">
        <Dropdown
          classNameBtn="btn border-0 text-capitalize"
          className="btn-group-sm"
          target="sorts"
          icon={sorts.filter((x) => x.name === multiCtx.settings.sort)[0]?.icon}
          text={
            sorts.filter((x) => x.name === multiCtx.settings.sort)[0]?.label
          }>
          {sorts.map((x) => (
            <button
              key={x.name}
              className="dropdown-item between"
              onClick={() =>
                multiCtx.setSettings({ ...multiCtx.settings, sort: x.name })
              }>
              <span className="">{x?.label}</span>
              <Icon name={x?.icon} className="m-1" />
            </button>
          ))}
        </Dropdown>
        <ButtonGroup size="sm">
          <Button
            onClick={() => setShowFolders(!showFolders)}
            className={
              "dropdown-toggle border-0" + (showFolders ? " selected" : "")
            }
            icon="folder"
            text={
              multiCtx.currentFolder
                ? multiCtx.currentFolder.substring(0, 10)
                : "All Folders"
            }
          />
          {multiCtx.currentFolder !== null && (
            <Button
              onClick={() => multiCtx.setCurrentFolder(null)}
              className="border-0"
              icon="x-lg"
            />
          )}
        </ButtonGroup>
      </div>
      <form onSubmit={searchNotes} className="input-group input-group-sm my-3">
        <Input placeholder="Search" onChange={onChangeSearch} value={search} />
        {searchResults.length !== 0 && (
          <Button
            type_="button"
            onClick={() => {
              setSearchResults([]);
              setSearch("");
            }}
            className="border-0"
            icon="x-circle"
          />
        )}
      </form>
      {searchResults.length !== 0 && (
        <div className="px-2">
          {searchResults.map((x) => (
            <div className="mb-3">
              <a
                onClick={() => multiCtx.getNote(x.path)}
                className="d-block fw-bold mb-1">
                {x.file}
              </a>
              <div className="fst-italic small opacity-50">"{x.match}"</div>
            </div>
          ))}
          <hr />
        </div>
      )}
      <div>
        {showFolders && (
          <div className="px-3">
            <hr />
            <Button
              onClick={() => multiCtx.addFolder()}
              text="New Folder"
              icon="plus-lg"
              className="w-100 mb-3"
              size="sm"
            />
            {multiCtx.folders.map((x) => (
              <Fragment key={x}>
                {x !== multiCtx.currentFolder && <FolderItem item={x} />}
              </Fragment>
            ))}
            <hr />
          </div>
        )}
      </div>
      <div className="overflow-auto" style={{ height: "70vh" }}>
        {multiCtx.notes.map((x) => (
          <NoteItem className="" key={x.name} item={x} />
        ))}
      </div>
      <Badge
        icon="record-fill"
        className="mt-3 border-0 w-100"
        text={
          multiCtx.notes.length +
          " Note" +
          (multiCtx.notes.length === 1 ? "" : "s")
        }
      />
    </div>
  );
}
