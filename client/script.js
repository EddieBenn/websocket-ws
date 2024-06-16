// WebSocket variables
function connectWebSocket() {
const url = `ws://${location.host}/myWebsocket`;
const mywsServer = new WebSocket(url);

// DOM Elements
const myMessages = document.getElementById("messages");
const myInput = document.getElementById("message");
const sendBtn = document.getElementById("send");

// Initially disable the send button
sendBtn.disabled = true;

// Enable send button only when there is input in the text field and WebSocket is open
myInput.addEventListener("input", () => {
    sendBtn.disabled = !myInput.value.trim();
});

// Sending message from client
function sendMsg() {
    const text = myInput.value;
    if (text.trim() === "") return; // Prevent sending empty messages
    msgGeneration(text, "Client");
    mywsServer.send(text);
    myInput.value = ""; // Clear input field after sending
    sendBtn.disabled = true; // Disable send button until there is new input
}

// Creating DOM element to show received messages on browser page
function msgGeneration(msg, from) {
    const newMessage = document.createElement("h5");
    newMessage.innerText = `${from} says: ${msg}`;
    myMessages.appendChild(newMessage);
}

// Enabling send message when connection is open
mywsServer.onopen = function() {
    console.log("WebSocket connection opened.");
    sendBtn.disabled = !myInput.value.trim(); // Enable button if input field has content
};

// Handling message event
mywsServer.onmessage = function(event) {
    const { data } = event;
    msgGeneration(data, "Server");
};

// Handling WebSocket closure
mywsServer.onclose = function(event) {
    console.error("WebSocket connection closed from client:", event);
    sendBtn.disabled = true;
    setTimeout(connectWebSocket, 1000); // Attempt to reconnect after 1 second
};

// Handling WebSocket errors
mywsServer.onerror = function(event) {
    console.error("WebSocket error from client:", event);
};

// Add event listener for the send button click
sendBtn.addEventListener("click", sendMsg, false);
}

connectWebSocket();