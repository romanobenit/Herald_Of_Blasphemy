export default class Intro extends Phaser.Scene {

  private _background: Phaser.GameObjects.Sprite;
  private _Title: Phaser.GameObjects.Text;
  private _container: Phaser.GameObjects.Container;

  private _sfondoNero: Phaser.GameObjects.Image;

  //BUTTONS----------------------------------------------------------------------------------------------------------------
  private _startButton: Phaser.GameObjects.Text;
  private _creditsButton: Phaser.GameObjects.Text;
  private _optionsButton: Phaser.GameObjects.Text;


  //MUSIC----------------------------------------------------------------------------------------------------------------
  private _music: Phaser.Sound.BaseSound;
  private click: Phaser.Sound.BaseSound;
  private _musicText: Phaser.GameObjects.Text;


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

    // DEFAULT SETTINGS
    if (this.registry.get("musicOn") === undefined) {
      this.registry.set("musicOn", true);
    }

    if (this.registry.get("controlMode") === undefined) {
      this.registry.set("controlMode", "WASD");
    }

    if (this.registry.get("musicVolume") === undefined) {
      this.registry.set("musicVolume", 1);
    }

    // Ripristina il volume globale salvato
    this.sound.volume = this.registry.get("musicVolume");

    this.click = this.sound.add("click1", { loop: false });
    this._music = this.sound.add("music", { loop: true });

    this._musicText = this.add.text(1250, 800, "Music provided by Team Compote - Amillusion", { fontSize: "12px", color: "#ffffff", fontFamily: "Underdog" })
      .setOrigin(1)
      .setDepth(1001);

    this._background = this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, "fullSfondo").setOrigin(0.5).setScale(5);
    this.anims.create({
      key: "bgAnim",
      frames: this.anims.generateFrameNumbers("fullSfondo", { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1
    });
    this._background.play("bgAnim");

    this._Title = this.add.text(this.game.canvas.width / 2, 100, "VILLE ENFEU", { fontSize: "95px", color: "#ffffff", fontFamily: "Underdog" })
      .setOrigin(0.5)
      .setShadow(2, 2, "#000000", 2, true, true)
      .setScale(0);

    this._sfondoNero = this.add.image(0, 0, "sfondoNero").setOrigin(0, 0).setAlpha(0).setDepth(1002);

    //BUTTONS----------------------------------------------------------------------------------------------------------------
    this._startButton = this.add.text(this.game.canvas.width / 2, 500, "Start", { fontSize: "72px", color: "#ffffff", fontFamily: "Underdog" })
      .setShadow(2, 2, "#000000", 2, true, true)
      .setOrigin(0.5).setScale(0)
      .on("pointerover", () => {
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
    this._creditsButton = this.add.text(this.game.canvas.width / 2, 600, "Credits", { fontSize: "72px", color: "#ffffff", fontFamily: "Underdog" })
      .setShadow(2, 2, "#000000", 2, true, true)
      .setOrigin(0.5).setScale(0)
      .on("pointerover", () => {
        this.onTwiin(this._creditsButton, 1.5);
      })
      .on("pointerout", () => {
        this.onTwiin(this._creditsButton, 1);
      })
      .on("pointerdown", () => {
        this.click.play();
        this.openCredits();
      });

    //----------------------------------------------------------------------------------------------------------------
    this._optionsButton = this.add.text(this.game.canvas.width / 2, 700, "Options", { fontSize: "72px", color: "#ffffff", fontFamily: "Underdog" })
      .setShadow(2, 2, "#000000", 2, true, true)
      .setOrigin(0.5).setScale(0)
      .on("pointerover", () => {
        this.onTwiin(this._optionsButton, 1.5);
      })
      .on("pointerout", () => {
        this.onTwiin(this._optionsButton, 1);
      })
      .on("pointerdown", () => {
        this.click.play();
        this.openOptions();
      });

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
                if (this.registry.get("musicOn")) {
                  this._music.play();
                }
                this._startButton.setInteractive();
                this._creditsButton.setInteractive();
                this._optionsButton.setInteractive();
              }
            });
          }
        });
      },
    });

    this._container = this.add.container(0, 0);
    let layer: Phaser.GameObjects.Image = this.add.image(0, 0, "layer")
      .setOrigin(0, 0)
      .setInteractive()
      .on("pointerdown", () => {
        this.closeCredits();
      });

    let _modal: Phaser.GameObjects.Image = this.add.image(1280 / 2, 800 / 2, "modal").setOrigin(0.5).setInteractive();

    let creditLabel: Phaser.GameObjects.Text = this.add.text(1280 / 2, 200, "Credits")
      .setOrigin(0.5)
      .setColor("#ffffff")
      .setFontSize(40)
      .setFontFamily("Underdog")
      .setShadow(2, 2, "#000000", 2, false, true);

    let description: Phaser.GameObjects.Text = this.add.text(260, 230, "Made by \n Benito Romano: Graphic Designer & programmer \n Alessio Moscardino: Sound manager & programmer  \n Daniele Sannino: Programmer & bug fixer \n Luca Paparo: Tester \n Ciro Tarantino: Web developer \n \n Audio tracks credits: \n \n Music provided by Team Compote - Amillusion")
      .setOrigin(0)
      .setColor("#ffffff")
      .setFontSize(20)
      .setFontFamily("Underdog")
      .setWordWrapWidth(700);

    this._container.add([layer, _modal, creditLabel, description]).setAlpha(0);

  }


  update(time: number, delta: number): void {

  }


  //FUNZIONI----------------------------------------------------------------------------------------------------------------

  closeCredits() {
    let _tween: Phaser.Types.Tweens.TweenBuilderConfig = {
      targets: this._container,
      alpha: 0,
      duration: 500,
    }
    this.tweens.add(_tween);
  }

  openCredits() {
    let _tween: Phaser.Types.Tweens.TweenBuilderConfig = {
      targets: this._container,
      alpha: 1,
      duration: 500,
    };
    this.tweens.add(_tween);
  }

  openOptions() {
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

    // MUSIC TOGGLE
    let musicToggleButton: Phaser.GameObjects.Text = this.add.text(1280 / 2, 370, this._music.isPlaying ? "Music: ON" : "Music: OFF")
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

    // VOLUME BAR ------------------------------------------------
    let currentVolume: number = this.registry.get("musicVolume");

    const BAR_X = 1280 / 2 - 100;
    const BAR_Y = 430;
    const BAR_WIDTH = 200;
    const BAR_HEIGHT = 16;
    const STEPS = 10;

    let volumeLabel: Phaser.GameObjects.Text = this.add.text(1280 / 2, BAR_Y - 22, "Volume")
      .setOrigin(0.5)
      .setColor("#ffffff")
      .setFontSize(22)
      .setFontFamily("Underdog")
      .setShadow(2, 2, "#000000", 2, false, true);

    // Sfondo barra (grigio scuro)
    let barBg: Phaser.GameObjects.Rectangle = this.add.rectangle(
      BAR_X, BAR_Y, BAR_WIDTH, BAR_HEIGHT, 0x444444
    ).setOrigin(0, 0);

    // Riempimento barra (bianco)
    let barFill: Phaser.GameObjects.Rectangle = this.add.rectangle(
      BAR_X, BAR_Y, BAR_WIDTH * currentVolume, BAR_HEIGHT, 0xffffff
    ).setOrigin(0, 0);

    // Freccia sinistra ◄
    let arrowLeft: Phaser.GameObjects.Text = this.add.text(BAR_X - 30, BAR_Y - 4, "◄")
      .setColor("#ffffff")
      .setFontSize(22)
      .setFontFamily("Underdog")
      .setInteractive()
      .on("pointerover", () => arrowLeft.setColor("#ffff00"))
      .on("pointerout", () => arrowLeft.setColor("#ffffff"))
      .on("pointerdown", () => adjustVolume(-1));

    // Freccia destra ►
    let arrowRight: Phaser.GameObjects.Text = this.add.text(BAR_X + BAR_WIDTH + 8, BAR_Y - 4, "►")
      .setColor("#ffffff")
      .setFontSize(22)
      .setFontFamily("Underdog")
      .setInteractive()
      .on("pointerover", () => arrowRight.setColor("#ffff00"))
      .on("pointerout", () => arrowRight.setColor("#ffffff"))
      .on("pointerdown", () => adjustVolume(1));

    // Aggiorna volume globale (tutti i suoni del gioco)
    const adjustVolume = (direction: number) => {
      currentVolume = Phaser.Math.Clamp(
        Math.round((currentVolume + direction * (1 / STEPS)) * STEPS) / STEPS,
        0, 1
      );
      this.registry.set("musicVolume", currentVolume);
      this.sound.volume = currentVolume; // Master volume globale
      barFill.setSize(BAR_WIDTH * currentVolume, BAR_HEIGHT);
      this.click.play();
    };

    // Tasti freccia da tastiera (LEFT / RIGHT)
    const keyLeft = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    const keyRight = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    const onKeyLeft = () => adjustVolume(-1);
    const onKeyRight = () => adjustVolume(1);

    keyLeft.on("down", onKeyLeft);
    keyRight.on("down", onKeyRight);

    // Cleanup: rimuove i listener quando il container viene distrutto
    optionsContainer.once("destroy", () => {
      keyLeft.off("down", onKeyLeft);
      keyRight.off("down", onKeyRight);
      this.input.keyboard!.removeKey(keyLeft);
      this.input.keyboard!.removeKey(keyRight);
    });

    // CONTROL TOGGLE BUTTON
    let controlToggleButton: Phaser.GameObjects.Text = this.add.text(
      1280 / 2,
      490,
      "Controls: " + this.registry.get("controlMode")
    )
      .setOrigin(0.5)
      .setColor("#ffffff")
      .setFontSize(30)
      .setFontFamily("Underdog")
      .setInteractive()
      .on("pointerdown", () => {
        let currentMode = this.registry.get("controlMode");
        if (currentMode === "WASD") {
          this.registry.set("controlMode", "ARROWS");
          controlToggleButton.setText("Controls: ARROWS");
        } else {
          this.registry.set("controlMode", "WASD");
          controlToggleButton.setText("Controls: WASD");
        }
      });

    optionsContainer.add([layer, modal, optionsLabel, musicToggleButton, volumeLabel, barBg, barFill, arrowLeft, arrowRight, controlToggleButton]);

    let tween: Phaser.Types.Tweens.TweenBuilderConfig = {
      targets: optionsContainer,
      alpha: 1,
      duration: 500,
    };
    this.tweens.add(tween);
  }

  closeOptions(container: Phaser.GameObjects.Container) {
    let tween: Phaser.Types.Tweens.TweenBuilderConfig = {
      targets: container,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        container.destroy();
      }
    };
    this.tweens.add(tween);
  }

  animationSfondoNero() {
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