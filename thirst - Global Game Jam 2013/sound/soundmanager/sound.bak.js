/**************************************************************************
* SOUNDMANAGER CONFIG
***************************************************************************/
soundManager.useFlashBlock = false;
soundManager.bgColor = '#ffffff';
soundManager.debugMode = true;
soundManager.url = 'sound/soundmanager/swf/';
soundManager.wmode = 'transparent'; // hide initial flash of white on everything except firefox/win32
soundManager.allowScriptAccess = 'always';
soundManager.useFastPolling = true;
soundManager.flashVersion = 9;
soundManager.flashLoadTimeout = 3000;
soundManager.useHTML5Audio = true;
 soundManager.debugFlash = true ;
// -- when ready, preload sounds
soundManager.onready(function() {
 
    // -- Click
    soundManager.createSound({
      id: 'beat1',
      url: 'sound/soundmanager/beat1.mp3',
      autoLoad: true,
      autoPlay: false,
      multiShot: false,
      volume: 40
    });
 
    // ...

    // -- Mad Cow
    soundManager.createSound({
      id: 'beat2',
      url: 'sound/soundmanager/beat2.mp3',
      autoLoad: true,
      autoPlay: false,
      volume: 60
    });

	soundManager.createSound({
      id: 'beat3',
      url: 'sound/soundmanager/beat3.mp3',
      autoLoad: true,
      autoPlay: false,
      volume: 80
    });
	
	
	
});
 
soundManager.ontimeout(function() {
    var smLoadFailWarning = 'Oh snap! : ' + (soundManager.hasHTML5 ? 'The flash portion of ' : '') + 'SoundManager 2 was unable to start. ';
    _log(smLoadFailWarning) ;
});