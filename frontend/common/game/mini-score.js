import GameObject from '../config/gameObject';
import Phaser from 'phaser';

export const MiniScore = new GameObject({ 
  create(){
      this.miniscore = [];
  },
  update(){
    const size = this.miniscore.length;
    for(let i = 0; i < size; i++){
      if(this.miniscore[i] != undefined){
        let speed = 1.5;
        let alpha = 0.007;

        this.miniscore[i][0].y -= speed;
        this.miniscore[i][0].alpha -= alpha;

        if(this.miniscore[i][3] != undefined){
          this.miniscore[i][3].y -= speed;
          this.miniscore[i][3].alpha -= alpha;
        }

        if(this.miniscore[i][0].alpha <= 0) this.miniscore[i][0].destroy();
      }
    }
  },
  addMiniScore(x, y, text, type, icon){
    let i = this.miniscore.length;
    let color = window.Data.color.lose;

    if(type == '+') color = window.Data.color.win;
    this.miniscore[i] = []
    this.miniscore[i][0] = this.add.text(0, 0, type+text, { fontFamily: window.Data.fontFamily, fontSize: 22, color: color});
    this.miniscore[i][0].x = x - (this.miniscore[i][0].displayWidth/2);
    this.miniscore[i][0].y = y - this.miniscore[i][0].displayHeight;
    this.miniscore[i][0].config = {type: type};
    if(icon != undefined){
      this.miniscore[i][3] = this.add.sprite(x, y, 'hud');
      this.miniscore[i][3].displayHeight = (this.miniscore[i][3].displayHeight / this.miniscore[i][3].displayWidth) * 30;
      this.miniscore[i][3].displayWidth = 30;
      this.miniscore[i][0].x = x + 32;
      this.miniscore[i][0].y = y - (this.miniscore[i][0].displayHeight/2);
    }
  }
})