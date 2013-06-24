$(document).ready(function () {

	var CANVAS_WIDTH = canvas.width;
	var HALF_CANVAS_WIDTH = CANVAS_WIDTH * 0.5;
	var CANVAS_HEIGHT = canvas.height;
	var HALF_CANVAS_HEIGHT = CANVAS_HEIGHT * 0.5;

	//scroll rate (multiplied by speed)
	var SPEED_SCROLL_FACTOR = 0.1;
	//max player speed
	var MAX_SPEED = 15;
	var MIN_SPEED = 0.5;

	var MAX_ENERGY = 50;
	var MAX_WATER = 250;

	var PLAYER_FRAME_WIDTH = 54;
	var PLAYER_FRAME_HEIGHT = 60;
	var HALF_PLAYER_FRAME_WIDTH = PLAYER_FRAME_WIDTH * 0.5;
	var PLAYER_Y = HALF_CANVAS_HEIGHT - 20;

	//rate at which water goes down
	var WATER_UPTAKE = 0.05;
	//sweat rate 
	var SWEAT_RATE = 0.01;
	//rate at which speed decays (multiplied by current speed)
	var SPEED_DECAY_RATE = 0.1;
	//multiplied by speed to reduce energy
	var ENERGY_SPEED_FACTOR = 0.0006;
	//multiplied by speed to reduce water
	var WATER_SPEED_FACTOR = 0.0002;

	// SUN STUFF

	var SUN_WIDTH = 50;
	var SUN_HEIGHT = 50;

	var SUN_STARTING_X = CANVAS_WIDTH;
	var SUN_STARTING_Y = CANVAS_HEIGHT * .25;

	var SUN_X_FACTOR = .1;
	var SUN_Y_FACTOR = 1;

	var WIN_DISTANCE = 10000;

	//+water per frame when drinking
	var DRINK_WATER_AMOUNT = 1;

	var STATE_TITLE = 0;
	var STATE_GAME = 1;
	var STATE_DEATH = 2;

	var gameState = STATE_TITLE;

	var introScreen = 0;
	var introInterval;


	//left or right for running
	var whichKey = 0;
	var pause = false;
	var gameStart = true;
	var heartBeat = 0;
	var beatTime = 0;

	//timer for title heart beat
	var titleTick = 0;

	var person;
	var level;
	var corpses = [];
	//attempt to load local storage
	var retrievedObject = localStorage.getItem('heartbeat');
	if (retrievedObject != null) {
		var parsy = JSON.parse(retrievedObject);
		if (Object.prototype.toString.call(parsy) === '[object Array]') {
			for (var i = 0; i < parsy.length; i++) {
				corpses[corpses.length] = new Corpse(parsy[i].x, parsy[i].water);
			}
		}
		else {
			corpses[corpses.length] = new Corpse(parsy.x, parsy.water); ;
		}
	}

	//	var beating = false;

	// Function to play the heartbeat

	function playBeat() {
		beatTime = 0;
		//if (soundReady) {
		soundManager.play('beat' + (heartBeat < 300 ? '2' : ''), {
			onfinish: function () {
				//		beating = true;

			}
		});
		//}

		if (gameState == STATE_GAME) {
			setTimeout(function () {
				//increases the delay of the sound  person.energy * 10
				playBeat();
			}, heartBeat);
		}

	}

	function calcSunX(levelX) {
		return SUN_STARTING_X - (levelX * SUN_X_FACTOR);
	}

	function calcSunY(levelX) {
		return .00117188 * Math.pow(((levelX / 10) - 320), 2);
	}

	var images = [];
	var loadedImages = [];
	var personImage = new Image();
	personImage.src = "images/thirstyguy.png";
	images[0] = personImage;
	var sweatImage = new Image();
	sweatImage.src = "images/sweat.png";
	images[1] = sweatImage;
	var sweats = [];

	images[2] = new Image();
	images[2].src = "images/boulder.png";

	images[3] = new Image();
	images[3].src = "images/boulder-shadow.png";

	images[4] = new Image();
	images[4].src = "images/mesa.png";
	images[5] = new Image();
	images[5].src = "images/mesa2.png";

	images[6] = new Image();
	images[6].src = "images/vasquez.png";
	images[7] = new Image();
	images[7].src = "images/vasquez-shadow.png";

	images[8] = new Image();
	images[8].src = "images/vas2.png";
	images[9] = new Image();
	images[9].src = "images/vas2-shadow.png";


	images[10] = new Image();
	images[10].src = "images/heartsprite2.png";

	var landmarkSettings = [];

	for (var cats = 0; cats < 100; cats++) {
		if (cats % 5 != 0 && cats > 5) {
			landmarkSettings.push({
				"src": 2,
				"shadowSrc": 3,
				"level1": {
					"x": 200 * cats + (cats * cats * 20)
				}
			});
		}
		else {
			if (cats != 2) {
				landmarkSettings.push({
					"src": 4 + ((cats * 2) % 6),
					"shadowSrc": 5 + ((cats * 2) % 6),
					"level1": {
						"x": 200 * cats + (cats * cats * 20)
					}
				});
			}
		}
	}
	landmarkSettings.push({
		"src": 4,
		"shadowSrc": 5,
		"level1": {
			"x": 2500
		}
	});
	landmarkSettings.push({
		"src": 2,
		"shadowSrc": 3,
		"level1": {
			"x": 3150
		}
	});
	landmarkSettings.push({
		"src": 6,
		"shadowSrc": 7,
		"level1": {
			"x": 3500
		}
	});
	landmarkSettings.push({
		"src": 4,
		"shadowSrc": 5,
		"level1": {
			"x": 4200
		}
	});
	landmarkSettings.push({
		"src": 6,
		"shadowSrc": 7,
		"level1": {
			"x": 5000
		}
	});
	landmarkSettings.push({
		"src": 2,
		"shadowSrc": 3,
		"level1": {
			"x": 5700
		}
	}); landmarkSettings.push({
		"src": 6,
		"shadowSrc": 7,
		"level1": {
			"x": 6100
		}
	});
	landmarkSettings.push({
		"src": 4,
		"shadowSrc": 5,
		"level1": {
			"x": 6800
		}
	});

	// Preloads the landmark images
	function loadImages(sources, callback) {
		var numLoadedImages = 0;

		// Loop over each source
		$.each(sources, function () {
			// Get this image's data from the source object
			var imageData = $(this).get()[0];

			// Create an image object to draw to the canvas
			var imageObj = new Image();
			imageObj.src = imageData.src;
			var shadowImageObj = new Image();
			shadowImageObj.src = imageData.shadowSrc;

			// Add the image to the loadedImages object
			loadedImages.push({
				"imgObj": imageObj,
				"shadowImgObj": shadowImageObj,
				"imageData": imageData
			});

			// After the image has loaded
			imageObj.onload = function () {
				// If this is the last image
				if (++numLoadedImages >= sources.length) {
					// Run the callback
					callback();
				}
			};
		});
	}

	function drawShadow(landmark, levelX, sunX, sunY) {
		// Number of slices to create
		var numSlices = Math.abs(landmark.height);

		// Height of each slice
		var sliceHeight = 1;

		// Skew factor
		var skewFactor = calculateSunAngle(calcSunX(levelX), calcSunY(levelX), (landmark.x + (landmark.width / 2)) - levelX, landmark.y);

		for (var n = numSlices; n >= 0; n--) {

			// Source: Where to take the slice from
			var sx = 0,
                sy = sliceHeight * n,
                sWidth = landmark.width,
                sHeight = sliceHeight;

			// Destination: where to draw the slice
			var dx = (landmark.x - levelX) + (n * skewFactor) - (landmark.height * skewFactor),
                dy = landmark.y + (landmark.height - n - 1),
                dWidth = landmark.width,
                dHeight = sliceHeight;

			ctx.drawImage(landmark.shadowImgObj, sx, sy, sWidth, sHeight,
                                dx, dy, dWidth, dHeight);
		}
	}

	// Function to calculate the angle of the sun for shadow positioning
	function calculateSunAngle(sunX, sunY, imageX, imageY) {
		dy = imageY - sunY;
		dx = imageX - sunX;

		theta = Math.atan2(dy, dx);
		// Theta = angle in degrees
		theta *= 180 / Math.PI;

		// Convert the angle to a skew factor for the image slicer
		if (theta < 90) {
			return -2 + (theta * .022222222);
		}
		else if (theta > 90) {
			return (theta - 90) * .022222222;
		}
		else {
			return 0;
		}
	}

	function init() {
		//gameStart = false;
		person = new Person();

		level = new Level(0.05);

		// Preload images
		loadImages(images, function () {
			$.each(landmarkSettings, function () {
				landmark = $(this).get()[0];
				level.addLandmark(landmark.src, landmark.shadowSrc, landmark.level1.x);
			});
		});
		gameState = STATE_TITLE;
	}

	function update() {
		switch (gameState) {
			case STATE_TITLE:
				//todo: title
				if (titleTick == 0) {
					playBeat();
				}
				titleTick++;
				if (titleTick > 20) { titleTick = 0; }

				break;
			case STATE_GAME:
				beatTime++;
				for (var i = 0; i < sweats.length; i++) {
					if (sweats[i] != null) {
						sweats[i].update();
						if (sweats[i].kill) {
							sweats[i] = null;
						}
					}
				}
				person.update();

				if (person.water <= 0 || person.energy <= 0) {
					corpses[corpses.length] = new Corpse(level.x, person.water);

					//TODO: game over
					gameState = STATE_DEATH;


					localStorage.setItem('heartbeat', JSON.stringify(corpses));
				}
				break;
			case STATE_DEATH:

				//	init();
				break;
		}
	}

	function draw() {

		ctx.beginPath();
		ctx.rect(0, 0, CANVAS_WIDTH, HALF_CANVAS_HEIGHT);
		ctx.fillStyle = '#00FFFF';
		ctx.fill();

		ctx.beginPath();
		ctx.rect(0, HALF_CANVAS_HEIGHT, CANVAS_WIDTH, HALF_CANVAS_HEIGHT);
		ctx.fillStyle = '#FFFF00';
		ctx.fill();


		level.draw();
		for (var i = 0; i < corpses.length; i++) {
			corpses[i].draw();

		}

		switch (gameState) {
			case STATE_GAME:
				person.draw();
				for (var i = 0; i < sweats.length; i++) {
					if (sweats[i] != null) {
						sweats[i].draw();
					}
				}
				break;
			case STATE_DEATH:
				ctx.clearRect(0, 0, ctx.width, ctx.height);
				ctx.font = "20px Arial";
				ctx.fillStyle = "#FF0000";
				ctx.textBaseline = "bottom";

				if (person.water > 0) {
					ctx.fillText("You didn't make it. Water in your remains can be salvaged", HALF_CANVAS_WIDTH, 50);
					ctx.fillText("by subsequent travelers to increase their own odds of survival.", HALF_CANVAS_WIDTH, 80);
				} else {
					ctx.fillText("You died of thirst. You left no water for subsequent travelers", HALF_CANVAS_WIDTH, 50);
					ctx.fillText("to increase their own odds of survival.", HALF_CANVAS_WIDTH, 80);
				}
				break;
			case STATE_TITLE:


				ctx.clearRect(0, 0, ctx.width, ctx.height);


				ctx.fillStyle = "black";
				ctx.fillRect(0, 0, 640, 480);
				ctx.textAlign = 'center';

				ctx.font = "50px Arial";
				ctx.fillStyle = "white";
				ctx.textBaseline = "bottom";
				ctx.fillText("Thirst", HALF_CANVAS_WIDTH, 50);




				ctx.font = "25px Arial";
				ctx.fillStyle = "white";
				ctx.fillText("Keep running. Survive until sunset..", HALF_CANVAS_WIDTH, HALF_CANVAS_HEIGHT - 100);
				ctx.font = "20px Arial";
				ctx.fillText("use z and / to run", HALF_CANVAS_WIDTH, HALF_CANVAS_HEIGHT + 20);
				ctx.fillText("hit esc to begin", HALF_CANVAS_WIDTH, HALF_CANVAS_HEIGHT + 40);


				break;
		}
		if (pause == true) {
			ctx.font = "20px Arial";
			ctx.fillStyle = "#FF0000";
			ctx.textBaseline = "bottom";
			ctx.fillText("Paused", 20, 50);

		}


	}

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function Sweat() {
		this.x = HALF_CANVAS_WIDTH + getRandomInt(-10, 10);
		this.y = getRandomInt(PLAYER_Y + 10, PLAYER_Y + (PLAYER_FRAME_HEIGHT * 0.5));
		this.i = 0;
		this.kill = false;
		this.update = function () {
			this.i++;
			this.y += (this.i * 0.5);
			if (this.i > 10) {
				this.kill = true;
			}
		}
		this.draw = function () {
			ctx.drawImage(sweatImage, this.x, this.y);
		}
	}

	function Corpse(x, water) {
		this.x = x;
		this.water = water;
		this.drink = function (thirst) {
			var amt = Math.min(this.water, Math.min(thirst, DRINK_WATER_AMOUNT));
			this.water -= amt;
			return amt;
		}
		this.draw = function () {
			var drawX = HALF_CANVAS_WIDTH + this.x - 25 - level.x;


			//todo: draw skeleton or fleshy body
			if (this.water > 0) {
				ctx.drawImage(personImage, 13 * PLAYER_FRAME_WIDTH, 0, PLAYER_FRAME_WIDTH, PLAYER_FRAME_HEIGHT, drawX, PLAYER_Y, PLAYER_FRAME_WIDTH, PLAYER_FRAME_HEIGHT);
			} else {
				ctx.drawImage(personImage, 14 * PLAYER_FRAME_WIDTH, 0, PLAYER_FRAME_WIDTH, PLAYER_FRAME_HEIGHT, drawX, PLAYER_Y, PLAYER_FRAME_WIDTH, PLAYER_FRAME_HEIGHT);
			}
			//corpse water meter
			meter = this.water * 100 / MAX_WATER;
			ctx.beginPath();
			ctx.rect(drawX + 55, PLAYER_Y - meter + 60, 5, meter);
			ctx.fillStyle = '#0000FF';
			ctx.fill();


		}
	}

	function Landmark(imgObj, shadowImgObj, x, y, width, height) {
		this.imgObj = imgObj;
		this.shadowImgObj = shadowImgObj;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	function Level(heat) {
		this.heat = heat;
		this.x = 0;
		this.landmarks = [];

		this.inShadow = function () {

			for (var i = 0; i < this.landmarks.length; i++) {
				// If the landmark is on the screen
				if (this.landmarks[i].x > this.x - 500 && this.landmarks[i].x < this.x + CANVAS_WIDTH) {
					// If the character is directly under the landmark
					/*
					if (this.x + HALF_CANVAS_WIDTH > this.landmarks[i].x && this.x + HALF_CANVAS_WIDTH < this.landmarks[i].x ) {
					return true;
					}
					*/
					// If the character is in the shadow
					var sunSkew = calculateSunAngle(calcSunX(this.x), calcSunY(this.x), this.landmarks[i].x + (this.landmarks[i].width / 2) - this.x, this.landmarks[i].y);
					if (
					// Character is right of the shadow's left edge
                        this.x + HALF_CANVAS_WIDTH > (this.landmarks[i].x - sunSkew * 30) &&
					// Character is left of the shadow's right edge
                        this.x + HALF_CANVAS_WIDTH < (this.landmarks[i].x - sunSkew * 30) + this.landmarks[i].width
                    ) {
						return true;
					}
				}
			}
			return false;
		}

		this.addLandmark = function (imgIndex, shadowImgIndex, x, y) {
			var index = level.landmarks.length;
			level.landmarks[index] = new Landmark();
			level.landmarks[index].imgObj = images[imgIndex];
			level.landmarks[index].shadowImgObj = images[shadowImgIndex];
			level.landmarks[index].x = x;
			level.landmarks[index].y = HALF_CANVAS_HEIGHT;
			level.landmarks[index].width = images[imgIndex].width;
			level.landmarks[index].height = images[imgIndex].height;
		}
		this.getHeat = function (inShadow) {
			return inShadow ? this.heat * 0.5 : this.heat;
		}
		this.draw = function () {
			// Draw sun
			var startPoint = (Math.PI / 180) * 0;
			var endPoint = (Math.PI / 180) * 360;

			ctx.beginPath();

			ctx.arc(calcSunX(this.x), calcSunY(this.x), SUN_WIDTH, startPoint, endPoint, true);

			ctx.fill();

			ctx.closePath();

			// Draw landmarks
			for (var i = 0; i < this.landmarks.length; i++) {
				if (this.landmarks[i].x > this.x - this.landmarks[i].width && this.landmarks[i].x < this.x + CANVAS_WIDTH) {
					ctx.drawImage(this.landmarks[i].imgObj, this.landmarks[i].x - this.x, 140 + (100 - this.landmarks[i].height));
					drawShadow(this.landmarks[i], this.x, 0, 0);
				}
			}
		}
	}

	function Person() {
		this.leg = 0;
		this.walk = false;
		this.walkCounter = 0;
		this.walkCheck = false;
		this.lastTime = new Date();
		this.speed = 0;
		this.water = MAX_WATER;
		this.energy = MAX_ENERGY;
		this.frame = 0;
		this.frameCounter = 0;
		this.temp = 0;
		this.inShade = false;
		this.draw = function () {

			//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
			ctx.drawImage(personImage, this.frame * PLAYER_FRAME_WIDTH, this.inShade ? 0 : PLAYER_FRAME_HEIGHT, PLAYER_FRAME_WIDTH, PLAYER_FRAME_HEIGHT, HALF_CANVAS_WIDTH - HALF_PLAYER_FRAME_WIDTH, PLAYER_Y, PLAYER_FRAME_WIDTH, PLAYER_FRAME_HEIGHT);


			//draw meters 

			var meter;
			//			meter = person.speed * 10;
			//			ctx.beginPath();
			//			ctx.rect(10, canvas.height - meter, 10, meter);
			//			ctx.fillStyle = 'yellow';
			//			ctx.fill();

			meter = person.water * CANVAS_HEIGHT / MAX_WATER;
			ctx.beginPath();
			ctx.rect(CANVAS_WIDTH - 10, CANVAS_HEIGHT - meter, 10, meter);
			ctx.fillStyle = '#0000FF';
			ctx.fill();

			var heartSize = 90;
			heartBeat = (person.energy * 2500) / MAX_ENERGY;

			if (heartBeat < 100) {
				pulse = !pulse;
			}
			else {
				pulse = ((beatTime >= 0 && beatTime < 3) || (beatTime >= 7 && beatTime < 10));
			}
			//	document.getElementById("debug").innerHTML = heartBeat;
			ctx.drawImage(images[10], heartSize * (pulse ? 1 : 0), 0, heartSize, heartSize, HALF_CANVAS_WIDTH - heartSize * 0.5, CANVAS_HEIGHT - 5 - heartSize, heartSize, heartSize);

			/*			meter = person.energy * CANVAS_HEIGHT / MAX_ENERGY;
			ctx.beginPath();
			ctx.rect(CANVAS_WIDTH - 30, CANVAS_HEIGHT - meter, 10, meter);
			ctx.fillStyle = '#FF0000';
			ctx.fill();*/

		}
		this.update = function () {
			//water usage
			var waterLeft = WATER_UPTAKE;
			this.water -= waterLeft;

			//HEAT
			this.inShade = level.inShadow();
			var heat = level.getHeat(this.inShade); //checks for shadow
			if (!this.inShade) {
				this.temp += heat;
			}
			else {
				this.temp -= level.heat - heat;
			}
			this.temp = Math.max(Math.min(this.temp, 200), 0);
			//sweat from temp
			for (var i = 0; i < this.temp; i += 10) {
				if (getRandomInt(0, 10) == 5) {
					var sweated = false;
					for (var j = 0; j < sweats.length; j++) {
						if (sweats[j] == null) {
							sweats[j] = new Sweat();
							sweated = true;
							break;
						}
					}
					if (!sweated) {
						sweats[sweats.length] = new Sweat();
					}
				}
			}
			this.water -= this.temp * SWEAT_RATE;

			//water usage
			waterLeft -= heat;
			//	console.log("water left: " + waterLeft);
			if (waterLeft < 0) {//if you use too much water
				waterLeft *= 0.5; //half goes to extra water usage
				this.water -= waterLeft;
			}
			this.energy += waterLeft; //remainder goes to life (+/-)

			//walking
			this.walkCheck = false;
			if (whichKey == 0 && this.leg == 1) {
				this.leg = 0;
				this.walk = true;
				this.walkCheck = true;
			} else if (whichKey == 1 && this.leg == 0) {
				this.leg = 1;
				this.walk = true;
				this.walkCheck = true;
			}

			if (this.walkCheck) {
				//determine time since last step

				var now = new Date();
				var elapsed = now - this.lastTime;
				this.lastTime = now;
				this.speed += (2000 / elapsed);
			}

			//speed and animation
			this.speed -= SPEED_DECAY_RATE * this.speed;
			this.speed = Math.min(MAX_SPEED, this.speed);
			this.frameCounter += this.speed;
			if (this.frameCounter > 10) {
				this.frame++;
				this.frameCounter = 0;
				if (this.frame > 12) {
					this.frame = 1;
				}
			}
			if (this.speed < MIN_SPEED) {
				this.speed = 0;
				this.frame = 0;
				this.frameCounter = 0;
			}


			level.x += this.speed * SPEED_SCROLL_FACTOR;

			//water drinking and corpse looting
			var corpseWidth = 25;
			for (var i = 0; i < corpses.length; i++) {
				if (corpses[i].x + HALF_CANVAS_WIDTH > level.x && corpses[i].x + HALF_CANVAS_WIDTH < level.x + CANVAS_WIDTH) {
					if (level.x > corpses[i].x - corpseWidth && level.x < corpses[i].x + corpseWidth) {
						if (this.water < MAX_WATER && this.speed == 0 && corpses[i].water > 0) {
							this.water += corpses[i].drink(Math.min(DRINK_WATER_AMOUNT, MAX_WATER - this.water));
						}
					}
				}
			}

			//water and energy usage
			this.water -= this.speed * this.speed * WATER_SPEED_FACTOR;
			this.water = Math.min(Math.max(this.water, 0), MAX_WATER);
			this.energy -= this.speed * this.speed * ENERGY_SPEED_FACTOR;
			this.energy = Math.min(Math.max(this.energy, 0), MAX_ENERGY);


		}
	}

	timer.onTick = function (dt) {

		if (pause == false) {
			update();
		}
		draw();

	}

	input.onMouseDown = function (x, y) {
		// handle mousedown
		person.walk = false;
		if (x < HALF_CANVAS_WIDTH) {
			whichKey = 0;
		}
		else {
			whichKey = 1;
		}
	}


	input.onMouseUp = function (x, y) {
		// handle mouseup
		//	person.energy = 0;
	}

	input.onMouseMove = function (x, y) {
		// handle mousemove
	}


	$(document).keydown(function (e) {
		//		if (e.keyCode == 39) { } 
	});

	$(document).keypress(function (e) {
		person.walk = false;
		switch (e.which) {
			case 122:
				whichKey = 0;
				e.preventDefault();
				break;
			case 47:
				whichKey = 1;
				e.preventDefault();
				break;
		}
	});

	$(document).keyup(function (e) {
		if (e.keyCode == 27) {


			if (gameState == STATE_TITLE) {
				gameState = STATE_GAME;
				playBeat();
			}

			else {
				if (pause == false) {
					pause = true;

				}
				else if (pause == true) {

					pause = false;
				}


			}
			e.preventDefault();
		}

	});

	$(canvas).click(function () {



	});

	var soundReady = false;
	/*	soundManager.onready(function () {
	// ready to go! createSound() and play() etc. can now be called
	soundReady = true;
	}); */
	//not firing?


	init();
});
