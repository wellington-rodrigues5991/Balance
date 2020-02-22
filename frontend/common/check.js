export default function Check(grid, images, game){
    const data = [[], [], []];
    const r = []
    const generate = (url, callback) => {
        const img = new Image();
        img.crossOrigin="anonymous"; 
        img.onload = () => getBase64Image(img, callback);
        img.src = url;
    };
    const getBase64Image = (img, callback) => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");

        callback(dataURL, {width: img.width, height: img.height});
    }
    const calculate = () => {
        const d = data[0];
        for(let i = 0; i < d.length; i++){
            for(let e = 0; e < d[i].length; e++){
                let have = false;
                if(r[i] == undefined) r[i] = { size: grid[i].size, data: [] };
                for(let n = 0; n < data[1].length; n++){
                    let obj = Object.assign({}, grid[i].data[e]);
                    if(d[i][e] == data[1][n]){

                        obj.image = dataURLtoBlob(images[n].image);
                        obj.frame = images[n].frame;
                        obj.animation = {
                            start: images[n].animations[0].start,
                            end: images[n].animations[0].end,
                            frameRate: images[n].animations[0].frameRate
                        }
                        obj.type = images[n].type;
                        obj.value = images[n].value;
                        
                        r[i].data.push(obj);
                        have = true;
                    }
                    if(n == data[1].length-1 && have == false){
                        console.log(grid, images)
                        obj.image = dataURLtoBlob(d[i][e]);
                        obj.frame = data[2][i][e];
                        obj.animation = {
                            start: 0,
                            end: 0,
                            frameRate: 10
                        }
                        r[i].data.push(obj);
                    }
                }
            }
        }
        game(r)
    };
    const dataURLtoBlob = dataurl => {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return URL.createObjectURL(new Blob([u8arr], {type:mime}));
    }

    for(let i = 0; i < images.length; i++){
        generate(images[i].animations[0].frames[0], val => data[1][i] = val);
    }

    for(let i = 0; i < grid.length; i++){
        data[0][i] = []
        data[2][i] = []
        for(let e = 0; e < grid[i].data.length; e++){
            generate(grid[i].data[e].image, (val, size) => {
                data[0][i][e] = val;
                data[2][i][e] = size
                if(e == grid[i].data.length-1 && i == grid.length-1) calculate();
            });
        }
    }

}