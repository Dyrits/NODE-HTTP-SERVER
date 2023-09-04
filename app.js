const http = require("http");
const { writeFile } = require("fs");

const server = http.createServer((request, response) => {
  /*
  console.log("headers", request.headers);
  console.log("method", request.method);
  console.log("url", request.url);
  */
  if (request.url === "/") {
    response.setHeader("Content-Type", "text/html");
    response.end(`
    <html lang="en">
      <head>
        <title>Enter a message</title>
      </head>
      <body>
        <h1>Enter a message</h1>
        <form action="/message" method="POST"><input type="text" name="message" /><button type="submit">Send</button></form>
      </body>
    </html>
  `);
  } else if (request.url === "/message" && request.method === "POST") {
    parse(request, (error, data) => {
      error ? end.error500(response) : writeFile("data.txt", data, error => {
        error ? end.error500(response) : end.redirect(response, "/");
      });
    });
  } else {
    end.error404(response);
  }

});

function parse(request, callback) {
  const body = [];
  request.on("data", chunk => {
    body.push(chunk);
  });
  request.on("end", () => {
    const data = Buffer.concat(body).toString();
    callback(null, data);
  });
  request.on("error", (error) => {
    callback(error);
  });
}

const end = {
  error500 (response) {
    response.setHeader("Content-Type", "application/json");
    response.end("500 - Internal Server Error");
  },
  error404 (response) {
    response.setHeader("Content-Type", "application/json");
    response.end("404 - The page you are looking for does not exist.");
  },
  redirect (response, location) {
    response.setHeader("Location", location);
    response.statusCode = 302;
    response.end();
  }
}

server.listen(3000);