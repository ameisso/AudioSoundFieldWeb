function SoundPoint(x, y, r, path) {
    this.x = x
    this.y = y;
    this.r = r;
    this.path = path;
    this.volume = 0;
    this.audio = loadSound(this.path);
}


SoundPoint.prototype.display = function () {
    stroke(255);
    circle(this.x, this.y, 5);
    noFill();
    circle(this.x, this.y, this.r * 2);
    noStroke();
    fill(200);
    text(this.path, this.x + 10, this.y - 10);
    text(this.volume.toFixed(1), this.x + 10, this.y - 20);
}


SoundPoint.prototype.update = function () {
    if (!this.audio.isPlaying() && this.distanceFromPlayer() < this.r) {
        this.audio.play();
    }
    else {
        this.volume = Math.min(Math.max(0, 0.2 * Math.log(this.r / this.distanceFromPlayer())),1.0);
        this.audio.setVolume(this.volume);
    }

    if (this.audio.isPlaying() && this.distanceFromPlayer() > this.r) {
        this.audio.stop();
    }
}


SoundPoint.prototype.distanceFromPlayer = function () {
    return dist(player.position.x, player.position.y, this.x, this.y);
}