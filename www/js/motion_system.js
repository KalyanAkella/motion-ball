function MotionSystem(_video, _canvasSource, _motionCallback) {
  var video = _video;
  var canvasSource = _canvasSource;
  var contextSource = canvasSource.getContext('2d');
  var lastImageData = null;
  var previousWhiteArea = null;
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
      if (!lastImageData) lastImageData = contextSource.getImageData(0, 0, width, height);
      var diffs = differenceThreshold(sourceData.data, lastImageData.data);
      lastImageData = sourceData;
      return diffs;
    }

    function fastAbs(value) {
      // equivalent to Math.abs();
      return (value ^ (value >> 31)) - (value >> 31);
    }

    function threshold(value) {
      return (value > 21) ? 0xFF : 0;
    }

    function differenceThreshold(data1, data2) {
      if (data1.length != data2.length) return null;
      var i = 0;
      var target = [];
      while (i < (data1.length * 0.25)) {
        var index = 4 * i++;
        var average1 = (data1[index] + data1[index+1] + data1[index+2]) / 3;
        var average2 = (data2[index] + data2[index+1] + data2[index+2]) / 3;
        var diff = threshold(fastAbs(average1 - average2));
        target.push(diff);
      }
      return target;
    }

    function check(blendData) {
      var width = canvasSource.width;
      var height = canvasSource.height;
      var whiteArea = 0, i = 0;
      var limit = blendData.length;
      while (i < limit) {
        whiteArea += blendData[i++] & 1;
      }
      // TODO: construct the motion object - perhaps a convex hull ?
      var motion = {};
      motionCallback(motion);
      previousWhiteArea = whiteArea;
    }

    function update() {
      drawVideo();
      check(blend());
      setTimeout(update, 1000/60);
    }

    update();
  };
}
