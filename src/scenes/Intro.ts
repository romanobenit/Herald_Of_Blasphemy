export default class Intro extends Phaser.Scene {

  private _background: Phaser.GameObjects.Image;
  private _luna: Phaser.GameObjects.Image;
  private _Title: Phaser.GameObjects.Text;
  private _container: Phaser.GameObjects.Container;

  private _sfondoNero: Phaser.GameObjects.Image;

  //BUTTONS----------------------------------------------------------------------------------------------------------------
  private _startButton: Phaser.GameObjects.Text;
  private _creditsButton: Phaser.GameObjects.Text;
  private _optionsButton: Phaser.GameObjects.Text;

  //PLAYER----------------------------------------------------------------------------------------------------------------
  private _player: Phaser.GameObjects.Sprite;

  //MUSIC----------------------------------------------------------------------------------------------------------------
  private _music: Phaser.Sound.BaseSound;
  private click: Phaser.Sound.BaseSound;



  constructor() {
    super({
      key: "Intro",
    });

  }

  preload() {

  }
  create() {

    this.registry.set("level", "Boss01");
    this.registry.set("fase", 200);

    this.click = this.sound.add("click1", {loop: false});
    this._music = this.sound.add("music", {loop: true});
    this._background = this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, "sfondoMenu").setOrigin(0.5).setScale(5);
    this._luna = this.add.image(100, 100, "Luna").setOrigin(0.5).setScale(2);
    this._Title = this.add.text(this.game.canvas.width/2, 100, "HERALD OF \nBLASPHEMY", {fontSize: "102px", color: "#ffffff", fontFamily:"Underdog"})
    .setOrigin(0.5)
    .setShadow(2, 2, "#000000", 2, true, true)
    .setScale(0);

    this._sfondoNero = this.add.image(0, 0, "sfondoNero").setOrigin(0, 0).setAlpha(0).setDepth(1002);

    //PLAYER----------------------------------------------------------------------------------------------------------------
    this._player = this.add.sprite(150, 550, "player",0).setScale(6).setAlpha(0);
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player", {start: 0, end: 1}),
      frameRate: 1,
      repeat: -1,
    });

    //BUTTONS----------------------------------------------------------------------------------------------------------------
    this._startButton = this.add.text(this.game.canvas.width/2, 500, "Start", {fontSize: "72px", color: "#ffffff", fontFamily:"Underdog"})
    .setShadow(2, 2, "#000000", 2, true, true)
    .setOrigin(0.5).setScale(0)
    .on("pointerover", () => {
      console.log("pointerover");
      this.onTwiin(this._startButton, 1.5);
    })
    .on("pointerout", () => {
      this.onTwiin(this._startButton, 1);
    })
    .on("pointerdown", () => {
      this.click.play();
      this.animationSfondoNero();
    });

    //----------------------------------------------------------------------------------------------------------------
    this._creditsButton = this.add.text(this.game.canvas.width/2, 600, "Credits", {fontSize: "72px", color: "#ffffff", fontFamily:"Underdog"})
    .setShadow(2, 2, "#000000", 2, true, true)
    .setOrigin(0.5).setScale(0)
    .on("pointerover", () => {
      this.onTwiin(this._creditsButton, 1.5);
    })
    .on("pointerout", () => {
      this.onTwiin(this._creditsButton, 1);
    }).on("pointerdown", () => {
      this.click.play();
      this.openCredits();
    });

    //----------------------------------------------------------------------------------------------------------------
    this._optionsButton = this.add.text(this.game.canvas.width/2, 700, "Options", {fontSize: "72px", color: "#ffffff", fontFamily:"Underdog"})
    .setShadow(2, 2, "#000000", 2, true, true)
    .setOrigin(0.5).setScale(0)
    .on("pointerover", () => {
      this.onTwiin(this._optionsButton, 1.5);
    })
    .on("pointerout", () => {
      this.onTwiin(this._optionsButton, 1);
    }).on("pointerdown", () => {
      this.click.play();
      this.openOptions();
    });
    //----------------------------------------------------------------------------------------------------------------

    //ANIMAZIONI----------------------------------------------------------------------------------------------------------------
    let _sfondoNero: Phaser.GameObjects.Image = this.add.image(0, 0, "sfondoNero").setOrigin(0, 0).setAlpha(1).setDepth(1002);
    this.add.tween({
      targets: _sfondoNero,
      alpha: 0,
      duration: 1000,
      ease: "linear",
      onComplete: () => {
        this.add.tween({
          targets: this._Title,
          scale: 1,
          duration: 1000,
          ease: "linear",
          repeat: 0,
          yoyo: false,
          onComplete: () => {
            this.add.tween({
              targets: [this._startButton, this._creditsButton, this._optionsButton],
              scale: 1,
              duration: 1000,
              ease: "linear",
              repeat: 0,
              yoyo: false,
              onComplete: () => {
                this._music.play();
                this._startButton.setInteractive();
                this._creditsButton.setInteractive();
                this._optionsButton.setInteractive();
              }
            });
            this.add.tween({
              targets: this._player,
              alpha: 1,
              duration: 1000,
              ease: "linear",
              repeat: 0,
              yoyo: false,
              onComplete: () => {
                this._player.play("idle");
              }
            });
          }
        });
      },
    });
    

    this._container = this.add.container(0, 0,);
    let layer: Phaser.GameObjects.Image = this.add.image(0, 0, "layer").
    setOrigin(0, 0).
    setInteractive().
    on("pointerdown", () => {
      this.closeCredits();
    });

