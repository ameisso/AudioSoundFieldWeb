function Soundline(height, path) {
  this.height = height
  this.path = path;
  this.hasPlayed = false;
}


Soundline.prototype.display = function () {
  if (debug) {
    stroke(255);
    line(-width, this.height, SCENE_W + width, this.height);
    noStroke();
    fill(200);
    text(this.path, player.position.x - textWidth(this.path) / 2, this.height - 12);
  }
}


Soundline.prototype.update = function () {
  if (this.distanceFromPlayer() < preloadDistance) {
    if (!this.audio) {
      this.audio = loadSound(this.path);
      this.audio.setLoop(false);
    }
  }
  if (this.audio) {
    if (!this.audio.isPlaying() && player.position.y > this.height && !this.hasPlayed) {
      this.audio.play();
      this.hasPlayed = true;
    }
  }
}

Soundline.prototype.distanceFromPlayer = function () {
  return dist(player.position.x, player.position.y, SCENE_W / 2, this.height);
}