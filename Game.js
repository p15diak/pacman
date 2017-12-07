
var music;
var key1;
  

var Pacman = function (game) {
        //dhlwsh metablhtwn
        this.score = 0; 
        this.scoreText;
        this.secsText;
        this.livesText;
        this.fight=0;
        this.now=0;
        this.lives=3;
        this.map = null;
        this.layer = null;
        this.pacman = null;
        this.enemy1=null;
        this.Bonus=0;
        this.textBonus;
        this.safetile = 763;
        this.gridsize = 16;
        this.speed = 100;
        this.threshold = 3;
        this.marker = new Phaser.Point();
        this.turnPoint = new Phaser.Point();
        this.directions = [ null, null, null, null, null ];
        this.opposites = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ];
        this.current = Phaser.NONE;
        this.turning = Phaser.NONE;
    };
    Pacman.prototype = {
      
        create: function () {
            this.map = this.add.tilemap('map');
            this.map.addTilesetImage('pacman-tiles', 'tiles');
            this.scoreText = this.add.text((28 * 16), (1*16), 'score: 0', { fontSize: '32px', fill: '#ffffff' }); //dhmiourgeia text gia scoreText
            this.livesText = this.add.text((28 * 16), (3*16), 'lives: 3', { fontSize: '32px', fill: '#ffffff' });//dhmiourgeia text gia livestext
            this.textBonus = this.add.text((28 * 16), (5*16), 'Bonus: 0', { fontSize: '32px', fill: '#ffffff' });//dhmiourgeia text bonus
            this.secsText = this.add.text((28 * 16), (7*16), 'Time: ', { fontSize: '32px', fill: '#ffffff' });
           
            this.time.events.loop(5000, this.bonusApears, this);// loup pou emfanizei to bonus sta 5 sec kalontas thn bonusApears
            this.time.events.loop(9000, this. bonusDisapear,this);// loup pou exafanizei to bonus sta 10 secs kalontas thn bonusDisapear
           
            this.layer = this.map.createLayer('Pacman');
            this.dots = this.add.physicsGroup();
            this.bonus= this.add.physicsGroup();
            this.map.createFromTiles(104, this.safetile, 'dot', this.layer, this.dots);
            //  The dots will need to be offset by 6px to put them back in the middle of the grid
            this.dots.setAll('x', 1, false, false, 1);
            this.dots.setAll('y', 1, false, false, 1);
            //  Pacman should collide with everything except the safe tile
            this.map.setCollisionByExclusion([this.safetile], true, this.layer);
            //  Position Pacman at grid location 14x17 (the +8 accounts for his anchor)
            this.pacman = this.add.sprite((14 * 16) + 8, (17 * 16) + 8, 'pacman', 0);
            this.pacman.anchor.set(0.5);
            this.pacman.animations.add('munch', [1, 1, 2, 3,], 9, true);
            this.physics.arcade.enable(this.pacman);
            this.pacman.body.setSize(16, 16, 0, 0);
            
            this.enemy1 = this.add.sprite((4* 16) + 8, (1* 16) + 8, 'enemy1', 0);
            this.enemy1.anchor.set(0.5);
            this.enemy1.animations.add('munch1', [1, 2, ], 20, true);
            this.physics.arcade.enable(this.enemy1);
            this.enemy1.body.setSize(16, 16, 0, 0);
            this.time.events.loop(400,this.enemyMove,this);
            
            
            this.cursors = this.input.keyboard.createCursorKeys();
            this.key1 = this.input.keyboard.addKey(Phaser.Keyboard.ONE).onDown.add(this.pacmanTeleport,this);
            this.pacman.play('munch');
            this.enemy1.play('munch1');
            this.move(Phaser.LEFT);
            this.music = game.add.audio('boden');
            this.music.play();
        },
        
        bonusApears: function(){
            this.bonus.create((12 * 16) + 8, (28 * 16) + 8, 'bonus');//dhmiourgeia bonus vazontas sugkekrimenes suntetagmenes
            this.bonus.create((1 * 16) + 8, (28 * 10) + 8, 'bonus');
        
        },
        
       bonusDisapear: function(){
        
        this.bonus.callAll('kill');     //exafanizei ta 2 bonus
        
    },
        pacmanTeleport: function(){
               this.pacman.x = ((19*16)+8);
               this.pacman.y= ((3*16)+8);
        },
    
       /*enemyOne:function(index,game,x,y){
            this.enemy1=game.add.sprite(x,y,'enemy1');
            this.enemy1.anchor.setTo(0.5,0.5);
            this.enemy1.name=index.toString();
            this.physics.enable(this.enemy1,Phaser.physics.ARCADE);
        }*/
        
        
        
        
        
        
        checkKeys: function () {
            if (this.cursors.left.isDown && this.current !== Phaser.LEFT)
            {
                this.checkDirection(Phaser.LEFT);
            }
            else if (this.cursors.right.isDown && this.current !== Phaser.RIGHT)
            {
                this.checkDirection(Phaser.RIGHT);
            }
            else if (this.cursors.up.isDown && this.current !== Phaser.UP)
            {
                this.checkDirection(Phaser.UP);
            }
            else if (this.cursors.down.isDown && this.current !== Phaser.DOWN)
            {
                this.checkDirection(Phaser.DOWN);
            }
            else
            {
                //  This forces them to hold the key down to turn the corner
                this.turning = Phaser.NONE;
            }
        },
        checkDirection: function (turnTo) {
            if (this.turning === turnTo || this.directions[turnTo] === null || this.directions[turnTo].index !== this.safetile)
            {
                //  Invalid direction if they're already set to turn that way
                //  Or there is no tile there, or the tile isn't index 1 (a floor tile)
                return;
            }
            //  Check if they want to turn around and can
            if (this.current === this.opposites[turnTo])
            {
                this.move(turnTo);
            }
            else
            {
                this.turning = turnTo;
                this.turnPoint.x = (this.marker.x * this.gridsize) + (this.gridsize / 2);
                this.turnPoint.y = (this.marker.y * this.gridsize) + (this.gridsize / 2);
            }
        },
        turn: function () {
            var cx = Math.floor(this.pacman.x);
            var cy = Math.floor(this.pacman.y);
            //  This needs a threshold, because at high speeds you can't turn because the coordinates skip past
            if (!this.math.fuzzyEqual(cx, this.turnPoint.x, this.threshold) || !this.math.fuzzyEqual(cy, this.turnPoint.y, this.threshold))
            {
                return false;
            }
            //  Grid align before turning
            this.pacman.x = this.turnPoint.x;
            this.pacman.y = this.turnPoint.y;
            this.pacman.body.reset(this.turnPoint.x, this.turnPoint.y);
            this.move(this.turning);
            this.turning = Phaser.NONE;
            return true;
        },
        move: function (direction) {
            var speed = this.speed;
            if (direction === Phaser.LEFT || direction === Phaser.UP)
            {
                speed = -speed;
            }
            if (direction === Phaser.LEFT || direction === Phaser.RIGHT)
            {
                this.pacman.body.velocity.x = speed;
            }
            else
            {
                this.pacman.body.velocity.y = speed;
            }
            //  Reset the scale and angle (Pacman is facing to the right in the sprite sheet)
            this.pacman.scale.x = 1;
            this.pacman.angle = 0;
            if (direction === Phaser.LEFT)
            {
                this.pacman.scale.x = -1;
            }
            else if (direction === Phaser.UP)
            {
                this.pacman.angle = 270;
            }
            else if (direction === Phaser.DOWN)
            {
                this.pacman.angle = 90;
            }
            this.current = direction;
        },
        
        
       enemyMove:function(){
        var enspeed = 100;
        var rand = this.rnd.between(1,4)
        if (rand == 1){
            
        this.enemy1.body.velocity.x = enspeed;
        this.enemy1.body.velocity.y = null;
        }else if (rand == 2){
            
        this.enemy1.body.velocity.x = -enspeed;
        this.enemy1.body.velocity.y = null;    
        }else if (rand == 3){
            
        this.enemy1.body.velocity.y = enspeed;
        this.enemy1.body.velocity.x = null
        }
           else{
            
        this.enemy1.body.velocity.y = -enspeed;
        this.enemy1.body.velocity.x = null;
        }
       },
        eatDot: function (pacman, dot ) {
            dot.kill();
            
            this.score +=10;
            this.scoreText.text = 'Score: ' + this.score;
            if (this.dots.total === 0)
            {
                this.dots.callAll('revive');
            }
        },
            
         eatBonus: function (pacman, bonus){// sunarthsh pou otan to pac man faei to bonus prosthetei shn 50 sto bonus text
            bonus.kill();                                               
            this.Bonus += 50; 
            this.fight = 1; 
            this.time.events.add(Phaser.Timer.SECOND * 10, this.FightMode, this);
            this.textBonus.text='Bonus: '+this.Bonus;
        },
        
         dead_pacman: function( )
        {
            if( this.fight != true )
            {
                this.pacman.kill();
                this.pacman.reset( (14 * 16) + 8, (17 * 16) + 8 );
                this.move(Phaser.LEFT);
                this.lives--; 
                this.livesText.text = 'Lives: ' + this.lives;
                if(this.lives == 0)
                {
                    this.game.destroy();    
                }    
            }
            else 
            {
                this.enemy1.kill();
            }
        },
        FightMode: function(){
            this.fight=0;
        },
        
       
        update: function () {
          
            this.physics.arcade.collide(this.pacman, this.layer);
            this.physics.arcade.overlap(this.pacman, this.dots, this.eatDot, null, this);
            this.physics.arcade.overlap(this.pacman, this.enemy1, this.dead_pacman, null, this);
            this.physics.arcade.overlap(this.pacman, this.bonus, this.eatBonus, null, this);
            this.secsText.text ='Time: '+ Math.round(game.time.now*1/1000)+'secs';//update to secsText ka8e sec 
            this.Bonus.txt;
            this.physics.arcade.collide(this.enemy1, this.layer);
            
            this.marker.x = this.math.snapToFloor(Math.floor(this.pacman.x), this.gridsize) / this.gridsize;
            this.marker.y = this.math.snapToFloor(Math.floor(this.pacman.y), this.gridsize) / this.gridsize;
            //  Update our grid sensors
            this.directions[1] = this.map.getTileLeft(this.layer.index, this.marker.x, this.marker.y);
            this.directions[2] = this.map.getTileRight(this.layer.index, this.marker.x, this.marker.y);
            this.directions[3] = this.map.getTileAbove(this.layer.index, this.marker.x, this.marker.y);
            this.directions[4] = this.map.getTileBelow(this.layer.index, this.marker.x, this.marker.y);
            this.checkKeys();
            if (this.turning !== Phaser.NONE)
            {
                this.turn();
            }   
            
        },
    };
    