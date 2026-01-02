import { GameData } from "../GameData";
import  Player  from "../GameObject/player";

export default class Boss01 extends Phaser.Scene {
  private _player: Player;
  private _playerSprite: Phaser.GameObjects.Sprite;

  private _boss: Player;
  private _bossSprite: Phaser.GameObjects.Sprite;
  private _sfondo: Phaser.GameObjects.Image;

  //BUTTONS-----------------------------------------------------------------------------------------------------------------------
  private _attackButton: Phaser.GameObjects.Image;
  private _techButton: Phaser.GameObjects.Image;
  private _inventoryButton: Phaser.GameObjects.Image;
  private _restartButton: Phaser.GameObjects.Image;

  private _attackTextLabel: Phaser.GameObjects.Text;
  private _techTextLabel: Phaser.GameObjects.Text;
  private _inventoryTextLabel: Phaser.GameObjects.Text;
  private _restartTextLabel: Phaser.GameObjects.Text;

  //healtBar-----------------------------------------------------------------------------------------------------------------------
  private _playerHealthBar: Phaser.GameObjects.Graphics;
  private _bossHealthBar: Phaser.GameObjects.Graphics;

  //INTERFACE-----------------------------------------------------------------------------------------------------------------------
  private _turnBased: Phaser.GameObjects.Text;
  //TEXT GUI-----------------------------------------------------------------------------------------------------------------------
  private _textGUI: Phaser.GameObjects.Image;
  private _infoText: Phaser.GameObjects.Text;
  private _Mana: Phaser.GameObjects.Text;
  //BOSS BOX-----------------------------------------------------------------------------------------------------------------------
  
  //MUSIC-----------------------------------------------------------------------------------------------------------------------
  private _music: Phaser.Sound.BaseSound;
  private _click: Phaser.Sound.BaseSound;

  //Logic----------------------------------------------------------------------------------------------------------------------
  private _animation: boolean = false;

  private _currentTurn: boolean | null = null;
  private _bossattacTurn:boolean = true;



  constructor() {
    super({
      key: "Boss01",
      
    });
  }


  init() {
    
  }

  preload() {
    this.load.audio("boss2","assets/sounds/Neunoeil.ogg");
  }


