import { Fragment, useContext, useEffect, useState } from "react";
import Dropdown from "../molecules/Dropdown";
import Icon from "../atoms/Icon";
import ButtonGroup from "../molecules/ButtonGroup";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Badge from "../atoms/Badge";
import FolderItem from "./FolderItem";
import NoteItem from "./NoteItem";
import { api, sorts } from "../../util";
import { MultiContext } from "../../MultiContext";

export default function NotesPanel({ className }) {
  const multiCtx = useContext(MultiContext);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => multiCtx.getNotes(), [multiCtx.sort, multiCtx.currentFolder]);
  useEffect(() => multiCtx.getFolders(), []);

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
          icon={sorts.filter((x) => x.name === multiCtx.sort)[0]?.icon}
          text={sorts.filter((x) => x.name === multiCtx.sort)[0]?.label}>
          {sorts.map((x) => (
            <button
              key={x.name}
              className={
                "dropdown-item between" +
                (x.name === multiCtx.sort ? " active" : "")
              }
              onClick={() => multiCtx.setSort(x.name)}>
              <span className="">{x?.label}</span>
              <Icon name={x?.icon} className="m-1" />
            </button>
          ))}
        </Dropdown>
        <ButtonGroup>
          <Dropdown
            style={{ width: "250px" }}
            autoClose={false}
            className="btn btn-sm border-0"
            icon="folder"
            target="folders"
            text={
              multiCtx.currentFolder
                ? multiCtx.currentFolder.substring(0, 10)
                : "All Folders"
            }>
            <div className="px-2 mb-2">
              <Button
                onClick={() => multiCtx.addFolder()}
                text="New Folder"
                icon="plus-lg"
                className="green w-100"
                size="sm"
              />
            </div>

            {multiCtx.folders.map((x) => (
              <FolderItem
                className={multiCtx.currentFolder === x ? "active" : ""}
                key={x}
                item={x}
              />
            ))}
          </Dropdown>
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
      <div className="overflow-auto" style={{ height: "68vh" }}>
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
