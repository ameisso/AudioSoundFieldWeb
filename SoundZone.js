function SoundZone(h1, h2, path) {
    this.h1 = h1;
    this.h2 = h2;
    this.path = path;
    this.audio = loadSound(this.path);
    this.fadeZone = (this.h2 - this.h1) / 4
    this.volume = 0;
}

SoundZone.prototype.display = function () {
    if (debug) {
        stroke(255);
        line(-width, this.h1, SCENE_W + width, this.h1);
        line(-width, this.h1 + this.fadeZone, SCENE_W + width, this.h1 + this.fadeZone);
        line(-width, this.h2, SCENE_W + width, this.h2);
        line(-width, this.h2 - this.fadeZone, SCENE_W + width, this.h2 - this.fadeZone);
        fill(255, 40);
        rect(-width, this.h1, SCENE_W + 2 * width, this.h2 - this.h1);
        noStroke();
        fill(200);
        text(this.path, player.position.x - textWidth(this.path) / 2, this.height - 12);
    }
}

SoundZone.prototype.update = function () {

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

    if (this.audio) {
        if (!this.audio.isPlaying() && player.position.y > this.h1 && player.position.y < this.h2) {
            this.audio.play();
        }
        if (this.audio.isPlaying() && player.position.y > this.h2 || this.audio.isPlaying() && player.position.y < this.h1) {
            this.audio.pause();
        }
        if (player.position.y > this.h1 && player.position.y < this.h1 + this.fadeZone) {
            let dist = abs(this.fadeZone - (player.position.y - this.h1 + this.fadeZone));
            this.volume = Math.min(Math.max(0, 1 - 0.2 * Math.log(this.fadeZone / dist)), 0.9);
            this.audio.setVolume(this.volume);
        }
        if (player.position.y > this.h2 - this.fadeZone && player.position.y < this.h2) {
            let dist = abs(this.h2 - player.position.y);
            this.volume = Math.min(Math.max(0, 1 - 0.2 * Math.log(this.fadeZone / dist)), 0.9);
            this.audio.setVolume(this.volume);
        }
    }
}


SoundZone.prototype.distanceFromPlayer = function () {
    return dist(player.position.x, player.position.y, SCENE_W / 2, this.h1);
}