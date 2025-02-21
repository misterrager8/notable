import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

import { createContext, useEffect, useState } from "react";
import Home from "./components/pages/Home";
import Nav from "./components/organisms/Nav";
import { api, defaultSettings } from "./util";
import Button from "./components/atoms/Button";

export const MultiContext = createContext();

export default function App() {
  const [currentPage, setCurrentPage] = useState("");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem("notable")) || defaultSettings
  );

  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState([]);

  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);

  const [content, setContent] = useState("");

  const addNote = () => {
    api("add_note", { folder: currentFolder }, (data) => {
      setCurrentNote(data);
      getNotes();
    });
  };

  const getNote = (path) => {
    api("note", { path: path }, (data) => {
      setCurrentNote(data);
    });
  };

  const getNotes = () => {
    api("notes", { sort: settings.sort, filter_: currentFolder }, (data) => {
      setNotes(data.notes);
    });
  };

  const editNote = (path, content) => {
    api("edit_note", { path: path, content: content }, (data) => {
      setCurrentNote(data);
      getNotes();
    });
  };

  const deleteNote = (path) => {
    api("delete_note", { path: path }, (data) => {
      getNotes();
    });
  };

  const duplicateNote = (path) => {
    api("duplicate_note", { path: path }, (data) => {
      setCurrentNote(data);
      getNotes();
    });
  };

  const renameNote = (e, path, newName) => {
    e.preventDefault();
    api("rename_note", { path: path, new_name: newName }, (data) => {
      setCurrentNote(data);
      getNotes();
    });
  };

  const pinNote = (path) => {
    api("toggle_favorite", { path: path }, (data) => {
      setCurrentNote({ ...currentNote, favorited: !currentNote.favorited });
      getNotes();
    });
  };

  const addFolder = () => {
    api("add_folder", {}, (data) => {
      getFolders();
    });
  };

  const getFolders = () => {
    api("folders", {}, (data) => {
      setFolders(data.folders);
    });
  };

  const deleteFolder = (name) => {
    api("delete_folder", { name: name }, (data) => {
      getFolders();
    });
  };

  const renameFolder = (e, name, newName) => {
    e.preventDefault();
    api("rename_folder", { name: name, new_name: newName }, (data) => {
      getFolders();
    });
  };

  const changeFolder = (newFolder) => {
    api(
      "change_folder",
      { path: currentNote.path, new_folder: newFolder },
      (data) => {
        setCurrentNote(data);
        getNotes();
      }
    );
  };

  const contextValue = {
    loading: loading,
    setLoading: setLoading,
    settings: settings,
    setSettings: setSettings,
    currentPage: currentPage,
    setCurrentPage: setCurrentPage,

    notes: notes,
    setNotes: setNotes,

    currentNote: currentNote,
    setCurrentNote: setCurrentNote,
    content: content,
    setContent: setContent,

    folders: folders,
    setFolders: setFolders,

    currentFolder: currentFolder,
    setCurrentFolder: setCurrentFolder,

    addNote: addNote,
    getNote: getNote,
    getNotes: getNotes,
    editNote: editNote,
    deleteNote: deleteNote,
    duplicateNote: duplicateNote,
    renameNote: renameNote,
    pinNote: pinNote,

    addFolder: addFolder,
    getFolders: getFolders,
    deleteFolder: deleteFolder,
    renameFolder: renameFolder,
    changeFolder: changeFolder,
  };

  useEffect(() => {
    localStorage.setItem("notable", JSON.stringify(settings));

    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings]);

  useEffect(() => {
    settings.lastOpened !== "" && setCurrentNote({ ...settings.lastOpened });
  }, []);

  return (
    <MultiContext.Provider value={contextValue}>
      <div className="full p-4">
        <Nav />
        <div className="py-4">
          <Home />
        </div>
      </div>
    </MultiContext.Provider>
  );
}
