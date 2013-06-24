/**************************************************************************
* SOUNDMANAGER CONFIG
***************************************************************************/
soundManager.useFlashBlock = false;
soundManager.bgColor = '#ffffff';
soundManager.debugMode = false;
soundManager.url = 'sound/soundmanager/swf/';
soundManager.wmode = 'transparent'; // hide initial flash of white on everything except firefox/win32
soundManager.allowScriptAccess = 'always';
soundManager.useFastPolling = true;
soundManager.flashVersion = 9;
soundManager.flashLoadTimeout = 3000;
soundManager.useHTML5Audio = true;
soundManager.debugFlash = false;

// -- when ready, preload sounds
soundManager.onready(function() {

	// -- Click
	soundManager.createSound({
		id: 'beat',
		url: 'sound/soundmanager/singlebeat.mp3',
		autoLoad: true,
		autoPlay: false,
		multiShot: false,
		volume: 100
	});
	soundManager.createSound({
		id: 'beat2',
		url: 'sound/soundmanager/singlebeat-fast.mp3',
		autoLoad: true,
		autoPlay: false,
		multiShot: false,
		volume: 100
	});
});
 
soundManager.ontimeout(function() {
    var smLoadFailWarning = 'Oh snap! : ' + (soundManager.hasHTML5 ? 'The flash portion of ' : '') + 'SoundManager 2 was unable to start. ';
    _log(smLoadFailWarning) ;
});