import { GameData } from "../GameData";
import Player from "../GameObject/player";

export default class Boss03 extends Phaser.Scene {
  private _player: Player;
  private _playerSprite: Phaser.GameObjects.Sprite;

  private _boss: Player;
  private _bossSprite: Phaser.GameObjects.Sprite;
  private _sfondo: Phaser.GameObjects.Image;

  //BUTTONS
  private _attackButton: Phaser.GameObjects.Image;
  private _techButton: Phaser.GameObjects.Image;
  private _inventoryButton: Phaser.GameObjects.Image;
  private _restartButton: Phaser.GameObjects.Image;
  private _exitButton: Phaser.GameObjects.Rectangle;
  private _exitTextLabel: Phaser.GameObjects.Text;
  private _confirmBox: Phaser.GameObjects.Rectangle;
  private _confirmText: Phaser.GameObjects.Text;
  private _yesText: Phaser.GameObjects.Text;
  private _noText: Phaser.GameObjects.Text;
  private _attackTextLabel: Phaser.GameObjects.Text;
  private _techTextLabel: Phaser.GameObjects.Text;
  private _inventoryTextLabel: Phaser.GameObjects.Text;
  private _restartTextLabel: Phaser.GameObjects.Text;

  // HUD powerup
  private _shieldHUD: Phaser.GameObjects.Text;
  private _talismanHUD: Phaser.GameObjects.Text;

  //HEALTH BARS
  private _playerHealthBar: Phaser.GameObjects.Graphics;
  private _bossHealthBar: Phaser.GameObjects.Graphics;

  //MANA BAR
  private _playerManaBar: Phaser.GameObjects.Graphics;

  //INTERFACE
  private _turnBased: Phaser.GameObjects.Text;

  //TEXT GUI
  private _textGUI: Phaser.GameObjects.Image;
  private _infoText: Phaser.GameObjects.Text;
  private _Mana: Phaser.GameObjects.Text;

  //MUSIC
  private _music: Phaser.Sound.BaseSound;
  private _click: Phaser.Sound.BaseSound;

  //Logic
  private _animation: boolean = false;
  private _fightEnded: boolean = false;
  private _currentTurn: boolean | null = null;
  private _bossattacTurn: boolean = true;

  constructor() {
    super({ key: "Boss03" });
  }

  init() {}
  preload() {}

