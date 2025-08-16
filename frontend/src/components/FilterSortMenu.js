import { useContext } from "react";
import Dropdown from "./Dropdown";
import { MultiContext } from "../context";
import Button from "./Button";

export default function FilterSortMenu({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const sorts = [
    {
      name: "name",
      label: "Name",
      icon: "type",
    },
    {
      name: "last_modified",
      label: "Last Modified",
      icon: "pencil",
    },
    {
      name: "date_created",
      label: "Date Created",
      icon: "plus-lg",
    },
    {
      name: "favorited",
      label: "Pinned",
      icon: "bookmark-fill",
    },
  ];

  return (
    <div className={className + " between"}>
      <Dropdown
        border={false}
        icon={sorts.find((x) => x.name === multiCtx.sort)?.icon}
        text={sorts.find((x) => x.name === multiCtx.sort)?.label}
        target="sort">
        {sorts.map((x) => (
          <Button
            onClick={() => multiCtx.setSort(x.name)}
            text={x.label}
            icon={x.icon}
            className="dropdown-item"
          />
        ))}
      </Dropdown>
      <Button
        className="text-truncate"
        active={multiCtx.showFolders}
        onClick={() => multiCtx.setShowFolders(!multiCtx.showFolders)}
        border={multiCtx.currentFolder}
        icon={"folder" + (multiCtx.currentFolder ? "-fill" : "")}
        text={`${multiCtx.currentFolder || "All Notes"} (${
          multiCtx.notes.length
        })`}
      />
    </div>
  );
}
