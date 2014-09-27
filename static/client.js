var socket;

////////////////////////////////////////////////////////////////////////////////
// handles for page content so we don't have to constantly search DOM for them
////////////////////////////////////////////////////////////////////////////////

var hist, code, output, docs;

window.onload = function(e) {
    hist   = document.getElementById('history');
    code   = document.getElementById('code');
    editor = document.getElementById('editor');
    output = document.getElementById('output');
    docs   = document.getElementById('docs');

    socket = io();
    socket.on('connect', function() {
        socket.on('addToHistory', addToHistory);
        socket.on('result', addResult);
        socket.on('error', addError);
    });
}

////////////////////////////////////////////////////////////////////////////////
// actions for UI
////////////////////////////////////////////////////////////////////////////////

function evaluateCode() {
    socket.emit('execute', editor.value);
    editor.value = "";
}

////////////////////////////////////////////////////////////////////////////////
// updaters for UI
////////////////////////////////////////////////////////////////////////////////

function addToHistory(code) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(code));
    div.className = "historyItem";
    div.onclick = function() {
        editor.value = code;  
    };
    hist.appendChild(div);
}

function addResult(result) {
    console.log(result);
    item = document.createTextNode(result);
    output.appendChild(item);
}

function addError(error) {
    console.log(error);
    item = document.createTextNode(error);
    output.appendChild(item);
}

////////////////////////////////////////////////////////////////////////////////
// handle communication from server
////////////////////////////////////////////////////////////////////////////////


