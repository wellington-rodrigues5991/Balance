import GameObject from '../config/gameObject';

export const Player = new GameObject({
    preload(){
        this.load.spritesheet('player', window.Data.player.image, {frameWidth: window.Data.player.frame.width, frameHeight: window.Data.player.frame.widthheight});
    },    
    create(){
        this.player = this.matter.add.sprite(window.innerHeight * .5, window.innerHeight * -1, 'player');
        this.player.depth = 10;
        this.resizePlayer();

        const keys = Object.keys(window.Data.player.animation);
        for(let i = 0; i < keys.length; i++){
            const target = window.Data.player.animation[keys[i]];
            this.anims.create({
                key: 'player-'+keys[i],
                frames: this.anims.generateFrameNumbers('player', { start: target.start, end: target.end }),
                frameRate: target.frameRate,
                repeat: target.repeat
            });
        }

        this.player.play('player-idl')
        this.player.on("animationcomplete", event => {
            if(event.key != 'player-idl') this.player.anims.play('player-idl')
        })

        window.addEventListener('resize', function(){this.resizePlayer()}.bind(this))
        this.player.config = {
            lifes: {max: window.Data.lifes, actual: window.Data.lifes},
            invensible: false,
            start: {x: this.player.x, y: this.player.y},
            time: window.Data.invincibilityTime
        };
    },
    update(){
        if(!(this.player.rotation < 0.5 && this.player.rotation > -0.5 )) this.player.rotation = Math.min(Math.max(this.player.rotation, -0.5), 0.5)
        this.player.body.speed = 0;
        if(
            this.player.y > window.innerHeight*2 ||
            this.player.config.lifes.actual <= 0
        ){
            if(window.Data.play == true){
                window.Data.play = false;
            }
            this.player.rotation = 0;
            this.matter.body.setStatic(this.player.body, true);
            this.matter.body.setPosition(this.player.body, {x: this.player.config.start.x, y: window.innerHeight * -1});
            setTimeout(() => {
                this.matter.body.setStatic(this.player.body, false)
            }, 200);
            this.player.config.lifes.actual = this.player.config.lifes.max;
        }

        if(window.Data.play == false && this.player.anims.currentAnim.key != 'player-die'){
            this.player.play('player-die');
            this.player.x = window.innerWidth/2;
            this.pool.speed = 0;
        }

        if(window.Data.play == true && this.player.anims.currentAnim.key == 'player-die'){
            this.player.play('player-idl');
            this.player.x = window.innerWidth/2;
            window.bonus = 0;
            this.pool.speed = 0;
        }
    },
    resizePlayer(){        
        const oldSizePlayer = {x: this.player.displayWidth, y: this.player.displayHeight};

        this.player.displayWidth = window.Grid.value;
        this.player.displayHeight = (oldSizePlayer.y/oldSizePlayer.x) * window.Grid.value;

        this.player.x = window.innerWidth/2;
        this.player.y = (window.innerHeight * .7) - this.player.displayHeight;
    }
})