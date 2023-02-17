function SoundPoint(x, y, r, path, imagePath) {
    this.x = x
    this.y = y;
    this.r = r;
    this.path = path;
    this.imagePath = imagePath;
    this.volume = 0;
}


SoundPoint.prototype.display = function () {
    if (debug) {
        stroke(255);
        circle(this.x, this.y, 5);
        noFill();
        circle(this.x, this.y, this.r * 2);
        noStroke();
        fill(200);
        text(this.path, this.x + 10, this.y - 10);
        text(this.volume.toFixed(1), this.x + 10, this.y - 20);
    }
    else if (this.imagePath) {
        if (this.image) {
            image(this.image, this.x - this.image.width / 2, this.y - this.image.height / 2);
        }
    }
}


SoundPoint.prototype.update = function () {

    // LOAD IF NEEDED 
    if (this.distanceFromPlayer() < preloadDistance) {
        if (!this.audio) {
            this.audio = loadSound(this.path);
        }
        if (!this.image) {
            if (this.imagePath) {
                this.image = loadImage(this.imagePath)
            }
        }
    }

    // PLAY if NEEDED
    if (this.audio && this.audio.isLoaded()) {
        if (!this.audio.isPlaying() && this.distanceFromPlayer() < this.r) {
            this.audio.play();
        }
        else {
            this.volume = Math.min(Math.max(0, 0.2 * Math.log(this.r / this.distanceFromPlayer())), 0.9);
            this.audio.setVolume(this.volume);
        }

        if (this.audio.isPlaying() && this.distanceFromPlayer() > this.r) {
            this.audio.stop();
        }
    }
}


SoundPoint.prototype.distanceFromPlayer = function () {
    return dist(player.position.x, player.position.y, this.x, this.y);
}