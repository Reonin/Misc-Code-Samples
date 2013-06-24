var tylted = document;

function parseDevice(obj) {
    var device, retObj = {};

    //for retina screens showing under 800 pixels without multiplier.
    if (!window.devicePixelRatio) {
        window.devicePixelRatio = 1;
    }
    //set real device screen width
    tylted.deviceWidth = document.documentElement.clientWidth * window.devicePixelRatio;
	tylted.screenWidth = document.documentElement.clientWidth;
    

//	switch (true) {
//        //remove instances of mobile from object
//        case (tylted.deviceWidth >= 768):
//            device = "mobile";
//            break;
//        //remove instances of desktop from object
//        case (tylted.deviceWidth < 768):
//            device = "desktop";
//            break;
//          }


	if (strSiteView == "mobile") {
		device = "desktop";
		  }
	else if (strSiteView == "desktop") {

	device = "mobile";
		  }

    //iterate over to remove instances of device
    $.each(obj, function (dex, val) {
        if (dex.indexOf(device) != -1) {
            delete obj[dex];
        }

    });

    return obj;
}

function is_mobile() {
    //for retina screens showing under 800 pixels without multiplier.
    if (!window.devicePixelRatio) {
        window.devicePixelRatio = 1;
    }
    //set real device screen width
    tylted.deviceWidth = document.documentElement.clientWidth * window.devicePixelRatio;

    switch (true) {
        //remove instances of mobile from object
        case (tylted.deviceWidth > 768):
            return false;
            break;
        //remove instances of desktop from object
        case (tylted.deviceWidth < 768):
            return true;
            break;
    }
         }
         var keepItOpen = false;




         var tempScrollTop;
       

function leftNavOpen() {
	keepItOpen = true;
	tempScrollTop = $(window).scrollTop();
    window.scrollTo(1, 1);
 //  	$('.ty-topnav-right').hide(); //Because they overlap
	$('.ty-topnav-left').show();
	//$('.ty-topnav-left').zIndex = 1000;
	
	$('.topnav-fixed').animate({
		left : "265px"
	}, {
		duration : 00,
		queue : false
	});
	$('#tylted_inner').animate({
		left : "265px"
	}, {
		duration : 00,
		queue : false
	});
//	$('#tylted_inner').fadeTo(300, 0.4);
	$('#tylted_inner').css('position', 'fixed');
	$('#tylted_inner').click(function() {
	    $('#primary-nav-close').click();
	    return false;
	});
	$('#primary-nav').hide();
	$('#primary-nav-close').show();

}


function leftNavClose() {
	keepItOpen = false;
	window.scrollTo(1, tempScrollTop);
	//$(window).scrollTop(tempScrollTop);
	$('.topnav-fixed').animate({
		left : "0px"
	}, {
		duration : 000,
		queue : false
	});
	$('#tylted_inner').animate({
		left : "0px"
	}, {
		duration : 00,
		queue : false
	});
//	$('#tylted_inner').css('opacity', '1');
	$('#tylted_inner').css('position', 'relative');
	$('#tylted_inner').unbind('click');
	$('#primary-nav').show();
	$('#primary-nav-close').hide();
	//	$('.ty-topnav-right').show(); //Because they overlap
	$('.ty-topnav-left').hide(500);

}



function rightNavOpen() {
	keepItOpen = true;
	tempScrollTop = $(window).scrollTop();
    window.scrollTo(1, 1);
  //  $('.ty-topnav-left').hide(); //Because they overlap
    $('.ty-topnav-right').show();
    //$('.ty-topnav-right').show();

	$('.topnav-fixed').animate({
		left : "-265px"
	}, {
		duration : 00,
		queue : false
	});
	$('#tylted_inner').animate({
		left : "-265px"
	}, {
		duration : 00,
		queue : false
	});
	//$('#tylted_inner').fadeTo(300, 0.4);
	$('#tylted_inner').css('position', 'fixed');
	$('#tylted_inner').click(function () {
	    $('#secondary-nav-close').click();
	    return false;
	});
	$('#secondary-nav').hide();
	$('#secondary-nav-close').show();

}


