```mermaid

sequenceDiagram
    participant browser
    participant server

    Note right of browser: The browser adds new note to notes list and rerenders the note list on the page

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa {content: "test note", date: "2023-09-27T02:49:38.642Z"}
    activate server
    server-->>browser: HTTP Status Code 201, {"message":"note created"}
    deactivate server