var sources = [

];

// Object to hold all the images after they've been loaded
var loadedImages = {};

var canvas = $('#canvas').get()[0];
var context = canvas.getContext('2d');

// Preloads the images
function loadImages(sources, callback) {
    var numLoadedImages = 0;

    // Loop over each source
    $.each(sources, function() {
        // Get this image's data from the source object
        var imageData = $(this).get()[0];

        // Create an image object to draw to the canvas
        var imageObj = new Image();
        imageObj.src = imageData.src;
        
        // After the image has loaded
        imageObj.onload = function() {
            // Add the image to the loadedImages object
            loadedImages[imageData.name] = {
                "imageObj": imageObj,
                "imageData": imageData
            };

            // If this is the last image
            if ( ++numLoadedImages >= sources.length ) {
                // Run the callback
                callback();
            }
        };
    });
}

// Function to draw all the loaded images with their shadows. This can be run every tick to update the position of the shadows if you clear the canvas first
function drawLoadedImages(level, sunX, sunY) {
    $.each(loadedImages, function() {
        drawImage($(this).get()[0], level);
        drawShadow($(this).get()[0], level, sunX, sunY);
    });
}

// Function to draw the image
function drawImage(image, level) {
    context.drawImage(image.imageObj, image.imageData[level].x, image.imageData[level].y); 
}

// Function to draw the shadow
function drawShadow(image, level, sunX, sunY) {
    // Number of slices to create
    var numSlices = Math.abs(image.imageObj.height);

    // Height of each slice
    var sliceHeight = 1;

    // Skew factor
    var skewFactor = calculateSunAngle(sunX, sunY, image.imageData[level].x + (image.imageObj.width / 2), image.imageData[level].y);

    for ( var n = numSlices; n >= 0; n-- ) {

        // Source: Where to take the slice from
        var sx = 0,
            sy = sliceHeight * n,
            sWidth = image.imageObj.width,
            sHeight = sliceHeight;

        // Destination: where to draw the slice
        var dx = image.imageData[level].x + (n * skewFactor) - (image.imageObj.height * skewFactor),
            dy = image.imageData[level].y + image.imageObj.height + (image.imageObj.height - n - 1),
            dWidth = image.imageObj.width,
            dHeight = sliceHeight;

        context.drawImage(image.imageObj, sx, sy, sWidth, sHeight,
                            dx, dy, dWidth, dHeight);
    }
}

// Function to calculate the angle of the sun for shadow positioning
function calculateSunAngle(sunX, sunY, imageX, imageY) {
    dy = imageY - sunY;
    dx = imageX - sunX;

    theta = Math.atan2(dy, dx);
    // Theta = angle in degrees
    theta *= 180/Math.PI;

    // Convert the angle to a skew factor for the image slicer
    if ( theta < 90 ) {
        return -2 + (theta * .022222222);
    }
    else if ( theta > 90 ) {
        return -(-2 + ((theta - 90) * .022222222));
    }
    else {
        return 0;
    }
}

// Initial load
loadImages(sources, function() {
    drawLoadedImages("level1", 200, 0);
});
