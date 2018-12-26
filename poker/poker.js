var version = "0.0.7";
var socket;
$(document).ready(function () {
    $("#status").append("Version " + version + "<br/>");
    $('#connect').click(function () {
        $('#status').append("attempting to connect<br/>");
        connectWs();
    });


    $("#1").click(function () {
        var payload = "{\"action\":\"vote\", \"method\": \"vote\", \"vote\":\"1\", \"name\": \"" + $("#name").val() + "\"}";
        $('#status').append("sending payload: " + payload + "<br/>");
        socket.send(payload);
    });

});

function connectWs() {
    socket = new WebSocket('wss://gpb9s43yd2.execute-api.us-east-1.amazonaws.com/prod/');
    // Connection opened
    socket.addEventListener('open', function (event) {
        $('#status').append("socket opened<br/>");
        var payload = "{\"action\":\"register\", \"name\": \"" + $("#name").val() + "\"}";
        $('#status').append("sending payload: " + payload + "<br/>");
        socket.send(payload);
    });
    // Listen for messages
    socket.addEventListener('message', function (event) {
        $('#status').append(event.data + "<br/>");
    });
}
