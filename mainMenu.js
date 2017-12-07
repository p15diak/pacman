
var Menu = {
	create: function(){
		this.spriteMenu=game.add.sprite(0,0,'menu');
        button = game.add.button(115,430,'button',this.actionOnClick,this,2,1,0);
	},
	
	actionOnClick:function(){
		game.state.start('Game');
        
	},
};