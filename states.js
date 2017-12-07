var game = new Phaser.Game(700, 530, Phaser.AUTO);


game.state.add('boot',boot);
game.state.add('preload',preloader);
game.state.add('mainMenu',Menu);
game.state.add('Game',Pacman);
game.state.start('boot');