let _modal: Phaser.GameObjects.Image = this.add.image(1280/2, 800/ 2, "modal").setOrigin(0.5).setInteractive();

let creditLabel: Phaser.GameObjects.Text = this.add.text(1280/2, 200, "Credits").
setOrigin(0.5).setColor("#ffffff").
setFontSize(40).
setFontFamily("Underdog").
setShadow(2, 2, "#000000", 2, false, true);

let description: Phaser.GameObjects.Text = this.add.text(260, 230, "Made by \n Benito & Alessio. \n \n Audio tracks credits: \n \n Intro: Team Compote").
setOrigin(0).
setColor("#ffffff").
setFontSize(20).
setFontFamily("Underdog").
setWordWrapWidth(700);


this._container.add([layer,_modal,creditLabel,description]).setAlpha(0);









  
  }


  


  update(time: number, delta: number): void {

    //LUNA SHAKE----------------------------------------------------------------------------------------------------------------
    this._luna.setPosition(Phaser.Math.Between(90,100), Phaser.Math.Between(90, 100));

  }


  //FUNZIONI----------------------------------------------------------------------------------------------------------------


  closeCredits(){
    let _tween: Phaser.Types.Tweens.TweenBuilderConfig = {
      targets: this._container,
      alpha: 0,
      duration: 500,
  }
  this.tweens.add(_tween);
}

openCredits(){
  let _tween: Phaser.Types.Tweens.TweenBuilderConfig = {
    targets: this._container,
    alpha: 1,
    duration: 500,
  };
  this.tweens.add(_tween);
}

openOptions(){
  let optionsContainer = this.add.container(0, 0).setAlpha(0);

  let layer: Phaser.GameObjects.Image = this.add.image(0, 0, "layer")
    .setOrigin(0, 0)
    .setInteractive()
    .on("pointerdown", () => {
      this.closeOptions(optionsContainer);
    });

  let modal: Phaser.GameObjects.Image = this.add.image(1280 / 2, 800 / 2, "modal")
    .setOrigin(0.5)
    .setScale(0.5)
    .setInteractive();

  let optionsLabel: Phaser.GameObjects.Text = this.add.text(1280 / 2, 305, "Options")
    .setOrigin(0.5)
    .setColor("#ffffff")
    .setFontSize(40)
    .setFontFamily("Underdog")
    .setShadow(2, 2, "#000000", 2, false, true);

  let musicToggleButton: Phaser.GameObjects.Text = this.add.text(1280 / 2, 400, this._music.isPlaying ? "Music: ON" : "Music: OFF")
    .setOrigin(0.5)
    .setColor("#ffffff")
    .setFontSize(30)
    .setFontFamily("Underdog")
    .setInteractive()
    .on("pointerdown", () => {
      let musicOn = this.registry.get("musicOn");
      if (musicOn) {
        this._music.stop();
        musicToggleButton.setText("Music: OFF");
      } else {
        this._music.play();
        musicToggleButton.setText("Music: ON");
      }
      this.registry.set("musicOn", !musicOn);
    });

  optionsContainer.add([layer, modal, optionsLabel, musicToggleButton]);

  let tween: Phaser.Types.Tweens.TweenBuilderConfig = {
    targets: optionsContainer,
    alpha: 1,
    duration: 500,
  };
  this.tweens.add(tween);
}

closeOptions(container: Phaser.GameObjects.Container){
  let tween: Phaser.Types.Tweens.TweenBuilderConfig = {
    targets: container,
    alpha: 0,
    duration: 500,
  };
  this.tweens.add(tween);
}

animationSfondoNero(){
  this.add.tween({
    targets: this._sfondoNero,
    alpha: 1,
    duration: 1000,
    ease: "linear",
    repeat: 0,
    onComplete: () => {
      this._music.stop();
      this.scene.start("BossLead");
      this.scene.stop("Intro");
    },
  });
}


  

  onTwiin(params: Phaser.GameObjects.Text, x: number): void {
    this.add.tween({
      targets: params,
      scale: x,
      duration: 100,
      ease: "linear",
      repeat: 0,
    });
  }

}

/*
if (this.registry.get("musicOn") === undefined) {
    this.registry.set("musicOn", true); // Default to music on
  }

  if (this.registry.get("musicOn")) {
    this._music.play();
  }

*/