function rightNavClose() {
	keepItOpen = false;
	window.scrollTo(1, tempScrollTop);
	//$(window).scrollTop(tempScrollTop);
	$('.topnav-fixed').animate({
		left : "0px"
	}, {
		duration : 00,
		queue : false
	});
	$('#tylted_inner').animate({
		left : "0px"
	}, {
	    duration: 00,
		queue : false
	});
//	$('.ty-topnav-right').hide();
//	$('#tylted_inner').fadeTo(300, 1);
	$('#tylted_inner').css('position', 'relative');
	$('#tylted_inner').unbind('click');
	$('#secondary-nav').show();
	$('#secondary-nav-close').hide();
//	$('.ty-topnav-left').show(); //Because they overlap
	$('.ty-topnav-right').hide(500);
}

function IphoneNoZoom() {

	(function (doc) {
		
		var addEvent = 'addEventListener',
	    type = 'gesturestart',
	    qsa = 'querySelectorAll',
	    scales = [1, 1],
	    meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];

		function fix() {
			meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
			doc.removeEventListener(type, fix, true);
		}

		if ((meta = meta[meta.length - 1]) && addEvent in doc) {
			fix();
			scales = [.25, 1.6];
			doc[addEvent](type, fix, true);
		}

	} (document));

}


//navigation animation
$(function () {
    if (!window.devicePixelRatio) {
        window.devicePixelRatio = 1;
    }
    //alert(tylted.screenWidth);
    //set real device screen width
    tylted.deviceWidth = document.documentElement.clientWidth * window.devicePixelRatio;
    $('#ty-nav-menu').height()
    $('#ty-nav-menu').height($('#tylted_outer').height());
    $('#ty-navigation-secondary-mobile').height($('#tylted_outer').height());
    $('#primary-nav').click(
        function () {
            leftNavOpen();
        });
    $('#primary-nav-close').click(
    function () {
        leftNavClose();
    });

    if (strSiteView == "mobile") {

        $('#secondary-nav').click(function () {

            rightNavOpen()
        });
        $('#secondary-nav-close').click(function () {
            rightNavClose()
        });
    } else {
        $('#secondary-nav').toggle(function () {

            var bodyPadd = $('headernav').position().left;
            $('.ty-topnav-right').show();
            $('#ty-navigation-secondary').css('margin-right', bodyPadd);
            $('#ty-navigation-secondary').css('top', $('headernav').position().top + 50);
            $('#ty-navigation-secondary').slideDown();
        },
		function () {
		    $('#ty-navigation-secondary').slideUp(); ;
		});
    }



		 })

		var paddT; 
		 //alert($('#tylted_inner').css('padding-top')); 
		 detectOrientation();
		 window.onorientationchange = detectOrientation;
		 function detectOrientation() {
		 	
		 	if (typeof window.onorientationchange != 'undefined') {
		 		if (screen.width >= 768) { }

		 		else {
		 			if (orientation == 0) {
		 				//IphoneNoZoom();
		 				$('#lightboxAD').css('top', "100px");
		 	
		 				if (keepItOpen == true) {

		 				}
		 				else {
		 					$('#tylted_inner').css('padding-top', paddT);
		 					$('.topnav-fixed').slideDown();
		 					rightNavClose();
		 					leftNavClose();
		 				}
		 			}
		 			else if (orientation == 90) {
		 			//	IphoneNoZoom();

		 				$('#lightboxAD').css('top', "0px");

		 				

		 				if (keepItOpen == true) {
		 				
		 				}
		 				else {
		 					paddT = document.getElementById("tylted_inner").style.paddingTop;
		 					$('.topnav-fixed').slideUp();
		 					$('#tylted_inner').css('padding-top', "0px");

		 					rightNavClose();
		 					leftNavClose();
		 				}
		 			}
		 			else if (orientation == -90) {
		 				//	IphoneNoZoom();

		 				

		 				$('#lightboxAD').css('top', "0px");
		 		
		 				if (keepItOpen == true) {

		 				}
		 				else {
		 					paddT = document.getElementById("tylted_inner").style.paddingTop;
		 					$('.topnav-fixed').slideUp();
		 					//$('#tylted_inner').css('top', $('headernav').position().top - 40);
		 					$('#tylted_inner').css('padding-top', "0px");
		 					rightNavClose();
		 					leftNavClose();
		 				}
		 			}
		 			else if (orientation == 180) {
		 				//IphoneNoZoom();
		 				$('#lightboxAD').css('top', "100px");
		 				
		 				if (keepItOpen == true) {

		 				}
		 				else {
		 					$('#tylted_inner').css('padding-top', paddT);
		 					$('.topnav-fixed').slideDown();
		 					rightNavClose();
		 					leftNavClose();
		 				}
		 			}
		 		}
		 	}
		 }