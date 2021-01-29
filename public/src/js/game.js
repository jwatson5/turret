var ws = new WebSocket('ws://localhost:3000');
var gpinterval;
var gppoll = 200;
var serverinterval;
var servpoll = 800;

var transmitting = false;

console.log(serverinterval);
ws.onopen = function () {
  console.log('websocket established to server...');
  //ws.send(JSON.stringify({data: 'this is from the client'}));
  window.addEventListener("gamepadconnected", connecthandler);
  window.addEventListener("gamepaddisconnected", disconnecthandler);
};

ws.onmessage = function (res) {
  try {
    var d = JSON.parse(res.data);
    console.log(d);
  } catch (e) {
    console.log(e);
  }
};


var controllers = {};

function connecthandler(e) {
  controllers[e.gamepad.index] = e.gamepad;
  console.log(e.gamepad);
  gpinterval = setInterval(controllerInfo, gppoll);
  console.log('Getting controller info every ' + gppoll + 'ms');
  //console.log("Gamepad connected at index " + e.gamepad.index 
  //      + ": " + e.gamepad.id + ". It has " + e.gamepad.buttons.length 
  //      + " buttons and " + e.gamepad.axes.length + " axes.");

}

function disconnecthandler(e) {
  clearInterval(gpinterval);
  delete controllers[e.gamepad.index];
  console.log("Removed Gampad at " + e.gamepad.index);
}

function controllerInfo() {
  /*
  Logitech controller map
  main panel
  b1 is 2, b2 is 0, b3 is 1, b4 is 3
  triggers
  b5 is 4, b6 is 5, b7 is 6, b8 is 7
  centers
  b8 is config(8), b9 is start(9)
  axis buttons
  ax1b is 10, ax2b is 11
  digital control pad D
  dup is 12, dleft is 14, ddown is 13, dright is 15
  */
  
  var gps = navigator.getGamepads();
  var gp = gps[0];
  if (gp) {
    if(gp.buttons[9].pressed) {
      if(transmitting) {
        // stop sending data to server
        clearInterval(serverinterval);
        transmitting = false;
        console.log('Stopped server transmissions');
      } else {
        // start the sending data to server
        serverinterval = setInterval(transmit, servpoll);
        transmitting = true;
        console.log('Starting sending controller data to server');
      }
    }


  }
}

function transmit() {
  var gps = navigator.getGamepads();
  var gp = gps[0];
  if (gp) {
    var controllerData = {
      "x1": gp.axes[0],
      "y1": gp.axes[1],
      "x2": gp.axes[2],
      "y2": gp.axes[3]
    };
    ws.send(JSON.stringify(controllerData));

  }
}





