function SoundPoint(x, y, r, path, imagePath) {
    this.x = x
    this.y = y;
    this.r = r;
    this.path = path;
    this.imagePath = imagePath;
    this.volume = 0;
    this.debugSprite = new Sprite(this.x, this.y, this.r, 'none');
    let c = color('azure');
    c.setAlpha(100);
    this.debugSprite.color = c
    this.debugSprite.strokeWeight = 5/camera.zoom;
    this.debugSprite.stroke = 'azure'
    this.debugSprite.text = this.path;
}


SoundPoint.prototype.display = function () {
    if (debug) {
        this.debugSprite.visible = true;
        this.debugSprite.draw();
    }
    else if (this.imagePath) {
        if (this.image) {
            image(this.image, this.x - this.image.width / 2, this.y - this.image.height / 2);
        }
        this.debugSprite.visible = false;
    }
    else {
        this.debugSprite.visible = false;
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