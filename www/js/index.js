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
  var motionBallSource = $("#motion-ball")[0];
  var motionBallContext = motionBallSource.getContext('2d');
  var points = motion.data;

  if (points.length == 0) return;
  motionBallContext.clearRect(0, 0, motionBallSource.width, motionBallSource.height);
  motionBallContext.beginPath();
  motionBallContext.lineWidth = "2";
  motionBallContext.strokeStyle = "red";
  motionBallContext.moveTo(points[0].x, points[0].y);
  for (var i = 1; i < points.length; i++) {
    var point = points[i];
    motionBallContext.lineTo(point.x, point.y);
  }
  motionBallContext.stroke();
}
