/*
 * This example program connects to already paired buttons and register event listeners on button events.
 * Run the newscanwizard.js program to add buttons.
 */


var Flic = require("./flic");
var FlicClient = Flic.Client;
var FlicConnectionChannel = Flic.ConnectionChannel;

var client = new FlicClient("localhost", 5551);

function listenToButton(bdAddr) {
	var cc = new FlicConnectionChannel(bdAddr);
	client.addConnectionChannel(cc);
	cc.on("buttonUpOrDown", function(clickType, wasQueued, timeDiff) {
		console.log(bdAddr + " " + clickType + " " + (wasQueued ? "wasQueued" : "notQueued") + " " + timeDiff + " seconds ago");
	});
	cc.on("connectionStatusChanged", function(connectionStatus, disconnectReason) {
		console.log(bdAddr + " " + connectionStatus + (connectionStatus == "Disconnected" ? " " + disconnectReason : ""));
	});
}

client.once("ready", function() {
	console.log("Connected to daemon!");
	client.getInfo(function(info) {
		info.bdAddrOfVerifiedButtons.forEach(function(bdAddr) {
			listenToButton(bdAddr);
		});
	});
});

client.on("bluetoothControllerStateChange", function(state) {
	console.log("Bluetooth controller state change: " + state);
});

client.on("newVerifiedButton", function(bdAddr) {
	console.log("A new button was added: " + bdAddr);
	listenToButton(bdAddr);
});

client.on("error", function(error) {
	console.log("Daemon connection error: " + error);
});

client.on("close", function(hadError) {
	console.log("Connection to daemon is now closed");
});
