/*
 * Author: Daniel Holmlund <daniel.w.holmlund@Intel.com>
 * Copyright (c) 2015 Intel Corporation.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
'use strict';
var util = require('util');
var mraa = require('mraa');

var led = new mraa.Gpio(13);
led.dir(mraa.DIR_OUT);
var deviceId = "abc";

module.exports = {
  relay: relay
};

function relay(req, res) {

  var requestedDeviceId = req.swagger.params.deviceId.value;
  var requestedAction = req.swagger.params.action.value;
	if (requestedDeviceId  === deviceId  ){
      if (requestedAction === "on"){
        led.write(1);
         res.json("Success");
      }
      if (requestedAction === "off"){
        led.write(0);
         res.json("Success");
      }
		   res.json("Action Undefined");
	}
  res.json("Device Id is not found");
}
