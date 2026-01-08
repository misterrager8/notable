import { createContext, useEffect, useState } from "react";
import { api } from "./util";

export const MultiContext = createContext();

export default function MultiProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [showSide, setShowSide] = useState(false);
  const [showFolders, setShowFolders] = useState(false);

  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentNote, setCurrentNote] = useState(
    JSON.parse(localStorage.getItem("notable-last-opened"))
  );
  const [currentFolder, setCurrentFolder] = useState(null);
  const [sort, setSort] = useState(
    localStorage.getItem("notable-sort") || "favorited"
  );

  const [mode, setMode] = useState(
    localStorage.getItem("notable-mode") || "split"
  );
  const [content, setContent] = useState("");

  const [searchResults, setSearchResults] = useState([]);
  const [homeDir, setHomeDir] = useState(
    localStorage.getItem("notable-home-dir")
  );

  const getAll = () =>
    api(
      "get_all",
      { path: homeDir, folder: currentFolder, sort: sort },
      (data) => {
        setNotes(data.notes);
        setFolders(data.folders);
      }
    );

  const createNote = () => {
    api(
      "add_note",
      {
        folder: currentFolder,
        sort: sort,
      },
      (data) => {
        setNotes(data.notes);
        setCurrentNote(data.note);
        setFolders(data.folders);
      }
    );
  };

  const editNote = (content) => {
    api(
      "edit_note",
      {
        path: currentNote.path,
        content: content,
        folder: currentFolder,
        sort: sort,
      },
      (data) => {
        setNotes(data.notes);
        setCurrentNote(data.note);
        setFolders(data.folders);
      }
    );
  };

  const deleteNote = () => {
    api(
      "delete_note",
      {
        path: currentNote.path,
        folder: currentFolder,
        sort: sort,
      },
      (data) => {
        setNotes(data.notes);
        setCurrentNote(null);
        setFolders(data.folders);
      }
    );
  };

  const toggleBookmark = () => {
    api(
      "toggle_bookmark",
      {
        path: currentNote.path,
        folder: currentFolder,
        sort: sort,
      },
      (data) => {
        setNotes(data.notes);
        setCurrentNote(data.note);
        setFolders(data.folders);
      }
    );
  };

  const changeFolder = (newFolder) => {
    api(
      "change_folder",
      {
        path: currentNote.path,
        new_folder: newFolder,
        folder: currentFolder,
        sort: sort,
      },
      (data) => {
        setNotes(data.notes);
        setCurrentNote(data.note);
        setFolders(data.folders);
      }
    );
  };

  const renameNote = (e, newName) => {
    e.preventDefault();
    api(
      "rename_note",
      {
        path: currentNote.path,
        new_name: newName,
        folder: currentFolder,
        sort: sort,
      },
      (data) => {
        setNotes(data.notes);
        setCurrentNote(data.note);
        setFolders(data.folders);
      }
    );
  };

  const searchNotes = (e, query) => {
    e.preventDefault();
    api(
      "search",
      {
        query: query,
      },
      (data) => {
        setSearchResults(data.results);
      }
    );
  };

  const getNote = (path) => {
    api(
      "get_note",
      {
        path: path,
      },
      (data) => {
        setCurrentNote(data.note);
      }
    );
  };

  const addFolder = () => {
    api(
      "add_folder",
      {
        folder: currentFolder,
        sort: sort,
      },
      (data) => {
        setNotes(data.notes);
        setFolders(data.folders);
        setCurrentFolder(data.folder.name);
      }
    );
  };

  const renameFolder = (e, folder, newName) => {
    e.preventDefault();
    api(
      "rename_folder",
      {
        name: folder,
        new_name: newName,
        folder: currentFolder,
        sort: sort,
      },
      (data) => {
        setNotes(data.notes);
        setFolders(data.folders);
      }
    );
  };

  const deleteFolder = (name) => {
    api(
      "delete_folder",
      {
        name: name,
        folder: currentFolder,
        sort: sort,
      },
      (data) => {
        setNotes(data.notes);
        setFolders(data.folders);
      }
    );
  };

  useEffect(() => {
    homeDir && getAll();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [currentFolder, sort]);

  useEffect(() => {
    localStorage.setItem("notable-sort", sort);
  }, [sort]);

  useEffect(() => {
    !showSide && setShowFolders(false);
  }, [showSide]);

  useEffect(() => {
    localStorage.setItem("notable-last-opened", JSON.stringify(currentNote));
  }, [currentNote]);

  useEffect(() => {
    localStorage.setItem("notable-mode", mode);
  }, [mode]);

  const contextValue = {
    loading: loading,
    setLoading: setLoading,

    showSide: showSide,
    setShowSide: setShowSide,

    notes: notes,
    setNotes: setNotes,
    getAll: getAll,

    currentNote: currentNote,
    setCurrentNote: setCurrentNote,

    currentFolder: currentFolder,
    setCurrentFolder: setCurrentFolder,

    mode: mode,
    setMode: setMode,

    folders: folders,
    setFolders: setFolders,
    sort: sort,
    setSort: setSort,

    showFolders: showFolders,
    setShowFolders: setShowFolders,

    createNote: createNote,
    editNote: editNote,
    deleteNote: deleteNote,
    toggleBookmark: toggleBookmark,
    changeFolder: changeFolder,
    renameNote: renameNote,
    addFolder: addFolder,
    renameFolder: renameFolder,
    deleteFolder: deleteFolder,

    content: content,
    setContent: setContent,

    searchNotes: searchNotes,
    searchResults: searchResults,
    setSearchResults: setSearchResults,

    getNote: getNote,

    homeDir: homeDir,
    setHomeDir: setHomeDir,
  };

  return (
    <MultiContext.Provider value={contextValue}>
      {children}
    </MultiContext.Provider>
  );
}
