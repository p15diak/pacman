var preloader = {
	preload: function(){
		
            this.load.image('dot', 'assets/dot.png');// eisagwgh sprite gia dot
            this.load.image('bonus','assets/bonus.png');// eisagwgh sprite gia bonus
            this.load.image('tiles', 'assets/pacman-tiles.png');
            this.load.spritesheet('pacman', 'assets/pacman.png', 32, 32);
            this.load.spritesheet('enemy1','assets/Untitled.png',32,32);
            this.load.tilemap('map', 'assets/pacman-map.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.audio('boden', ['assets/Star Wars.mp3', 'assets/Star Wars.ogg']);
            this.load.spritesheet('button','assets/button.png',201,71.6);
            this.load.image('menu','assets/deathstar.jpg');
        
	},
	
	create: function(){
        //this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        //this.scale.pageAlignHorizontally = true;
        //this.scale.pageAlignVertically = true;

        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
		game.state.start('mainMenu');	
	},
};