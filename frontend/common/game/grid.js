import GameObject from '../config/gameObject';

export const Grid = new GameObject({
    preload(){
        this.load.image('temp', undefined);
        for(let i = 0; i < window.Data.grid.length; i++) {
            for(let e = 0; e < window.Data.grid[i].data.length; e++){
                const target = window.Data.grid[i].data[e];             
                this.load.spritesheet(
                    'grid'+i+e, 
                    target.image, 
                    { frameWidth: parseFloat(target.frame.width), frameHeight: parseFloat(target.frame.height) })
            }
        }
    },    
    create(){
        this.pool = {
            data: [],
            active: [],
            list: [],
            actual: 0,

            old: window.innerHeight,
            speed: window.Data.startSpeed,
            start: this.time.now,
            gap: 0,
        };
        for(let i = 0; i < 50; i++){
            this.pool.data[i] = this.matter.add.sprite(window.innerWidth*-1, window.innerHeight*-1, 'grid00');
            this.pool.data[i].setSensor(true);
            this.pool.data[i].body.ignoreGravity = true;
        }

        for(let i = 0; i < window.Data.grid.length; i++) {
            for(let e = 0; e < window.Data.grid[i].data.length; e++){                
                const target = window.Data.grid[i].data[e];
                this.anims.create({
                    key: 'anim-grid'+i+e,
                    frames: this.anims.generateFrameNumbers('grid'+i+e, { start: parseFloat(target.animation.start), end: parseFloat(target.animation.end) }),
                    frameRate: parseFloat(target.animation.frameRate),
                    repeat: -1
                });
            }
        }

        this.matter.world.on('collisionstart', event => {
            let pairs = event.pairs;
            for (var i = 0; i < pairs.length; i++){
                let bodyA = pairs[i].bodyA;
                let bodyB = pairs[i].bodyB;
                if(pairs[i].isSensor){
                    if(!bodyA.isSensor && bodyB.isSensor && bodyA.id === this.player.body.id && !this.player.config.invensible){
                        const lifes = this.player.config.lifes;
                        switch(bodyB.gameObject.config.type){
                            case  "point" : {
                                if(window.bonus == undefined) window.bonus = 0;
                                if(window.Data.play == true) window.bonus += bodyB.gameObject.config.value;
                                if(bodyB.gameObject.config.value > 0) {
                                    this.player.play('player-win');
                                    this.addMiniScore(this.player.x, this.player.y-this.player.displayHeight-5, bodyB.gameObject.config.value, '+');
                                    if(this.checkSound('win') && this.music.status == true) this.sound.play('win')
                                }
                                else {
                                    this.player.play('player-lose');
                                    this.addMiniScore(this.player.x, this.player.y-this.player.displayHeight-5, bodyB.gameObject.config.value, '-');
                                    if(this.checkSound('lose') && this.music.status == true) this.sound.play('lose')
                                }
                            }
                                break;
                            case  "hit" : {
                                if(window.Data.play == true) lifes.actual += bodyB.gameObject.config.value;
                                if(bodyB.gameObject.config.value > 0) {
                                    this.player.play('player-lifewin');
                                    this.addMiniScore(this.player.x, this.player.y-this.player.displayHeight-5, bodyB.gameObject.config.value, '+', true);
                                    if(this.checkSound('lifewin') && this.music.status == true) this.sound.play('lifewin');
                                }
                                else {
                                    this.player.play('player-lifelose');
                                    this.addMiniScore(this.player.x, this.player.y-this.player.displayHeight-5, bodyB.gameObject.config.value, '-', true);
                                    if(this.checkSound('lifelose') && this.music.status == true) this.sound.play('lifelose');
                                }
                            }
                                break;
                        }
                        if(bodyB.gameObject.config.value < 0) this.cameras.main.shake(150, 0.03)
                    }
                }
            }
        });

        window.addEventListener('resize', () => this.resizeGrid())
    },
    update(){
        const remove = [];
        const temp = [[], []];
        if(window.Data.play == false || window.Data.play == 'middle'){
            if(this.pool.active.length == 0 && window.Data.play == 'middle'){
                window.Data.play = true
                window.Data.go = false;
            }
            this.pool.active.forEach((value, i) => {
                let y = 0;
                value.forEach(e => {
                    let top = this.pool.data[e].y + (this.pool.data[e].displayHeight/2);
                    if(top > 0) this.pool.data[e].setVelocityY(-10);
                    if(top <= 0) remove.push(i);
                });
            });
        }
        if(window.Data.play != false && window.Data.play != null && window.Data.play != 'middle'){
            if(this.pool.active.length < 10) this.createGrid();
            this.pool.active.forEach((value, i) => {
                let y = 0;
                value.forEach(i => {
                    let top = this.pool.data[i].y - (this.pool.data[i].displayHeight/2);
                    this.pool.data[i].setVelocityY(this.pool.speed);
                    if(y == 0 || y > top) y = top;
                });
                if(y > window.innerHeight) remove.push(i)
            });
        }
        for(let i = 0; i < this.pool.active.length; i++){
            if(remove.indexOf(i) < 0) {
                temp[0].push(this.pool.active[i])
                temp[1].push(this.pool.list[i])
            }
            else{
                if(window.Data.play == true) this.pool.speed += window.Data.acelleration;
                for(let t = 0; t < this.pool.active[i].length; t++){
                    let e = this.pool.active[i][t];
                    this.pool.data[e].x = window.innerWidth * -1;
                    this.pool.data[e].y = window.innerHeight * -1;
                    this.pool.data[e].displayWidth = window.Grid.value;
                    this.pool.data[e].displayHeight = window.Grid.value;
                }
            }
        }
        this.pool.active = temp[0];
        this.pool.list = temp[1];
    },
    createGrid(){
        const t = parseInt(Math.random() * window.Data.grid.length);
        const grid = window.Data.grid[t];
        const e = this.pool.actual;
        const line = [];
        const plus = e == 0 ? 0 : (Math.random() * window.Data.gridDistance);

        for(let i = 0; i < grid.data.length; i++){
            let offset = this.getTop() < 0 ? this.getTop() * -1 : this.getTop();
            offset += (grid.size.height + plus) * window.Grid.value;
            let target = this.pool.data[e+i];

            target.config = {};
            target.config.type = grid.data[i].type;
            target.config.value = grid.data[i].value;
            if(target.anims.isPlaying) target.anims.stop();
            target.texture.manager.setTexture(
                target,
                'grid'+t+i,
                0
            );

            target.setFrame('grid'+t+i, true, true);
            target.setDisplaySize(grid.data[i].width * window.Grid.value, grid.data[i].height * window.Grid.value)
            target.setRectangle(grid.data[i].width * window.Grid.value, grid.data[i].height * window.Grid.value, {ignoreGravity: true});
            target.setSensor(true);
            target.setPosition(
                grid.data[i].x * window.Grid.value + (this.pool.data[e+i].displayWidth/2),
                grid.data[i].y * window.Grid.value - offset
            );      

            if(target.anims.animationManager.get('anim-grid'+t+i).frames.length > 1) target.play('anim-grid'+t+i);

            line.push(e+i);
        }

        this.pool.actual = e >= 40 ? 0 : e+grid.data.length;
        this.pool.active.push(line);
        this.pool.list.push(t);
    },
    getTop(){
        let y = 0;
        this.pool.active.forEach((value, i) => {
            value.forEach(i => {
                let h = parseFloat(this.pool.data[i].y) - parseFloat(this.pool.data[i].displayHeight/2)
                if(y == 0 || y > h) y = h;
            });
        });
        return y;
    },
    getBase(grid){
        let y = 0;
        grid.forEach(i => {
            let h = parseFloat(this.pool.data[i].y) - parseFloat(this.pool.data[i].displayHeight/2)
            if(y == 0 || y > h) y = h;
        })

        return y;
    },
    resizeGrid(){              
        for(let i = 0; i < this.pool.active.length; i++){
            const line = this.pool.active[i];
            const grid = window.Data.grid[this.pool.list[i]];
            const top = this.getBase(line);

            for(let e = 0; e < grid.data.length; e++){
                const target = this.pool.data[line[e]];
                let y = (this.pool.old/window.Grid.old)-((this.pool.old-target.y)/window.Grid.old);

                target.displayWidth = grid.data[e].width * window.Grid.value;
                target.displayHeight = grid.data[e].height * window.Grid.value;
                target.x = grid.data[e].x * window.Grid.value + (target.displayWidth/2);
                target.y = window.Grid.value * y;
            }
        }

        this.pool.old = window.innerHeight;
    },
})