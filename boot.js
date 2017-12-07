var boot = {
    preload:function(){
	this.load.baseURL = 'https://p15diak.github.io/pacman/';
        this.load.crossOrigin = 'p15diak';
    },
    
	create:function(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        

        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

        this.physics.startSystem(Phaser.Physics.ARCADE);
		game.state.start('preload');
	},
};
