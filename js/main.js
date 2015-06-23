// Load the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// videos
var videoIds = [
  'NXpPrQvQZ0w',
  'I5vi0ztZ4iY',
  'F-blKKLgljY',
  'sGFtYp33rvk',
  'qCpoj3Do2CI',
  'NXpPrQvQZ0w',
  'krP310op3jk',
  'eRLJscAlk1M',
  'vH4UdX2D5sY',
  'xr8MWVlofX8',
  'f7c4NUeA2cc',
  'JEgZACpXP3U',
  '7JOdPqdXZ8Y',
  'f_HkQ4-x4P4',
  'KEwFwYxcPh8',
  'DKuuguZAeO8',
  'i-Wc5E8Puuk',
  'yAMRXqQXemU',
  'O2vBJt1iG60',
  'IvveZr0D_9Y',
  '_39b8e5PXWw',
  'V7Ifyctb5DI',
  'efAqCmKZDDI',
  '178a3bl-2vU',
  'R706isyDrqI',
  'tVA9qLBViPc',
  'dTFDfR47dl4',
  'en4muUSIRT4',
  'MOXSKR7wM2U',
  'O5RdMvgk8b0',
  'Va1KBtI81TY'];

var player;
var noiseAudio;

function getRandomVideoId() {
  var randomIndex = Math.floor(Math.random() * videoIds.length);
  var randomId = videoIds[randomIndex];

  // remove video id from array
  videoIds.splice(randomIndex, 1);

  return randomId;
}

function onVideoFinished() {
  startNoise();
  var videoId = getRandomVideoId();
  createVideoPlayer(videoId);
}

var youTubeLoaded = false;
var assetsLoaded = false;

// on api ready
function onYouTubePlayerAPIReady() {
  youTubeLoaded = true;
  if (assetsLoaded)
    startupTelevision();
}

function startupTelevision() {
  document.getElementById('wrapper').style.display = 'block';
  document.getElementById('loading-gif').style.opacity = 0;
  setTimeout(function(){
    document.getElementById('wrapper').style.opacity = 1;
  }, 1);
}

// register click handler
var tvWrapper = document.getElementById('wrapper');
tvWrapper.onclick = function() {
  if (!loading)
    onVideoFinished();
}

var loading = false;

// create youtube player
function createVideoPlayer(videoId) {
  console.log('https://www.youtube.com/watch?v=' + videoId);
  // remove old player
  var videoContainer = document.getElementById('video-container');
  var playerElement = document.getElementById('player');
  videoContainer.removeChild(playerElement);

  // create new player element
  playerElement = document.createElement('div');
  playerElement.id = 'player'
  videoContainer.appendChild(playerElement);

  loading = true;

  // create new yt player
  player = new YT.Player('player', {
    height: '375',
    width: '505',
    videoId: videoId,
    playerVars: { autoplay: 1, iv_load_policy: 3, controls: 0, showinfo: 0 },
    events: {
      // 'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// when video ends
function onPlayerStateChange(event) {
  // console.log('onPlayerStateChange', event.data);
  if (event.data === 0) {
    onVideoFinished();
  }
  if (event.data === 1) {
    loading = false;
    stopNoise();
  }
}

function startNoise() {
  // show noise gif
  var noiseElement = document.getElementById('noise');
  noiseElement.style.display = 'block';

  // start noise audio
  noiseAudio.setVolume(30);
  noiseAudio.play({loops: 50});
}

function stopNoise() {
  var noiseElement = document.getElementById('noise');
  noiseElement.style.display = 'none';
  noiseAudio.pause()
}

// initialize the sound manager
soundManager.url = 'soundManager2/';
soundManager.flashVersion = 9;
soundManager.useHighPerformance = true; // reduces delays

// reduce the default 1 sec delay to 500 ms
soundManager.flashLoadTimeout = 500;

soundManager.onready(function() {

  // Create the loader and queue our 3 images. Images will not
  // begin downloading until we tell the loader to start.
  var loader = new PxLoader(),
      noise = loader.addImage('img/noise.gif'),
      overlay = loader.addImage('img/tv_overlay.png'),
      underlay = loader.addImage('img/tv_underlay.png');
  noiseAudio = loader.addSound('noise', 'audio/tv-noise.mp3');


  // callback that will be run once images are ready
  loader.addCompletionListener(function() {
    assetsLoaded = true;
    if (youTubeLoaded)
      startupTelevision();
  });

  // begin downloading images
  loader.start();
});
