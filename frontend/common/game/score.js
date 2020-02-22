import GameObject from '../config/gameObject';

export const Score = new GameObject({
    preload(){
        this.load.image('hud', window.Data.lifeIcon );
    },    
    create(){
        this.score = this.add.text(0, window.innerHeight * .05, '--', { fontFamily: window.Data.fontFamily });
        this.score.setFontSize(window.innerHeight * .10);
        this.score.setAlign('center');
        this.score.setColor(window.Data.color.text);

        this.score.start = {time: this.time.now, count: 0};

        this.hub = [];
        for(let i = 0; i < this.player.config.lifes.max; i++){
            this.hub[i] = this.add.sprite(0, 0, 'hud');

            const size = {x: this.hub[i].displayWidth, y: this.hub[i].displayHeight}
            this.hub[i].displayHeight = window.innerHeight * .07;
            this.hub[i].displayWidth = (window.innerHeight * .07) * (size.x/size.y);

            this.hub[i].y = -window.innerHeight * 2
            this.hub[i].x = (window.innerWidth/2) + (((window.innerHeight * .07) * (size.x/size.y)) * (i-1));

        }
    },
    update(){
        this.score.x = window.innerWidth/2 - this.score.displayWidth/2;
        
        if(window.Data.play == null) this.score.y = -window.innerHeight * 2;
        if(window.Data.play == true){
            if(this.score.start.count == 0){
                this.score.start.count = 1;
                this.score.start.time = this.time.now
            }

            const points = parseInt(((this.time.now - this.score.start.time)/2000).toFixed(0)) + parseInt(window.bonus == undefined ? 0 : window.bonus);
            this.score.y = window.innerHeight * .05;
            this.score.setFontSize(window.innerHeight * .15);
            this.score.setText(points);
            window.Data.score = points;
            
            for(let i = 0; i < this.player.config.lifes.max; i++){
                const size = {x: this.hub[i].displayWidth, y: this.hub[i].displayHeight}
                this.hub[i].displayHeight = window.innerHeight * .05;
                this.hub[i].displayWidth = (window.innerHeight * .05) * (size.x/size.y);

                if(i+1 > this.player.config.lifes.actual) this.hub[i].alpha = 0;
                else this.hub[i].alpha = 1;

                this.hub[i].y = (window.innerHeight * .27)
                this.hub[i].x = (window.innerWidth/2) + ((((window.innerHeight * .1) * (size.x/size.y)) * (i-1))/1.5)
            }
        }
        if(window.Data.play == false){
            this.score.start.count = 0;
            
            for(let i = 0; i < this.player.config.lifes.max; i++){
                this.hub[i].alpha = 0;
            }
        }
    }
})