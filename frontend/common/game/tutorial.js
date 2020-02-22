import GameObject from '../config/gameObject';
import { Data } from 'phaser';

export const Tutorial = new GameObject({
    create(){
        this.tutorial = {left: {}, right: {}, count: 0};
        this.tutorial.left.text = this.add.text(0, window.innerHeight * .05, 'Press the key Q\nTouch Left\n To tilt to left', { fontFamily:  window.Data.fontFamily});
        this.tutorial.right.text = this.add.text(0, window.innerHeight * .05, 'Press the key E\nTouch Right\n To tilt to Right', { fontFamily:  window.Data.fontFamily});
        this.tutorial.button = this.add.text(0, window.innerHeight * .05, 'I understood how it works, start the game', { fontFamily:  window.Data.fontFamily, padding: 10});

        this.resizeFont();
        this.tutorial.right.text.y = window.innerHeight;
        this.tutorial.left.text.y = window.innerHeight;
        this.tutorial.button.y = window.innerHeight;

        this.tutorial.right.text.depth = 50;
        this.tutorial.left.text.depth = 50;
        this.tutorial.button.depth = 50;
        this.tutorial.button.setInteractive();
        this.tutorial.button.on('pointerup', () => {
            window.Data.play = 'middle'
            window.Data.go = false;
        });
    },
    update(){
        if(window.Data.play == 'tutorial'){
            if(this.tutorial.right.text.y > window.innerHeight - this.tutorial.right.text.displayHeight-40-this.tutorial.button.displayHeight){
                this.tutorial.right.text.y -= 10;
                this.tutorial.left.text.y -= 10;
                this.tutorial.button.y -= 3;
            }else{
                this.resizeFont();
            }
        }
        else{
            if(this.tutorial.right.text.y <= window.innerHeight){
                this.tutorial.right.text.y += 20;
                this.tutorial.left.text.y += 20;
                this.tutorial.button.y += 5;
            }
            else{
                this.tutorial.right.text.y = window.innerHeight;
                this.tutorial.left.text.y = window.innerHeight;
                this.tutorial.button.y = window.innerHeight;
            }
        }
    },
    resizeFont(){
        let top = window.innerWidth;

        if(window.innerWidth < window.innerHeight) top = window.innerHeight;

        this.tutorial.button.setAlign('center');
        this.tutorial.button.setFontSize(top * .025);
        this.tutorial.button.setBackgroundColor(window.Data.color.text);
        this.tutorial.button.setColor(window.Data.color.primary);
        if(this.tutorial.button.displayWidth > window.innerWidth * 0.8){
            this.tutorial.button.displayHeight = (this.tutorial.button.displayHeight/this.tutorial.button.displayWidth) * (window.innerWidth * 0.8);
            this.tutorial.button.displayWidth = window.innerWidth * 0.8;
        }
        this.tutorial.button.x = window.innerWidth/2 - (this.tutorial.button.displayWidth/2);
        this.tutorial.button.y = window.innerHeight - this.tutorial.button.displayHeight-30;

        this.tutorial.left.text.setAlign('center');
        this.tutorial.left.text.setFontSize(top * .03);
        this.tutorial.left.text.setColor(window.Data.color.text);
        this.tutorial.left.text.x = window.innerWidth/2 - this.tutorial.left.text.displayWidth-30;
        this.tutorial.left.text.y = window.innerHeight - this.tutorial.left.text.displayHeight-40-this.tutorial.button.displayHeight;

        this.tutorial.right.text.setAlign('center');
        this.tutorial.right.text.setFontSize(top * .03);
        this.tutorial.right.text.setColor(window.Data.color.text);
        this.tutorial.right.text.x = window.innerWidth/2 + 30;
        this.tutorial.right.text.y = window.innerHeight - this.tutorial.right.text.displayHeight-40-this.tutorial.button.displayHeight;
    }
})