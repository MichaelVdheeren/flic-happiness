# flic-happiness
Use flic buttons as happiness meter

# based on
Information found at:
* http://blog.denwilliams.net/2016/05/03/flic-on-raspberry-pi-3/
* http://blog.denwilliams.net/2017/05/18/flic-hci-on-raspberry-pi/
* https://github.com/50ButtonsEach/fliclib-linux-hci

# uses
Zapier to publish the events on Google Sheets. Create a zapier.js file and put in:

module.exports = {
	hook: "LINK TO YOUR HOOK"
};
