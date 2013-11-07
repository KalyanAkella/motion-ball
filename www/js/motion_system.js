function MotionSystem(_video, _canvasSource, _motionCallback) {
  var video = _video;
  var canvasSource = _canvasSource;
  var contextSource = canvasSource.getContext('2d');
  var prevImageData = null;
  var motionCallback = _motionCallback;
  contextSource.translate(canvasSource.width, 0);
  contextSource.scale(-1, 1);

  this.start = function () {
    function drawVideo() {
      contextSource.drawImage(video, 0, 0, video.width, video.height);
    }

    function blend() {
      var width = canvasSource.width;
      var height = canvasSource.height;
      var sourceData = contextSource.getImageData(0, 0, width, height);
      if (!prevImageData) prevImageData = contextSource.getImageData(0, 0, width, height);
      var diffs = diffPixels(sourceData.data, prevImageData.data);
      prevImageData = sourceData;
      return diffs;
    }

    function check(blendData) {
      // TODO: construct the motion object - perhaps a convex hull, bounded rectangle ?
      var numPoints = blendData.length;
      if (numPoints > 100) {
        var motion = {'data': blendData};
        motionCallback(motion);
      }
    }

    function fastAbs(value) {
      // equivalent to Math.abs();
      return (value ^ (value >> 31)) - (value >> 31);
    }

    function diffPixels(data1, data2) {
      if (data1.length != data2.length) return null;
      var i = 0, limit = data1.length * 0.25;
      var target = [];
      var width = canvasSource.width;
      while (i < limit) {
        var index = 4 * i++;
        var average1 = (data1[index] + data1[index+1] + data1[index+2]) / 3;
        var average2 = (data2[index] + data2[index+1] + data2[index+2]) / 3;
        var diff = fastAbs(average1 - average2);
        if (diff > 21) {
          var point = new Point(i % width, Math.ceil(i / width));
          target.push(point);
        }
      }
      return target;
    }

    function update() {
      drawVideo();
      check(blend());
      setTimeout(update, 1000/60);
    }

    update();
  };
}

function Point(x, y) {
  this.x = x;
  this.y = y;
}
