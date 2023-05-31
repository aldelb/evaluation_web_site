
function VideoVisualizer(_parent, _conditions, _audio) {
  this.parent = _parent;
  this.audio = _audio;
  this.eventListeners = [];
  this.currentVideo = null;
  this.currentVideoIndex = null;

  this.conditions = _conditions;
  var mainDiv = $('<div id="main-video-frame"></div');

  var _videoElements = [];
  var _players = []

  this.videoPlaceholder = $(
    '<div id="video-placeholder">When you press play on one of the buttons below, a video will appear here</div>'
  );
  mainDiv.append(this.videoPlaceholder);
  var self = this;
  this.conditions.forEach(function (condition, i) {
    videoElement = $('<div id="video_player_'+i+'" class="video-element" style="display: none;"></div>').get(0);

    videoElement.style.border = "5px solid " + condition.color;
    mainDiv.append(videoElement);
    _videoElements.push(videoElement);

    playerHtml = $('<video id="'+condition.getId()+'" class="video-js"> <source src="'+condition.getFilepath()+'"> </video>').get(0);

    videoElement.append(playerHtml);
  });
  this.videoElements = _videoElements;

  this.parent.append(mainDiv);

  this.conditions.forEach(function (condition, i) {
    if(_audio){
      var player = videojs(condition.getId(), {
        
        controls: true,
        autoplay: false,
        preload: 'auto',
        muted: !(_audio),
        controlBar: {
          children: {
            volumePanel: _audio,
            volumeMenuButton: _audio,
            audioTrackButton: _audio,
            progressControl: true,
            durationDisplay: true,
            remainingTimeDisplay: true
          }
        }
      });

    }else{
      var player = videojs(condition.getId(), {
        controls: true,
        autoplay: false,
        preload: 'auto',
        muted: !(_audio),
        controlBar: {
          children: {
            progressControl: true,
            durationDisplay: true,
            remainingTimeDisplay: true
          }
        }
      });
    }
    
    
    player.on("pause", function(e) {
      self.sendEvent({
        name: "pauseTriggered",
        index: self.currentVideoIndex,
        conditionLength: self.conditions.length,
        seconds: e.seconds
      });
    })

    player.on("play", function(e) {
      var event = {
        name: "playConditionTriggered",
        index: self.currentVideoIndex,
        length: self.conditions.length,
        seconds: e.seconds
      };
      self.sendEvent(event);
    })

    _players.push(player)
    
  });

  this.players = _players
}

VideoVisualizer.prototype.playCondition = function (_index) {
  _players = this.players
  this.videoPlaceholder.get(0).style.display = "none";
  this.videoElements.forEach(function (videoElement, i) {
    if (i == _index) {
      videoElement.style.display = "block";
      _players.at(i).play()
    } else {
      _players.at(i).pause()
      videoElement.style.display = "none";
    }
  });
  this.currentVideo = this.videoElements[_index];
  this.currentVideoIndex = _index;

  this.players.at(this.currentVideoIndex).play();

  return;
};

VideoVisualizer.prototype.pause = function () {
  this.players.at(this.currentVideoIndex).pause();
  return;
};

VideoVisualizer.prototype.reload = function () {
  if (this.currentVideo) {
    this.players.at(this.currentVideoIndex).play();
  }
  return;
};

VideoVisualizer.prototype.getConditions = function () {
  return this.conditions;
};

VideoVisualizer.prototype.removeEventListener = function (_index) {
  this.eventListeners[_index] = null;
};

VideoVisualizer.prototype.addEventListener = function (_listenerFunction) {
  this.eventListeners[this.eventListeners.length] = _listenerFunction;
  return this.eventListeners.length - 1;
};

VideoVisualizer.prototype.sendEvent = function (_event) {
  for (var i = 0; i < this.eventListeners.length; ++i) {
    if (this.eventListeners[i] === null) {
      continue;
    }
    this.eventListeners[i](_event);
  }
};