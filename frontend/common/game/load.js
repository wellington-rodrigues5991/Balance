import GameObject from '../config/gameObject';

export const Load = new GameObject({
	preload(){
        let progressBox = this.add.graphics();
		let progressBar = this.add.graphics();
		progressBox.fillStyle('0xfff000', 0.5);
		progressBox.fillRect((window.innerWidth/2) - 105, (window.innerHeight/2) - 10, 210, 20);

		this.load.on('progress', function (value) {
			progressBar.clear();
			progressBar.fillStyle('0x000ff0', 1);
			progressBar.fillRect((window.innerWidth/2) - 100, (window.innerHeight/2) - 5, 200 * value, 10);
        });
        
		this.load.on('complete', function () {
			progressBar.destroy();
			progressBox.destroy();
		});
    }
})