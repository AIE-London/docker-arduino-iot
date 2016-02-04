# Arduino - docker swarm demo #

It is a simple demo of how to use an [arduino UNO](https://www.arduino.cc/en/Main/ArduinoBoardUno) to control docker containers on docker swarm cluster with docker remote API. For the demo we used Grove - Starter Kit Plus which contains components listed below.

### Grove - Starter Kit Plus components ###

* [Base Shield](http://www.seeedstudio.com/wiki/GROVE_-_Starter_Kit_v1.1b#Grove_Base_Board)
* [RGB Backlight LCD](http://www.seeedstudio.com/wiki/Grove_-_LCD_RGB_Backlight)
* [Touch Sensor](http://www.seeedstudio.com/wiki/Grove_-_Touch_Sensor)
* [Button](http://www.seeedstudio.com/wiki/GROVE_-_Starter_Kit_v1.1b#Grove_-_Button)
* [LED](http://www.seeedstudio.com/wiki/GROVE_-_Starter_Kit_v1.1b#Grove_-_LED)
* [Rotary Angle Sensor](http://www.seeedstudio.com/wiki/GROVE_-_Starter_Kit_v1.1b#Grove_-_Rotary_Angle_Sensor)
* [Servo](http://www.seeedstudio.com/wiki/Grove_-_Servo)
* [USB cable type A/B](https://store.arduino.cc/product/M000006)

### Used tools/libraries ###

* [Node](https://nodejs.org/en/)
* [Johnny-five](https://github.com/rwaldron/johnny-five)
* [Docker swarm](https://docs.docker.com/swarm/install-w-machine/)
* [dockerode module](https://github.com/apocas/dockerode) - Docker remote API


### Get started ###

Because the demo use Johnny-Five library you need to first install Arduino IDE. It will let you to upload "StandardFirmata" sketch which allows you to communicate through the usb cable between your computer and Arduino microcontroller.

1. Download Arduino IDE from the [site](https://www.arduino.cc/en/Main/Software) and install it.
2. Run Arduion IDE and from menu "Tools->Board" list select Aruduino/Genuino UNO.
![Screen Shot 2016-01-29 at 14.20.44.png](https://bitbucket.org/repo/5r7n77/images/458790913-Screen%20Shot%202016-01-29%20at%2014.20.44.png)
3. Connect [usb cable](https://store.arduino.cc/product/M000006) to your computer and microcontroller.
4. Select from menu "Tools->Ports" a port which you use for communication with arduino.
![Screen Shot 2016-01-29 at 14.28.08.png](https://bitbucket.org/repo/5r7n77/images/2173095365-Screen%20Shot%202016-01-29%20at%2014.28.08.png)
5. From menu select "StandardFirmata" sketch. File->Examples->Firmata->StandardFirmata
![Screen Shot 2016-01-29 at 14.32.25.png](https://bitbucket.org/repo/5r7n77/images/2613070257-Screen%20Shot%202016-01-29%20at%2014.32.25.png)
6. When is opened, upload the sketch.
![Screen Shot 2016-01-29 at 14.35.14.png](https://bitbucket.org/repo/5r7n77/images/296670973-Screen%20Shot%202016-01-29%20at%2014.35.14.png)
Now you can close Arduino IDE and use Johnny-Five library.

### Arduino docker swarm demo ###

To run the demo you need to first connect all components to Base Shield. Below is description how to connect them.

* RGB Backlight LCD - whichever **I2C** socket.
* Touch Sensor - **D3**
* Button - **D4**
* LED - **D6**
* Rotary Angle Sensor - **A0**
* Servo - **D5**

Next clone the project and install [node](https://nodejs.org/en/).
Inside project folder run ```npm install```

Now you need to create docker swarm cluster, for this demo use the [guide](https://docs.docker.com/swarm/install-w-machine/)

When you finish, run the demo using the command ```npm start```

The configuration has the following actions:

* LCD displays active docker image information (Container name, image name, container id, memory usage, cpu usage).
* Button click - switch active container information of LCD screen.
* Touch sensor - runs new image in this case ubuntu one.
* LED - Used to alert when container CPU usage is more than 80%.
* Rotary Angle Sensor - controls servo.
* Servo - it is controlled with rotary sensor. It is only for testing we should use it for something more clever.
