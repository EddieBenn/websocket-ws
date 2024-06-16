const WebSocket = require("ws");
const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

app.use("/", express.static(path.resolve(__dirname, "../client")));

const PORT = process.env.PORT || 3000;

// Regular HTTP server using Node Express which serves your webpage
const myServer = app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`);
});

const wsServer = new WebSocket.Server({
  noServer: true,
}); // A WebSocket server

wsServer.on("connection", function (ws) {
  ws.on("message", function (msg) {
    wsServer.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        // Check if client is ready
        client.send(msg.toString()); // Broadcast the message to all clients
      }
    });
  });

  ws.on("close", function () {
    console.log("WebSocket connection closed from server.");
  });

  ws.on("error", function (error) {
    console.error("WebSocket error from server:", error);
  });
});

myServer.on("upgrade", function upgrade(request, socket, head) {
  // Accepts half requests and rejects half. Reload browser page in case of rejection
  if (Math.random() > 0.5) {
    return socket.end("HTTP/1.1 401 Unauthorized\r\n", "ascii"); // Proper connection close in case of rejection
  }

  // Emit connection when request accepted
  wsServer.handleUpgrade(request, socket, head, function done(ws) {
    wsServer.emit("connection", ws, request);
  });
});
