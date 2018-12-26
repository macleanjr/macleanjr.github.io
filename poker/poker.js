/* eslint-disable */

var version = "0.1.0";
var socket;

$(document).ready(function () {
    $("#status").prepend("Version " + version + "<br/>");
    $('#connect').click(function () {
        $('#status').prepend("attempting to connect<br/>");
        connectWs();
    });


    $(".vote").click(function () {
        var payload = new Object();
        payload.action = "vote";
        payload.method = "vote";
        payload.vote = String($(this).data("vote"));
        payload.name = $("#name").val();

        $('#status').prepend("sending payload: " + JSON.stringify(payload) + "<br/>");
        socket.send(JSON.stringify(payload));
    });

});

function processVotes(votes) {
    $("#status").prepend("Processing votes<br/>");
    $("#results").html("");
    votes.forEach(function (v) {
        console.log(v);

        $("#results").prepend(v.name + " - " + v.vote + "<br/>");
    });

}

function connectWs() {
    socket = new WebSocket('wss://gpb9s43yd2.execute-api.us-east-1.amazonaws.com/prod/');
    // Connection opened
    socket.addEventListener('open', function (event) {
        $('#status').prepend("socket opened<br/>");
        var payload = "{\"action\":\"register\", \"name\": \"" + $("#name").val() + "\"}";
        $('#status').prepend("sending payload: " + payload + "<br/>");
        socket.send(payload);
    });
    // Listen for messages
    socket.addEventListener('message', function (event) {
        try {
            var message = JSON.parse(event.data);

            if (message.votes) {
                processVotes(message.votes);
            }
        } catch (e) {
            console.log(e);
        }

        $('#status').prepend(event.data + "<br/>");

    });

    socket.addEventListener('close', function (event) {
        $('#status').prepend("socket closed<br/>");

    });

    socket.onerror = function (e) {
        $('#status').prepend("WebSocket Error: ", e);
        //Custom function for handling errors

    };
}
