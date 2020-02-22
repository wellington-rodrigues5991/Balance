import GameObject from '../config/gameObject';

export const Sounds = new GameObject({
    preload(){
        if(this.checkSound('background')) this.load.audio('bacKground', window.Data.sound.background, {instances: 1, volume: 0.1});
        if(this.checkSound('die')) this.load.audio('die', window.Data.sound.die, {instances: 1});
        if(this.checkSound('lifewin')) this.load.audio('lifewin', window.Data.sound.lifewin, {instances: 1, volume: 0.1});
        if(this.checkSound('lifelose')) this.load.audio('lifelose', window.Data.sound.lifelose, {instances: 1});
        if(this.checkSound('win')) this.load.audio('win', window.Data.sound.win, {instances: 1, volume: 0.1});
        if(this.checkSound('lose')) this.load.audio('lose', window.Data.sound.lose, {instances: 1});
        this.load.image('sound-on', window.Data.sounds.on);
        this.load.image('sound-off', window.Data.sounds.off);
    },
    create(){
        if(this.checkSound('background')) this.sound.add('bacKground');
        if(this.checkSound('die')) this.sound.add('die');
        if(this.checkSound('lifewin')) this.sound.add('lifewin');
        if(this.checkSound('lifelose')) this.sound.add('lifelose');
        if(this.checkSound('win')) this.sound.add('win');
        if(this.checkSound('lose')) this.sound.add('lose');

        this.music = {
            status: true,
            on: this.add.sprite(0, 0, 'sound-on'),
            off: this.add.sprite(0, 0, 'sound-off')
        }
        this.music.on.depth = 20;
        this.music.on.setInteractive();
        this.music.on.on('pointerup', () => {
            this.music.status = false;
            this.playSound();
        });

        this.music.off.depth = 20;
        this.music.off.setInteractive();
        this.music.off.on('pointerup', () => {
            this.music.status = true;
            this.playSound();
        });
    },
    update(){
        if(this.music.status){
            this.music.on.displayHeight = (this.music.on.displayHeight/this.music.on.displayWidth) * (window.Grid.value * 1);
            this.music.on.displayWidth = window.Grid.value * 1;
            this.music.on.x = window.innerWidth - (window.Grid.value * .5) - 15;
            this.music.on.y = ((this.music.on.displayHeight/this.music.on.displayWidth) * (window.Grid.value * .5)) + 15;
            this.music.off.x = window.innerWidth * -1;
        }
        if(!this.music.status){
            this.music.off.displayHeight = (this.music.off.displayHeight/this.music.off.displayWidth) * (window.Grid.value * 1);
            this.music.off.displayWidth = window.Grid.value * 1;
            this.music.off.x = window.innerWidth - (window.Grid.value * .5) - 15;
            this.music.off.y = ((this.music.off.displayHeight/this.music.off.displayWidth) * (window.Grid.value * .5)) + 15;
            this.music.on.x = window.innerWidth * -1;
        }        
    },
    checkSound(key){
        let r = false;

        if(window.Data.sound[key] != undefined) r = true;
        return r
    },
    getSound(key){
        let e = 0;

        for(let i = 0; i < this.sound.sounds.length; i++){
            if(this.sound.sounds[i].key == key) e = i;
        }

        return e;
    },
    playSound(){
        if(window.Data.play == false){
            if(this.checkSound('die') && this.music.status == true) this.sound.play('die', { loop: -1 });
            if(this.checkSound('background') && this.music.status == true) this.sound.sounds[this.getSound('bacKground')].stop();
        }
        if(window.Data.play == true){
            if(this.checkSound('background') && this.music.status == true) this.sound.play('bacKground', { loop: -1 });
            if(this.checkSound('die') && this.music.status == true) this.sound.sounds[this.getSound('die')].stop();
        }
        if(this.music.status == false){
            this.sound.sounds[this.getSound('bacKground')].stop();
            this.sound.sounds[this.getSound('die')].stop();
        }
    }
})