  create() {
    //PLAYER-----------------------------------------------------------------------------------------------------------------------
    this._currentTurn = null;


    //CHECK MUSIC
    this._click = this.sound.add("click2");
    this._music = this.sound.add("boss", { loop: true });
    if(this.registry.get("musicOn") === undefined){
      this.registry.set("musicOn", true);
    }

    if(this.registry.get("musicOn")){
      this._music.play();
    }



    this._player = new Player({
      scene: this,
      x: 100,
      y: 100,
      key: "player",
    }, "Death Deluxe",600, 600, 10, 10, [
      { nome: "punch", danno: 15, costo: 0 },
      { nome: "smite", danno: 30, costo: 1 },
      { nome: "large slayer", danno: 80, costo: 2 },
      { nome: "mita destroyer", danno: 9999999, costo: 4 }
    ]);
    this._playerSprite = this.add.sprite(300, 550, "player", 0).setDepth(1)
    .setScale(5);
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 1 }),
      frameRate: 1,
      repeat: -1
    });

    //INTERFACE

    this._turnBased = this.add.text(1280/2,400, "YOUR TURN", { 
      fontFamily: "Underdog",
      fontSize: 70,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 6,
     }).setOrigin(0.5).setDepth(1002).setScale(1).setVisible(false);


     this._player.turn = true;
     this._player._vittoria = false;
     

    //BOSS
    this._boss = new Player({
      scene: this,
      x: 100,
      y: 100,
      key: "fabrizio",
    },"Fabrizio", 600, 600, 100, 100, [
      { nome: "axe smite", danno: 123, costo: 1 },
    ]);
    this._bossSprite = this.add.sprite(900, 300, "fabrizio", 0).setScale(4).setDepth(1);
    this.anims.create({
      key: "idleC",
      frames: this.anims.generateFrameNumbers("fabrizio", { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1
    });
    
  





    this._sfondo = this.add.image(0, 0, "sfondoBoss01").setOrigin(0, 0).setDepth(0).setScale(5);
    let _sfondoNero: Phaser.GameObjects.Image = this.add.image(0, 0, "sfondoNero").setOrigin(0, 0).setAlpha(1).setDepth(1002);
    this.add.tween({
      targets: _sfondoNero,
      alpha: 0,
      duration: 1000,
      ease: "Power2",
      onComplete: () => {
        this._playerSprite.play("idle");
        this._bossSprite.play("idleC");
      },
    });

    //HEALTH BAR-----------------------------------------------------------------------------------------------------------------------
    let _nomePlayer: Phaser.GameObjects.Text = this.add.text(550, 500, "TU", {fontFamily: "Underdog", fontSize: 40, color: "#770000"}).setDepth(1000);
    let _nomeBoss: Phaser.GameObjects.Text = this.add.text(20, 10, "Fabrizio", {fontFamily: "Underdog", fontSize: 40, color: "#770000"}).setDepth(1000);
    
  
    this._playerHealthBar = this.add.graphics();
    this._playerHealthBar.fillStyle(0x770000, 1).fillRect(550, 550, 600, 20).fillRoundedRect(550, 550, 600, 20, 10)
    .lineStyle(4, 0x000000, 1).strokeRoundedRect(550, 550, 600, 20, 10).setDepth(1000);

    
    this._bossHealthBar = this.add.graphics();
    this._bossHealthBar.fillStyle(0x770000, 1).fillRect(20, 50, 600, 20).fillRoundedRect(20, 50, 600, 20, 10)
    .lineStyle(4, 0x000000, 1).strokeRoundedRect(20, 50, 600, 20, 10).setDepth(1000);
    
     //TEXT GUI
    this._textGUI =  this.add.image(320, 150, "GUI");
    this._infoText = this.add.text(320, 130, " ", { 
      fontFamily: "Underdog",
      fontSize: 20,
      color: "#ffffff",
     }).setOrigin(0.5).setDepth(1001);

     this._Mana = this.add.text(0, 800, this._player.Mana.toString(), { 
      fontFamily: "Underdog",
      fontSize: 122,
      color: "#000085",
     }).setOrigin(0,1).setDepth(1001);
    


    //BUTTONS-----------------------------------------------------------------------------------------------------------------------
    this._techButton = this.add.image(1280-600, 800-70, "button").setInteractive();
    this._inventoryButton = this.add.image(1280-600+330, 800-157, "button").setInteractive();
    this._attackButton = this.add.image(1280-600, 800-157, "button").setInteractive();
    this._restartButton = this.add.image(1280-600+330, 800-70, "button").setInteractive();
    
    //BUTTON TEXT-----------------------------------------------------------------------------------------------------------------------
    this._attackTextLabel= this.add.text(1280-600, 800-157, "ATTACK", { 
      fontFamily: "Underdog",
      fontSize: 40,
      color: "#ffffff",
     }).setOrigin(0.5).on("pointerover", () => {
      this.buttonTwiin(this._attackTextLabel, 1.1);
     }).on("pointerout", () => {
      this.buttonTwiin(this._attackTextLabel, 1);
     }).on("pointerdown", () => {
      this._click.play();
      const move=this._player.attack(this._boss, this._bossSprite, this._bossHealthBar, this._Mana);
      
    });

    this._techTextLabel= this.add.text(1280-600, 800-70, "MOVESET", { 
      fontFamily: "Underdog",
      fontSize: 40,
      color: "#ffffff",
     }).setOrigin(0.5).on("pointerover", () => {
      this.buttonTwiin(this._techTextLabel, 1.2);
     }).on("pointerout", () => {
      this.buttonTwiin(this._techTextLabel, 1);
     }).on("pointerdown", () => {
      this._click.play();
      const move=this._player.tech();
      this.info(move.nome,move.danno);
      
     });
   
      this._inventoryTextLabel= this.add.text(1280-600+330, 800-157, "INVENTORY", { 
      fontFamily: "Underdog",
      fontSize: 40,
      color: "#ffffff",
     }).setOrigin(0.5).on("pointerover", () => {
      this.buttonTwiin(this._inventoryTextLabel, 1.2);
     }).on("pointerout", () => {
      this.buttonTwiin(this._inventoryTextLabel, 1);
     }).on("pointerdown", () => {
      this._click.play();
      this._player.inventory(this._Mana, this._playerHealthBar);
    });
 
    this._restartTextLabel= this.add.text(1280-600+330, 800-70, "RESTART", { 
      fontFamily: "Underdog",
      fontSize: 40,
      color: "#ffffff",
     }).setOrigin(0.5).on("pointerover", () => {
      this.buttonTwiin(this._restartTextLabel, 1.2);
     }).on("pointerout", () => {
      this.buttonTwiin(this._restartTextLabel, 1);
     })
     .on("pointerdown", () => {
      this._click.play();
      this._music.stop();
      this.scene.stop("Boss01");
      this.scene.start("Boss01");
    }).setInteractive();
}





//UPDATE------------------------------------------------------------------------------------------------------------


update(time: number, delta: number): void {
  
  this._player.update(time,delta, this._boss, this._bossSprite, "fabrizio", 200, "Boss02", 600);

  if (this._player.turn !== this._currentTurn) {
    this._bossattacTurn = true;
    this._currentTurn = this._player.turn; 
    this._animation = true; 

    if (this._player.turn) {
      
      this.sizeUp(this._turnBased, "YOUR TURN", () => {
        this.enablePlayerControls();
      });
    } else {
      
      this.sizeUp(this._turnBased, "BOSS TURN", () => {
        this.disablePlayerControls();
        if(this._bossattacTurn){
          this._player.activeDefence01(this._boss, this._playerHealthBar);
          this._bossattacTurn = false;
        }
        
      });
    }
  }
}

sizeUp(text: Phaser.GameObjects.Text, t: string, onComplete?: () => void): void {
  text.setScale(0);
  text.setText(t);
  text.setVisible(true);

  this.add.tween({
    targets: text,
    scale: 1.5,
    duration: 1000,
    ease: "Power2",
    onComplete: () => {
      this.add.tween({
        targets: text,
        alpha: 0,
        scale: 1,
        duration: 500,
        ease: "Power2",
        onComplete: () => {
          text.setAlpha(1);
          text.setVisible(false);
          this._animation = false; 
          if (onComplete) onComplete(); 
        },
      });
    },
  });
}

enablePlayerControls(): void {
  this._attackTextLabel.setInteractive();
  this._techTextLabel.setInteractive();
  this._inventoryTextLabel.setInteractive();
}

disablePlayerControls(): void {
  this._attackTextLabel.removeInteractive();
  this._techTextLabel.removeInteractive();
  this._inventoryTextLabel.removeInteractive();
}








  buttonTwiin(params: Phaser.GameObjects.Text, x: number): void {
    this.add.tween({
      targets: params,
      scale: x,
      duration: 100,
      ease: "linear",
      repeat: 0,
    });
  }

  info(move:string,dmg:number): void{
    this._infoText.setText(`${move}: ${dmg} damage`);
  }
  
  
}

