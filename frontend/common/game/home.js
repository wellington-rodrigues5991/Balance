import GameObject from '../config/gameObject';

export const Home = new GameObject({
    preload(){
        if(window.Data.logo.image != undefined) this.load.image('logo', window.Data.logo.image);
    },  
    create(){
        this.home = {};
        this.home.text = this.add.text(0, window.innerHeight * .05, window.Data.playButton, { fontFamily:  window.Data.fontFamily});
        this.home.text.setColor(window.Data.color.text);
        this.home.config = {count: 0}
        if(window.Data.logo.image != undefined) this.home.logo = this.add.sprite(0, window.innerHeight * .05, 'logo');
        else {
            this.home.logo = this.add.text(0, window.innerHeight * .05, window.Data.logo.name, { fontFamily:  window.Data.fontFamily});
            this.home.logo.setColor(window.Data.color.text);
        }

        this.home.text.depth = 50;
        this.home.logo.depth = 50;
    },
    update(){        
        let size = window.innerWidth;
        if(window.innerHeight > window.innerWidth) size = window.innerHeight;
        this.home.text.setFontSize(size * .03);
        this.home.text.x = window.innerWidth/2 - this.home.text.displayWidth/2;
        
        if(window.Data.play == null){
            this.home.text.y = window.innerHeight - this.home.text.displayHeight - window.innerHeight*.05;

            if(window.Data.logo.image != undefined) {
                const logoSize = {x: this.home.logo.displayWidth, y: this.home.logo.displayHeight}

                this.home.logo.displayWidth = (window.innerHeight * .25) * (logoSize.x/logoSize.y);
                this.home.logo.displayHeight = window.innerHeight * .25;
                this.home.logo.x = window.innerWidth/2;
                this.home.logo.y = window.innerHeight*.3;
            }else{
                this.home.logo.setFontSize(size * .1);
                this.home.logo.x = window.innerWidth/2 - this.home.logo.displayWidth/2;
                this.home.logo.y = window.innerHeight*.2; 
            }
        }
        if(window.Data.play != null && window.Data.play != false){
            if(this.home.logo.y < window.innerHeight * 2) this.home.logo.y += 25;
            if(this.home.text.y < window.innerHeight){
                this.home.text.y += 5;
                this.home.config.count++;
            }            
        }
        if(window.Data.play == false){
            if(this.home.text.y > window.innerHeight - this.home.text.displayHeight - window.innerHeight*.05) this.home.text.y -= 5;
            else{
                this.home.text.y = window.innerHeight - this.home.text.displayHeight - window.innerHeight*.05
                if(this.home.config.count <= 0){
                    window.Data.go = 'true';
                }
                this.home.config.count--;
            }
            this.home.text.depth = 50;
        }
    }
})