  create() {
    // RESET STATI
    this._fightEnded = false;
    this._animation = false;
    this._currentTurn = null;
    this._bossattacTurn = true;
    this._confirmBox = null;
    this._confirmText = null;
    this._yesText = null;
    this._noText = null;

    // MUSIC
    this._click = this.sound.add("click2");
    this._music = this.sound.add("boss3", { loop: true });
    if (this.registry.get("musicOn") === undefined) this.registry.set("musicOn", true);
    if (this.registry.get("musicOn")) this._music.play();

    // PLAYER
    this._player = new Player(
      { scene: this, x: 100, y: 100, key: "player" },
      "Death Deluxe", 600, 600, 10, 10,
      [
        { nome: "Holy prayer",     danno: 25,  costo: 1 },
        { nome: "Gabriel's Smite", danno: 45,  costo: 2 },
        { nome: "Judas's Kiss",    danno: 75,  costo: 3 },
        { nome: "God's Touch",     danno: 390, costo: 5 },
      ]
    );

    this._playerSprite = this.add.sprite(300, 550, "player", 0).setDepth(1).setScale(5);
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 1 }),
      frameRate: 1,
      repeat: -1,
    });

    // INTERFACE
    this._turnBased = this.add.text(1280 / 2, 400, "YOUR TURN", {
      fontFamily: "Underdog", fontSize: 70, color: "#ffffff",
      stroke: "#000000", strokeThickness: 6,
    }).setOrigin(0.5).setDepth(1002).setScale(1).setVisible(false);

    this._player.turn = true;
    this._player._vittoria = false;

    // BOSS
    this._boss = new Player(
      { scene: this, x: 100, y: 100, key: "abyssman" },
      "abyssman", 600, 600, 100, 100,
      [{ nome: "croce destroyer", danno: 185, costo: 1 }]
    );

    this._bossSprite = this.add.sprite(900, 210, "abyssman", 0).setScale(3).setDepth(1);
    this.anims.create({
      key: "idleC3",
      frames: this.anims.generateFrameNumbers("abyssman", { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1,
    });

    // SFONDO
    this._sfondo = this.add.image(0, 0, "sfondoBoss03").setOrigin(0, 0).setDepth(0).setScale(5);
    const _sfondoNero = this.add.image(0, 0, "sfondoNero").setOrigin(0, 0).setAlpha(1).setDepth(1002);
    this.add.tween({
      targets: _sfondoNero, alpha: 0, duration: 1000, ease: "Power2",
      onComplete: () => {
        this._playerSprite.play("idle");
        this._bossSprite.play("idleC3");
      },
    });

    // HEALTH BARS
    this.add.text(550, 500, "TU",       { fontFamily: "Underdog", fontSize: 40, color: "#770000" }).setDepth(1000);
    this.add.text(20,  10,  "Abyssman", { fontFamily: "Underdog", fontSize: 40, color: "#770000" }).setDepth(1000);

    this._playerHealthBar = this.add.graphics();
    this._playerHealthBar
      .fillStyle(0x770000, 1).fillRoundedRect(550, 550, 600, 20, 10)
      .lineStyle(4, 0x000000, 1).strokeRoundedRect(550, 550, 600, 20, 10)
      .setDepth(1000);

    this._bossHealthBar = this.add.graphics();
    this._bossHealthBar
      .fillStyle(0x770000, 1).fillRoundedRect(20, 50, 600, 20, 10)
      .lineStyle(4, 0x000000, 1).strokeRoundedRect(20, 50, 600, 20, 10)
      .setDepth(1000);

    // MANA BAR
    this.add.text(550, 578, "MANA", {
      fontFamily: "Underdog", fontSize: 18, color: "#4488ff",
    }).setDepth(1000);

    this._playerManaBar = this.add.graphics();
    this._drawManaBar();

    // TEXT GUI
    this._textGUI = this.add.image(320, 150, "GUI");
    this._infoText = this.add.text(320, 130, " ", {
      fontFamily: "Underdog", fontSize: 20, color: "#ffffff",
    }).setOrigin(0.5).setDepth(1001);

    // _Mana nascosto — usato internamente da Player
    this._Mana = this.add
      .text(-9999, -9999, this._player.Mana.toString(), { fontSize: "1px" })
      .setAlpha(0).setDepth(-1);

    // HUD SCUDO
    this._shieldHUD = this.add.text(610, 510, "🛡 SHIELD READY", {
      fontFamily: "Underdog", fontSize: 18, color: "#44aaff",
      stroke: "#001133", strokeThickness: 4,
    }).setDepth(1001).setVisible(false);

    // HUD TALISMANO
    this._talismanHUD = this.add.text(610, 510, "✦ TALISMANO ATTIVO", {
      fontFamily: "Underdog", fontSize: 18, color: "#ffdd00",
      stroke: "#332200", strokeThickness: 4,
    }).setDepth(1001).setVisible(false);

    // BUTTONS (immagini)
    this._techButton      = this.add.image(1280 - 600,       800 - 70,  "button").setInteractive();
    this._inventoryButton = this.add.image(1280 - 600 + 330, 800 - 157, "button").setInteractive();
    this._attackButton    = this.add.image(1280 - 600,       800 - 157, "button").setInteractive();
    this._restartButton   = this.add.image(1280 - 600 + 330, 800 - 70,  "button").setInteractive();

    // ATTACK
    this._attackTextLabel = this.add
      .text(1280 - 600, 800 - 157, "ATTACK", {
        fontFamily: "Underdog", fontSize: 40, color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerover", () => { this.buttonTwiin(this._attackTextLabel, 1.1); })
      .on("pointerout",  () => { this.buttonTwiin(this._attackTextLabel, 1); })
      .on("pointerdown", () => {
        this._click.play();
        // Se il talismano è attivo usa attackWithTalisman, altrimenti attacco normale
        if (this._player.talismanActive) {
          this._player.attackWithTalisman(this._boss, this._bossSprite, this._bossHealthBar, this._Mana);
        } else {
          this._player.attack(this._boss, this._bossSprite, this._bossHealthBar, this._Mana);
        }
        this._drawManaBar();
      });

    // MOVESET
    this._techTextLabel = this.add
      .text(1280 - 600, 800 - 70, "MOVESET", {
        fontFamily: "Underdog", fontSize: 40, color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerover", () => { this.buttonTwiin(this._techTextLabel, 1.2); })
      .on("pointerout",  () => { this.buttonTwiin(this._techTextLabel, 1); })
      .on("pointerdown", () => {
        this._click.play();
        const move = this._player.tech();
        this.info(move.nome, move.danno);
      });

    // INVENTORY
    this._inventoryTextLabel = this.add
      .text(1280 - 600 + 330, 800 - 157, "INVENTORY", {
        fontFamily: "Underdog", fontSize: 40, color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerover", () => { this.buttonTwiin(this._inventoryTextLabel, 1.2); })
      .on("pointerout",  () => { this.buttonTwiin(this._inventoryTextLabel, 1); })
      .on("pointerdown", () => {
        this._click.play();
        // Usa inventoryBoss03 che include anche il talismano
        this._player.inventoryBoss03(this._Mana, this._playerHealthBar, this._bossHealthBar, this._boss);
        this._drawManaBar();
      });

    // RESTART
    this._restartTextLabel = this.add
      .text(1280 - 600 + 330, 800 - 70, "RESTART", {
        fontFamily: "Underdog", fontSize: 40, color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerover", () => { this.buttonTwiin(this._restartTextLabel, 1.2); })
      .on("pointerout",  () => { this.buttonTwiin(this._restartTextLabel, 1); })
      .on("pointerdown", () => {
        this._click.play();
        this._music.stop();
        this.scene.stop("Boss03");
        this.scene.start("Boss03");
      });

    // EXIT BUTTON
    const margin = 30;
    const size   = 40;

    this._exitButton = this.add
      .rectangle(1280 - margin - size / 2, margin + size / 2, size, size, 0x000000, 0.6)
      .setStrokeStyle(2, 0xffffff).setDepth(1001)
      .setInteractive({ useHandCursor: true });

    this._exitTextLabel = this.add
      .text(1280 - margin - size / 2, margin + size / 2, "X", {
        fontFamily: "Underdog", fontSize: size * 0.9 + "px", color: "#ffffff",
      })
      .setOrigin(0.5).setDepth(1002);

    this._exitButton
      .on("pointerover",  () => { this._exitButton.setFillStyle(0xffffff, 0.2); this._exitTextLabel.setColor("#ff5555"); })
      .on("pointerout",   () => { this._exitButton.setFillStyle(0x000000, 0.6); this._exitTextLabel.setColor("#ffffff"); })
      .on("pointerdown",  () => { this._click.play(); this.showExitConfirm(); });
  }

  // UPDATE
  update(time: number, delta: number): void {
    if (this._fightEnded) return;

    this._player.update(time, delta, this._boss, this._bossSprite, "abyssman", 0, "Intro", 0);
    this._drawManaBar();

    // HUD scudo
    if (this._player.shieldUsed) {
      this._shieldHUD.setText("🛡 SHIELD USED").setColor("#555555").setVisible(true);
    } else if (this._player.shieldActive) {
      this._shieldHUD.setText("🛡 SHIELD READY").setColor("#44aaff").setVisible(true);
    } else {
      this._shieldHUD.setVisible(false);
    }

    // HUD talismano
    this._talismanHUD.setVisible(this._player.talismanActive);

    if (this._boss.Vita <= 0 || this._player.Vita <= 0) {
      this._fightEnded = true;
      this._turnBased.setVisible(false);
      return;
    }

    if (this._player.turn !== this._currentTurn) {
      this._bossattacTurn = true;
      this._currentTurn = this._player.turn;
      this._animation = true;

      if (this._player.turn) {
        this.sizeUp(this._turnBased, "YOUR TURN", () => { this.enablePlayerControls(); });
      } else {
        this.sizeUp(this._turnBased, "BOSS TURN", () => {
          this.disablePlayerControls();
          if (this._bossattacTurn) {
            this._player.activeDefence03(this._boss, this._playerHealthBar);
            this._bossattacTurn = false;
          }
        });
      }
    }
  }

  // MANA BAR
  private _drawManaBar(): void {
    if (!this._playerManaBar || !this._player) return;
    const maxWidth  = 600;
    const ratio     = Math.max(0, Math.min(1, this._player.Mana / this._player.maxMana));
    const fillWidth = maxWidth * ratio;

    this._playerManaBar.clear();
    this._playerManaBar
      .fillStyle(0x111133, 1).fillRoundedRect(550, 580, maxWidth, 20, 10)
      .lineStyle(4, 0x000000, 1).strokeRoundedRect(550, 580, maxWidth, 20, 10);

    if (fillWidth > 0) {
      this._playerManaBar.fillStyle(0x0055ff, 1).fillRoundedRect(550, 580, fillWidth, 20, 10);
    }

    this._playerManaBar.setDepth(1000);
  }

  // CONFIRM BOX
  private showExitConfirm(): void {
    if (this._confirmBox) return;

    this._confirmBox = this.add
      .rectangle(1280 / 2, 800 / 2, 500, 300, 0x000000, 0.8).setDepth(2000);

    this._confirmText = this.add
      .text(1280 / 2, 800 / 2 - 60, "TORNARE AL MENU?", {
        fontFamily: "Underdog", fontSize: 40, color: "#ffffff",
      }).setOrigin(0.5).setDepth(2001);

    this._yesText = this.add
      .text(1280 / 2 - 100, 800 / 2 + 60, "SI", {
        fontFamily: "Underdog", fontSize: 40, color: "#00ff00",
      }).setOrigin(0.5).setDepth(2001).setInteractive()
      .on("pointerdown", () => {
        this._music.stop();
        this.scene.stop("Boss03");
        this.scene.start("Intro");
      });

    this._noText = this.add
      .text(1280 / 2 + 100, 800 / 2 + 60, "NO", {
        fontFamily: "Underdog", fontSize: 40, color: "#ff0000",
      }).setOrigin(0.5).setDepth(2001).setInteractive()
      .on("pointerdown", () => { this.closeExitConfirm(); });
  }

  private closeExitConfirm(): void {
    if (!this._confirmBox) return;
    this._confirmBox.destroy();
    this._confirmText.destroy();
    this._yesText.destroy();
    this._noText.destroy();
    this._confirmBox = null;
    this._confirmText = null;
    this._yesText = null;
    this._noText = null;
  }

  sizeUp(text: Phaser.GameObjects.Text, t: string, onComplete?: () => void): void {
    text.setScale(0);
    text.setText(t);
    text.setVisible(true);

    this.add.tween({
      targets: text, scale: 1.5, duration: 1000, ease: "Power2",
      onComplete: () => {
        this.add.tween({
          targets: text, alpha: 0, scale: 1, duration: 500, ease: "Power2",
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

  public endFight(): void {
    this._fightEnded = true;
    this._turnBased.setVisible(false);
    this.disablePlayerControls();
  }

  buttonTwiin(params: Phaser.GameObjects.Text, x: number): void {
    this.add.tween({
      targets: params, scale: x, duration: 100, ease: "linear", repeat: 0,
    });
  }

  info(move: string, dmg: number): void {
    this._infoText.setText(`${move}: ${dmg} damage`);
  }
}