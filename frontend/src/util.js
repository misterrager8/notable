export const api = (url, params, callback) =>
  fetch("http://localhost:5001/" + url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(params),
  })
    .then((response) => response.json())
    .then((data) => (data.success ? callback(data) : alert(data.msg)));
