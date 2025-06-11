import { Application } from "express";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import App from "../views/App.js";

export function handleRouter(app: Application) {
  app.get("/", (_, res) => {
    const content = renderToStaticMarkup(React.createElement(App));
    res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>OwO farm token</title></head>
      <body>
        <div id="root">${content}</div>
      </body>
    </html>
  `);
  });
}
