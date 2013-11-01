function initialise() {
  var webcamError = function (e) { alert('Webcam error!', e); };
  var video = $('#webcam')[0];
  if (navigator.getUserMedia) {
    navigator.getUserMedia({audio: false, video: true}, function(stream) {
      video.src = stream;
      video.muted = 'muted';
    }, webcamError);
  } else if (navigator.webkitGetUserMedia) {
      navigator.webkitGetUserMedia({audio: false, video: true}, function(stream) {
        video.src = window.webkitURL.createObjectURL(stream);
        video.muted = 'muted';
    }, webcamError);
  } else {
    //video.src = 'video.webm'; // fallback.
  }

  var canvasSource = $("#canvas-source")[0];
  var motionSystem = new MotionSystem(video, canvasSource, motionCallback);
  motionSystem.start();
}

function motionCallback(motion) {
}
