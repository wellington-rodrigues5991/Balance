import GameObject from '../config/gameObject';
import Koji from '@withkoji/vcc';

export const Leaderboard = new GameObject({ 
    create(){
        this.leaderborad = {name: '', point: '', list: false};
        this.leaderborad.names =  this.add.text(0, window.innerHeight * .05, this.leaderborad.name, { fontFamily: window.Data.fontFamily});
        this.leaderborad.points =  this.add.text(0, window.innerHeight * .05, this.leaderborad.point, { fontFamily: window.Data.fontFamily});
        
        this.leaderborad.names.setColor(window.Data.color.text);
        this.leaderborad.points.setColor(window.Data.color.text);

        this.leaderborad.names.setAlign('left');
        this.leaderborad.points.setAlign('right');

        this.leaderborad.names.setFontSize(24);
        this.leaderborad.points.setFontSize(24);

        this.leaderborad.names.setLineSpacing (10);
        this.leaderborad.points.setLineSpacing (10);

        this.leaderborad.names.depth = 50;
        this.leaderborad.points.depth = 50;
    },
    update(){
        if(window.Data.play != false){
            this.leaderborad.list = false;

            this.leaderborad.names.alpha = 0;
            this.leaderborad.points.alpha = 0;
        }
        if(window.Data.play == false && !this.leaderborad.list){
            let data = this.getLeaderBoard();
            
            this.leaderborad.name = data[0].join('\n');
            this.leaderborad.point = data[1].join('\n');
            this.leaderborad.list = true;

            this.leaderborad.names.setText(this.leaderborad.name);
            this.leaderborad.points.setText(this.leaderborad.point);

            this.leaderborad.names.alpha = 1;
            this.leaderborad.points.alpha = 1;
        }

        this.leaderborad.names.setText(this.leaderborad.name);
        this.leaderborad.points.setText(this.leaderborad.point);

        let pos = this.leaderborad.names.displayWidth + this.leaderborad.points.displayWidth + 40;
        this.leaderborad.names.x = window.innerWidth/2 - pos/2;
        this.leaderborad.points.x = this.leaderborad.names.x + this.leaderborad.names.displayWidth + 20;

        this.leaderborad.names.y = this.score.y + this.score.displayHeight + 5;
        this.leaderborad.points.y = this.leaderborad.names.y;
        
    },
    getLeaderBoard(){
        fetch(Koji.config.serviceMap.backend+'/leaderboard')
        .then((response) => response.json())
        .then(({ scores }) => {
            let temp = [[], []];
            let d = {};
            scores.map(v => d[v.name] = v.score);

            let keys = Object.keys(d);
            let val = Object.values(d);
            val.sort(function(a, b){return b-a});

            for(let i = 0; i < keys.length; i++){
                let key = val.indexOf(d[keys[i]]);
                if(key > -1){
                    temp[0][key] = keys[i];
                    temp[1][key] = d[keys[i]];
                    val[key] = undefined;
                }
            }
            
            temp[0] = temp[0].slice(0, 5);
            temp[1] = temp[1].slice(0, 5);

            this.leaderborad.name = temp[0].join('\n')
            this.leaderborad.point = temp[1].join('\n');

            let min = Math.min.apply(null, temp[1]);

            if(min == Infinity || min == NaN) min = 0;
                        
            if(parseInt(this.score.text) > min){
                window.Data.go = true;
                window.Data.scoreNumber = parseInt(this.score.text);
                this.post();
            }
            else window.Data.go = false;
        })
        .catch(err => {
            console.log('Fetch Error: ', err);
        });
        
        return [[], []]
    },
    post(){
      window.Data.openLeaderboard(() => this.getLeaderBoard(),  () => window.Data.go = false);
    }
})