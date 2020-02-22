import Phaser from 'phaser';

export default class Scene extends Phaser.Scene{
    constructor(props){
        super('scene1');

        const content = props;
        const temp = {};
        for(let i = 0; i < content.length; i++){
            const keys = Object.keys(content[i]);

            for(let e = 0; e < keys.length; e++){
                if(temp[keys[e]] === undefined) temp[keys[e]] = content[i][keys[e]];
                else{
                    let actual = temp[keys[e]].toString().replace(/^[^{]*{\s*/,'').replace(/\s*}[^}]*$/,'');
                    let add = content[i][keys[e]].toString().replace(/^[^{]*{\s*/,'').replace(/\s*}[^}]*$/,'');

                    temp[keys[e]] = new Function(`${actual} \n\n ${add}`);
                }
            }
        }
        
        const keys = Object.keys(temp);
        for(let i = 0; i < keys.length; i++){
            this[keys[i]] = temp[keys[i]];
        }
    }
}