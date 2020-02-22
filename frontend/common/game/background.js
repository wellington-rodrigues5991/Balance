import GameObject from '../config/gameObject';

export const BackgroundParallax = new GameObject({
    preload(){
        let url = window.Data.backgrounds;
        
        for(let i = 0; i < url.length; i++){
            this.load.image('background'+i, url[i].image);
        }
    },  
    create(){
        this.background = {content: []};
        let url = window.Data.backgrounds;

        for(let i = 0; i < url.length; i++){
            this.background.content[i] = this.add.tileSprite(
                0, 
                0, 
                window.innerWidth, 
                window.innerHeight, 
                'background'+i
            )
            this.background.content[i].config = url[i].depth;
        }
        window.addEventListener('resize', function(){this.resizeBackground();}.bind(this));
        this.resizeBackground();
    },
    update(){
        if(window.Data.play != null && window.Data.play != false){
            for(let i = 0; i < this.background.content.length; i++){
                const background = this.background.content[i]; 

                background.tilePositionY -= background.config;
            }
        }
    },
    resizeBackground(){
        for(let i = 0; i < this.background.content.length; i++){
            const background = this.background.content[i];
            const backSize = {x:background.potWidth, y:background.potHeight};

            background.setOrigin(0, 0.5)
            background.width = background.potWidth;
            background.height = background.potHeight;
            background.width = background.potWidth;
            background.height = background.potHeight;

            if(window.innerHeight > window.innerWidth){
                background.setScale(
                    (window.innerHeight/background.potHeight) * 2, 
                    (window.innerHeight/background.potHeight)  * 2
                );
            }
            if(window.innerHeight < window.innerWidth){
                background.setScale(
                    (window.innerWidth/background.potWidth) * 4, 
                    (window.innerWidth/background.potWidth) * 4
                );
            }
        }
    }
})

//Koji.config.serviceMap.backend