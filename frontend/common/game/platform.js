import GameObject from '../config/gameObject';

export const Platform = new GameObject({
    preload(){
        this.load.spritesheet('platform', window.Data.platform.image, { frameWidth: window.Data.platform.frame.width, frameHeight: window.Data.platform.frame.widthheight } );
        if(window.Data.platformForeGround != '') this.load.spritesheet('platformForeground', window.Data.platformForeGround.image, { frameWidth: window.Data.platformForeGround.frame.width, frameHeight: window.Data.platformForeGround.frame.widthheight } );        
        if(window.Data.platformBackGround != '') this.load.spritesheet('platformBackground', window.Data.platformBackGround.image, { frameWidth: window.Data.platformBackGround.frame.width, frameHeight: window.Data.platformBackGround.frame.widthheight } );
    },    
    create(){
        this.platform = this.matter.add.sprite(window.innerWidth * .5, window.innerHeight, 'platform', 0);
        this.anims.create({
            key: 'idl-plaform',
            frames: this.anims.generateFrameNumbers('platform', { start: window.Data.platform.animation.start, end: window.Data.platform.animation.end }),
            frameRate: window.Data.platform.animation.frameRate,
            repeat: -1
        });
        this.resisePlatform('platform');
        this.platform.body.allowGravity = false;
        this.platform.body.ignoreGravity = true;
        this.platform.body.isStatic = true;

        if(this.load.textureManager.list.platformBackground != undefined){
            this.platformBackground = this.add.sprite(window.innerWidth * .5, window.innerHeight, 'platformBackground');
            this.anims.create({
                key: 'idl-platformBackGround',
                frames: this.anims.generateFrameNumbers('platformBackground', { start: window.Data.platformBackGround.animation.start, end: window.Data.platformBackGround.animation.end }),
                frameRate: window.Data.platformBackGround.animation.frameRate,
                repeat: -1
            });
            this.resisePlatform('platformBackground');
        }

        if(this.load.textureManager.list.platformForeground != undefined){
            this.platformForeground = this.add.sprite(window.innerWidth * .5, window.innerHeight, 'platformForeground');
            this.anims.create({
                key: 'idl-platformForeground',
                frames: this.anims.generateFrameNumbers('platformForeground', { start: window.Data.platformForeGround.animation.start, end: window.Data.platformForeGround.animation.end }),
                frameRate: window.Data.platformForeGround.animation.frameRate,
                repeat: -1
            });
            this.resisePlatform('platformForeground');
            this.platformForeground.depth = 20;
        }
        this.platform.depth = 10;

        this.left = {active: false, value: 0};
        this.config = {play: false, die: true}
        this.right = {active: false, value: 0};
        this.input.keyboard.on('keydown-Q', () => { this.left.active = true });
        this.input.keyboard.on('keydown-E', () => { this.right.active = true});
        this.input.keyboard.on('keyup-Q', () => { this.left.active = false});
        this.input.keyboard.on('keyup-E', () => { this.right.active = false});
        this.input.on('pointerdown', (pointer, e) => {            
            if(e.length == 0){         
                if(window.Data.play == true || window.Data.play == 'tutorial'){
                    if(pointer.x > window.innerWidth/2) this.right.active = true;
                    else this.left.active = true;
                }
            }
         });
         this.input.on('pointerup', (pointer, e) => {
             if(e.length == 0){
                if(window.Data.play == true || window.Data.play == 'tutorial'){
                    if(pointer.x > window.innerWidth/2) this.right.active = false;
                    else this.left.active = false;
                }
                if(window.Data.play == null && e.length == 0) window.Data.play = 'tutorial';
                if(window.Data.play == false){
                    window.Data.play = true;
                    window.Data.go = false;
                }
            }
          });

        window.addEventListener('resize', function(){
            this.resisePlatform('platform');
            if(this.load.textureManager.list.platformForeground != undefined) this.resisePlatform('platformForeground');
            if(this.load.textureManager.list.platformBackground != undefined) this.resisePlatform('platformBackground');
        }.bind(this))
    },
    update(){
        this.platform.rotation = (((this.left.value * -1) + this.right.value) * 0.5);

        if(this.left.active && this.left.value < 1 && window.Data.play != false) this.left.value += 0.04 * window.Data.sensitivity;
        if(this.right.active && this.right.value < 1 && window.Data.play != false) this.right.value += 0.04 * window.Data.sensitivity;

        if(!this.left.active && this.left.value > 0 && window.Data.play != false){
            this.left.value -= 0.1 * (window.Data.sensitivity * 0.8);
            if(this.left.value < 0) this.left.value = 0;
        }
        if(!this.right.active && this.right.value > 0 && window.Data.play != false){
            this.right.value -= 0.1 * (window.Data.sensitivity * 0.8);
            if(this.right.value < 0) this.right.value = 0;
        }

        if(window.Data.play === false){
            this.left.active = false;
            this.right.active = false;            
            if(this.platform.anims.isPlaying) this.platform.anims.stop()
            if(this.platformForeground != undefined) if(this.platformForeground.anims.isPlaying) this.platformForeground.anims.stop()
            if(this.platformBackground != undefined) if(this.platformBackground.anims.isPlaying) this.platformBackground.anims.stop()
            if(this.config.die){
                this.playSound();
                this.config.play = false;
                this.config.die = false
            }
        }
        if(window.Data.play == true && !this.config.play){
            this.playSound();
            this.config.play = true;
            this.config.die = true;
            if(!this.platform.anims.isPlaying) this.platform.play('idl-plaform')
            if(this.platformForeground != undefined) if(!this.platformForeground.anims.isPlaying) this.platformForeground.play('idl-platformForeground');
            if(this.platformBackground != undefined) if(!this.platformBackground.anims.isPlaying) this.platformBackground.play('idl-platformBackGround');
        }        
        if(this.platform.rotation > -.02 && this.platform.rotation < 0.02){this.platform.rotation = 0;}
        if(this.player.y > window.innerHeight){
            this.platform.rotation = 0;
            this.left = {active: false, value: 0};
            this.right = {active: false, value: 0};
        }
    },
    resisePlatform(key){
        const oldSizePlatform = {x: this[key].displayWidth, y: this[key].displayHeight};

        this[key].displayWidth = window.innerWidth * .7;
        this[key].displayHeight = (window.innerWidth * (oldSizePlatform.y/oldSizePlatform.x)) * .7; 
        this[key].x = window.innerWidth * .5;
        this[key].y = this[key].displayHeight/2 + window.innerHeight * .7;
    }
})