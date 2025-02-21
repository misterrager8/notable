export const sorts = [
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
    icon: "pin-angle-fill",
  },
];

export const defaultSettings = {
  theme: "light",
  lastOpened: "",
  mode: "split",
  sort: "favorited",
};

export const api = (url, params, callback) =>
  fetch("/" + url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(params),
  })
    .then((response) => response.json())
    .then((data) => callback(data));
