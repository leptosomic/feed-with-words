class Monster {
    constructor(view, audioSources) {
        view.monster = this;
        view.className = 'normal';
        this.animQueue = null;
        this.view = view;
        this.audioSources = audioSources;
        this.audio = document.createElement('audio');
        document.body.appendChild(this.audio);
        this.delayTimer = null;
        view.addEventListener('animationend', this.onAnimationEnd.bind(this));
        this.playDelayed('hello', Math.random()*2000);
    }

    onAnimationEnd() {
        if(this.animQueue.length) {
            let animName = this.animQueue.shift();
            if(animName.push) {// если анимация - массив, то второй элемент - это звук
                this.audio.src = this.audioSources[animName[1]];
                this.audio.currentTime = 0;
                this.audio.play();
                animName = animName[0];
            }
            if(animName === 'normal') {//обычное поведение прерывается случайными действиями
                this.playDelayedRandom();
            }
            this.view.className = animName;
        }
    }

    play(animations) {
        clearTimeout(this.delayTimer);
        if(animations.push) {
            this.animQueue = animations;
        }
        else {
            this.animQueue = [animations];
        }
        this.view.dispatchEvent(new Event("animationend"));
    }

    playGetNormal(animations) {
        if(animations.push) {
            animations.push('normal');
        }
        else {
            animations = [animations, 'normal'];
        }
        this.play(animations);
    }

    playDelayed(animName, delay) {
        clearTimeout(this.delayTimer);
        this.delayTimer = setTimeout(this.playGetNormal.bind(this, animName), delay);
    }

    playDelayedRandom() {
        this.playDelayed(['hello', 'asking', 'impatient'][Math.floor(Math.random() * 3)], 15000+Math.random()*15000);
    }

    doFail() {
        this.play(['closeWide', 'closeMouth', ['fail', 'monster_sad']]);
        this.playDelayedRandom();
    }

    doEat() {
        this.playGetNormal([['closeWide', 'monster_chewing'], 'closeMouth', 'chewing']);
    }

    doOpenWide() {
        this.play('openWide');
    }

    doCloseWide() {
        this.play('closeWide');
    }

    doOpenMouth() {
        this.play([['openMouth', 'monster_open']]);
    }

    doCloseMouth() {
        this.playGetNormal([['closeMouth', 'monster_close'], 'disappointed']);
    }
}