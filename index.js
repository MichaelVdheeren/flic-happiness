/*
 * This example program connects to already paired buttons and register event listeners on button events.
 * Run the newscanwizard.js program to add buttons.
 */
var Flic = require("./flic");
var zapier = require("./zapier");
var request = require('request');
var moment = require('moment');

var FlicClient = Flic.Client;
var FlicConnectionChannel = Flic.ConnectionChannel;

var client = new FlicClient('192.168.0.199', 5551);

function listenToButton(bdAddr) {
	var cc = new FlicConnectionChannel(bdAddr);
	client.addConnectionChannel(cc);
	cc.on("buttonClickOrHold", function(clickType, wasQueued, timeDiff) {
		// set the data
		var data = {
      button: bdAddr,
			date: moment(new Date()).format("YYYY-MM-DD"),
			hour: moment(new Date()).format("HH"),
			minute: moment(new Date()).format("mm"),
    };

		// call the webhook
		request({
	    url: zapier.hook,
	    method: "POST",
	    json: data
		});
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
