import { GameData } from "../GameData";

export default class BossLead extends Phaser.Scene {

  private _TU!: Phaser.GameObjects.Image;
  private _FabIcon!: Phaser.GameObjects.Image;
  private _MalemiaIcon!: Phaser.GameObjects.Image;
  private _AbissManIcon!: Phaser.GameObjects.Image;
  private fuoco!: Phaser.GameObjects.Sprite;

  private _fade!: Phaser.GameObjects.Rectangle;

  private _targetX!: number;
  private _livello!: string;

  constructor() {
    super({ key: "BossLead" });
  }

  create() {

    this.fuoco = this.add
      .sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, "fuoco")
      .setOrigin(0.5)
      .setScale(5);

    this.anims.create({
      key: "ffffAnim",
      frames: this.anims.generateFrameNumbers("fuoco", { start: 0, end: 1 }),
      frameRate: 8,
      repeat: -1,
    });
    this.fuoco.play("ffffAnim");

    this._targetX = this.registry.get("fase");
    this._livello = this.registry.get("level");

    const centerY = this.game.canvas.height / 2;

    this.cameras.main.setBackgroundColor("#f5f5f5");

    // Fade iniziale
    this._fade = this.add
      .rectangle(0, 0, this.game.canvas.width, this.game.canvas.height, 0x000000)
      .setOrigin(0)
      .setDepth(1000)
      .setAlpha(1);

    // Icone boss
    this._FabIcon     = this.add.image(200,  centerY - 100, "FabIcon").setScale(5);
    this._MalemiaIcon = this.add.image(600,  centerY - 100, "MalemiaIcon").setScale(5);
    this._AbissManIcon= this.add.image(1000, centerY - 100, "AbissManIcon").setScale(5);

    // Icona player
    this._TU = this.add.image(200, centerY + 120, "TU").setScale(2.5);

    // Floating morbido
    this.tweens.add({
      targets: this._TU,
      y: this._TU.y - 12,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Fade in poi avvia movimento
    this.tweens.add({
      targets: this._fade,
      alpha: 0,
      duration: 800,
      ease: "Power2",
      onComplete: () => {
        this.time.delayedCall(400, () => {
          this.startMove();
        });
      },
    });
  }

  private startMove(): void {
    // Anticipazione (stretch)
    this.tweens.add({
      targets: this._TU,
      scaleX: 3,
      scaleY: 2,
      duration: 150,
      yoyo: true,
      ease: "Quad.easeOut",
    });

    // Zoom camera leggero
    this.tweens.add({
      targets: this.cameras.main,
      zoom: 1.06,
      duration: 600,
      ease: "Sine.easeInOut",
    });

    this.cameras.main.shake(250, 0.008);

    this.tweens.add({
      targets: this._TU,
      x: this._targetX,
      duration: 1000,
      ease: "Cubic.easeInOut",
      onComplete: () => {
        this.impactMoment();
      },
    });
  }

  private impactMoment(): void {
    const boss = this.getBossByX(this._targetX);

    boss.setTint(0xffffaa);
    this.tweens.add({
      targets: boss,
      scale: 5.5,
      duration: 200,
      yoyo: true,
      ease: "Back.easeOut",
      onComplete: () => {
        boss.clearTint();
      },
    });

    this.cameras.main.flash(250, 255, 255, 255);

    this.time.timeScale = 0.6;
    this.time.delayedCall(200, () => {
      this.time.timeScale = 1;
    });

    this.tweens.add({
      targets: this._TU,
      scale: 3,
      duration: 150,
      yoyo: true,
      ease: "Back.easeOut",
    });

    this.time.delayedCall(700, () => {
      this.fadeAndStart();
    });
  }

  private getBossByX(x: number): Phaser.GameObjects.Image {
    if (x === 200)  return this._FabIcon;
    if (x === 600)  return this._MalemiaIcon;
    return this._AbissManIcon;
  }

  private fadeAndStart(): void {
    this.tweens.add({
      targets: this._fade,
      alpha: 1,
      duration: 800,
      ease: "Power2",
      onComplete: () => {
        // Se stiamo per avviare Boss03 (il boss finale), dopo la battaglia
        // andremo a FilmatoFinale. Qui avviamo normalmente la scena del boss.
        this.scene.start(this._livello);
        this.scene.stop("BossLead");
      },
    });
  }
}