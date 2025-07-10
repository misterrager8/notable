# notable

A simple and intuitive web application for creating, organizing, and managing your markdown notes efficiently.

## Features

- Create, edit, and delete markdown notes
- Organize notes with tags or categories
- Search and filter notes
- Responsive design for desktop and mobile
- Secure user authentication

## Installation / Usage

1. Clone this repo
2. `pip install -r requirements.txt`
3. `cd frontend/`
4. `npm install .`

##### For Regular Users:

5. `npm run build`
6. `cd -`
7. `python3 setup.py develop`
8. `notable --help`

##### For Developers:

5. `npm run dev`

##### Configuration

7. `notable set-config "port" [PORT]`
8. `notable set-config "home_dir" [HOME_DIR]`

9. Run `--help` command for all options:

```
  add-note    Add a new note with the given NAME.
  copy-note   Copy the content of a note by its ID to the clipboard.
  get-config  Get the current configuration settings.
  set-config  Set a configuration setting.
  view-note   View a note by its ID.
  view-notes  View all notes.
  web         Run the web application.
```

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
