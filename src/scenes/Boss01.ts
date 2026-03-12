import { GameData } from "../GameData";
import Player from "../GameObject/player";

export default class Boss01 extends Phaser.Scene {
  private _player: Player;
  private _playerSprite: Phaser.GameObjects.Sprite;

  private _boss: Player;
  private _bossSprite: Phaser.GameObjects.Sprite;
  private _sfondo: Phaser.GameObjects.Image;

  //BUTTONS
  private _attackButton: Phaser.GameObjects.Image;
  private _techButton: Phaser.GameObjects.Image;
  private _inventoryButton: Phaser.GameObjects.Image;
  private _evolutionButton: Phaser.GameObjects.Image;

  private _attackTextLabel: Phaser.GameObjects.Text;
  private _techTextLabel: Phaser.GameObjects.Text;
  private _inventoryTextLabel: Phaser.GameObjects.Text;
  private _evolutionTextLabel: Phaser.GameObjects.Text;
  private _exitButton: Phaser.GameObjects.Rectangle;
  private _exitTextLabel: Phaser.GameObjects.Text;

  // Confirm box exit
  private _confirmBox: Phaser.GameObjects.Rectangle;
  private _confirmText: Phaser.GameObjects.Text;
  private _yesText: Phaser.GameObjects.Text;
  private _noText: Phaser.GameObjects.Text;

  //HEALTH BAR
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

  // FASE LABEL
  private _faseLabel: Phaser.GameObjects.Text;

  //MUSIC
  private _music: Phaser.Sound.BaseSound;
  private _click: Phaser.Sound.BaseSound;

  //Logic
  private _animation: boolean = false;
  private _fightEnded: boolean = false;
  private _bossTurnActive: boolean = false;
  private _currentTurn: boolean | null = null;
  private _bossattacTurn: boolean = true;
  private _evolutionPopupOpen: boolean = false;

  // EVOLUTION SYSTEM
  private _turnCount: number = 0;
  private _evolutionPhase: number = 1; // 1, 2, 3
  private _evolutionUnlocked: boolean = false;
  private _evo2Unlocked: boolean = false;
  private _evolutionGlowTween: Phaser.Tweens.Tween | null = null;
  private _screenShaking: boolean = false;

  constructor() {
    super({ key: "Boss01" });
  }

  init() {}

  preload() {}

  create() {
    // RESET
    this._fightEnded = false;
    this._bossTurnActive = false;
    this._animation = false;
    this._currentTurn = null;
    this._bossattacTurn = true;
    this._confirmBox = null;
    this._confirmText = null;
    this._yesText = null;
    this._noText = null;
    this._turnCount = 0;
    this._evolutionPhase = 1;
    this._evolutionUnlocked = false;
    this._evo2Unlocked = false;
    this._evolutionGlowTween = null;
    this._screenShaking = false;
    this._evolutionPopupOpen = false;

    // MUSIC
    this._click = this.sound.add("click2");
    this._music = this.sound.add("boss", { loop: true });
    if (this.registry.get("musicOn") === undefined) this.registry.set("musicOn", true);
    if (this.registry.get("musicOn")) this._music.play();

    // PLAYER — fase 1 mosse base
    this._player = new Player(
      { scene: this, x: 100, y: 100, key: "player" },
      "Death Deluxe", 600, 600, 10, 10,
      [
        { nome: "punch",        danno: 30,  costo: 0 },
        { nome: "smite",        danno: 60,  costo: 1 },
        { nome: "large slayer", danno: 140, costo: 2 },
      ]
    );

    this._playerSprite = this.add.sprite(300, 550, "player", 0).setDepth(1).setScale(5);
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 1 }),
      frameRate: 1,
      repeat: -1,
    });
    this.anims.create({
      key: "idle2",
      frames: this.anims.generateFrameNumbers("player2", { start: 0, end: 1 }),
      frameRate: 1,
      repeat: -1,
    });
    this.anims.create({
      key: "idle3",
      frames: this.anims.generateFrameNumbers("player3", { start: 0, end: 1 }),
      frameRate: 1,
      repeat: -1,
    });

    this._turnBased = this.add
      .text(1280 / 2, 400, "YOUR TURN", {
        fontFamily: "Underdog", fontSize: 70, color: "#ffffff",
        stroke: "#000000", strokeThickness: 6,
      })
      .setOrigin(0.5).setDepth(1002).setScale(1).setVisible(false);

    this._player.turn = true;
    this._player._vittoria = false;

    // BOSS
    this._boss = new Player(
      { scene: this, x: 100, y: 100, key: "fabrizio" },
      "Fabrizio", 600, 600, 100, 100,
      [{ nome: "axe smite", danno: 123, costo: 1 }]
    );

    this._bossSprite = this.add.sprite(900, 250, "fabrizio", 0).setScale(4).setDepth(1);
    this.anims.create({
      key: "idleC",
      frames: this.anims.generateFrameNumbers("fabrizio", { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1,
    });

    // BACKGROUND
    this._sfondo = this.add.image(0, 0, "sfondoBoss01").setOrigin(0, 0).setDepth(0).setScale(5);
    const _sfondoNero = this.add.image(0, 0, "sfondoNero").setOrigin(0, 0).setAlpha(1).setDepth(1002);
    this.add.tween({
      targets: _sfondoNero, alpha: 0, duration: 1000, ease: "Power2",
      onComplete: () => {
        this._playerSprite.play("idle");
        this._bossSprite.play("idleC");
      },
    });

    // HEALTH BARS
    this.add.text(550, 470, "TU",       { fontFamily: "Underdog", fontSize: 40, color: "#770000" }).setDepth(1000);
    this.add.text(20,  10,  "Fabrizio", { fontFamily: "Underdog", fontSize: 40, color: "#770000" }).setDepth(1000);

    this._playerHealthBar = this.add.graphics();
    this._drawPlayerHealthBar();

    this._bossHealthBar = this.add.graphics();
    this._bossHealthBar
      .fillStyle(0x770000, 1).fillRoundedRect(20, 50, 600, 20, 10)
      .lineStyle(4, 0x000000, 1).strokeRoundedRect(20, 50, 600, 20, 10)
      .setDepth(1000);

    // FASE LABEL
    this._faseLabel = this.add.text(550, 532, "[ FASE 1 ]", {
      fontFamily: "Underdog", fontSize: 16, color: "#ffaa00",
      stroke: "#000000", strokeThickness: 3,
    }).setDepth(1001);

    // MANA BAR
    this.add.text(550, 556, "MANA", {
      fontFamily: "Underdog", fontSize: 18, color: "#4488ff",
    }).setDepth(1000);

    this._playerManaBar = this.add.graphics();
    this._drawManaBar();

    // TEXT GUI
    this._textGUI = this.add.image(320, 150, "GUI");
    this._infoText = this.add
      .text(320, 130, " ", { fontFamily: "Underdog", fontSize: 20, color: "#ffffff" })
      .setOrigin(0.5).setDepth(1001);

    this._Mana = this.add
      .text(-9999, -9999, this._player.Mana.toString(), { fontSize: "1px" })
      .setAlpha(0).setDepth(-1);

    // BUTTONS
    this._techButton      = this.add.image(1280 - 600,       800 - 70,  "button").setInteractive();
    this._inventoryButton = this.add.image(1280 - 600 + 330, 800 - 157, "button").setInteractive();
    this._attackButton    = this.add.image(1280 - 600,       800 - 157, "button").setInteractive();
    this._evolutionButton = this.add.image(1280 - 600 + 330, 800 - 70,  "button").setInteractive();

    // ATTACK
    this._attackTextLabel = this.add
      .text(1280 - 600, 800 - 157, "ATTACK", { fontFamily: "Underdog", fontSize: 40, color: "#ffffff" })
      .setOrigin(0.5).setInteractive()
      .on("pointerover", () => { this.buttonTwiin(this._attackTextLabel, 1.1); })
      .on("pointerout",  () => { this.buttonTwiin(this._attackTextLabel, 1); })
      .on("pointerdown", () => {
        this._click.play();
        this._player.attack(this._boss, this._bossSprite, this._bossHealthBar, this._Mana);
        this._drawManaBar();
        this._onPlayerAction();
      });

    // MOVESET
    this._techTextLabel = this.add
      .text(1280 - 600, 800 - 70, "MOVESET", { fontFamily: "Underdog", fontSize: 40, color: "#ffffff" })
      .setOrigin(0.5).setInteractive()
      .on("pointerover", () => { this.buttonTwiin(this._techTextLabel, 1.2); })
      .on("pointerout",  () => { this.buttonTwiin(this._techTextLabel, 1); })
      .on("pointerdown", () => {
        this._click.play();
        const move = this._player.tech();
        this.info(move.nome, move.danno);
      });

    // INVENTORY
    this._inventoryTextLabel = this.add
      .text(1280 - 600 + 330, 800 - 157, "INVENTORY", { fontFamily: "Underdog", fontSize: 40, color: "#ffffff" })
      .setOrigin(0.5).setInteractive()
      .on("pointerover", () => { this.buttonTwiin(this._inventoryTextLabel, 1.2); })
      .on("pointerout",  () => { this.buttonTwiin(this._inventoryTextLabel, 1); })
      .on("pointerdown", () => {
        this._click.play();
        this._callInventory();
        this._drawManaBar();
      });

    // EVOLUTION BUTTON — inizialmente bloccato
    this._evolutionTextLabel = this.add
      .text(1280 - 600 + 330, 800 - 70, "EVOLUTION", { fontFamily: "Underdog", fontSize: 33, color: "#555555" })
      .setOrigin(0.5)
      .on("pointerover", () => {
        if (this._evolutionUnlocked || this._evo2Unlocked) this.buttonTwiin(this._evolutionTextLabel, 1.2);
      })
      .on("pointerout", () => {
        if (this._evolutionUnlocked || this._evo2Unlocked) this.buttonTwiin(this._evolutionTextLabel, 1);
      })
      .on("pointerdown", () => {
        if (!this._evolutionUnlocked && !this._evo2Unlocked) return;
        this._click.play();
        this._showEvolutionPopup();
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

  // ─── UPDATE ──────────────────────────────────────────────────────────────
  update(time: number, delta: number): void {
    if (this._fightEnded) return;

    this._player.update(time, delta, this._boss, this._bossSprite, "fabrizio", 200, "Boss02", 600);
    this._drawManaBar();
    this._drawPlayerHealthBar();
    this._updateScreenShake();

    if (this._boss.Vita <= 0 || this._player.Vita <= 0) {
      this._fightEnded = true;
      this._turnBased.setVisible(false);
      return;
    }

    if (this._player.turn !== this._currentTurn) {
      this._currentTurn = this._player.turn;
      this._animation = true;

      if (this._player.turn) {
        this._turnCount++;
        this._checkEvolutionUnlock();
        this.sizeUp(this._turnBased, "YOUR TURN", () => { this.enablePlayerControls(); });
        this._bossTurnActive = false;
      } else {
        if (!this._bossTurnActive) {
          this._bossTurnActive = true;
          this.sizeUp(this._turnBased, "BOSS TURN", () => {
            this.disablePlayerControls();
            this._player.activeDefence01(this._boss, this._playerHealthBar);
          });
        }
      }
    }
  }

  // ─── PLAYER HEALTH BAR — colore dinamico ────────────────────────────────
  private _drawPlayerHealthBar(): void {
    if (!this._playerHealthBar || !this._player) return;
    const maxWidth = 600;
    const ratio    = Math.max(0, Math.min(1, this._player.Vita / this._player.maxVita));
    const fillW    = maxWidth * ratio;

    // Colore: verde → rosso → rosso scuro → rosso quasi nero
    let r: number, g: number, b: number;
    if (ratio > 0.5) {
      // Da verde (0,170,0) a rosso (170,0,0)
      const t = (ratio - 0.5) / 0.5;
      r = Math.floor(170 * (1 - t));
      g = Math.floor(170 * t);
      b = 0;
    } else if (ratio > 0.25) {
      // Da rosso (170,0,0) a rosso scuro (100,0,0)
      const t = (ratio - 0.25) / 0.25;
      r = Math.floor(70 * t + 100);
      g = 0; b = 0;
    } else {
      // Da rosso scuro (100,0,0) a quasi nero (30,0,0)
      const t = ratio / 0.25;
      r = Math.floor(70 * t + 30);
      g = 0; b = 0;
    }
    const color = (r << 16) | (g << 8) | b;

    this._playerHealthBar.clear();
    this._playerHealthBar.fillStyle(0x110000, 1).fillRoundedRect(550, 510, maxWidth, 20, 10);
    if (fillW > 0) {
      this._playerHealthBar.fillStyle(color, 1).fillRoundedRect(550, 510, fillW, 20, 10);
    }
    this._playerHealthBar
      .lineStyle(4, 0x000000, 1)
      .strokeRoundedRect(550, 510, maxWidth, 20, 10)
      .setDepth(1000);
  }

  // ─── SCREEN SHAKE a bassa vita ──────────────────────────────────────────
  private _updateScreenShake(): void {
    if (!this._player) return;
    const ratio = this._player.Vita / this._player.maxVita;
    if (ratio < 0.25 && !this._screenShaking) {
      this._screenShaking = true;
      this._startScreenShake();
    } else if (ratio >= 0.25 && this._screenShaking) {
      this._screenShaking = false;
      this.cameras.main.setScroll(0, 0);
    }
  }

  private _startScreenShake(): void {
    if (!this._screenShaking || this._fightEnded) return;
    this.cameras.main.shake(300, 0.004, false, (_: any, prog: number) => {
      if (prog === 1 && this._screenShaking && !this._fightEnded) {
        this.time.delayedCall(800, () => { this._startScreenShake(); });
      }
    });
  }

  // ─── MANA BAR ───────────────────────────────────────────────────────────
  private _drawManaBar(): void {
    if (!this._playerManaBar || !this._player) return;
    const maxWidth  = 600;
    const ratio     = Math.max(0, Math.min(1, this._player.Mana / this._player.maxMana));
    const fillWidth = maxWidth * ratio;

    this._playerManaBar.clear();
    this._playerManaBar
      .fillStyle(0x111133, 1).fillRoundedRect(550, 578, maxWidth, 20, 10)
      .lineStyle(4, 0x000000, 1).strokeRoundedRect(550, 578, maxWidth, 20, 10);

    if (fillWidth > 0) {
      this._playerManaBar.fillStyle(0x0055ff, 1).fillRoundedRect(550, 578, fillWidth, 20, 10);
    }
    this._playerManaBar.setDepth(1000);
  }

  // ─── INVENTORY con sblocchi progressivi ─────────────────────────────────
  private _callInventory(): void {
    if (this._evolutionPhase === 1) {
      this._player.inventory(this._Mana, this._playerHealthBar);
    } else if (this._evolutionPhase === 2) {
      this._player.inventoryWithShield(this._Mana, this._playerHealthBar, this._bossHealthBar, this._boss);
    } else {
      this._player.inventoryBoss03(this._Mana, this._playerHealthBar, this._bossHealthBar, this._boss);
    }
  }

  // ─── INCREMENTA TURNO ───────────────────────────────────────────────────
  private _onPlayerAction(): void {
    // viene chiamata dopo ATTACK — ma il turn count avviene già nel cambio turno
  }

  // ─── CONTROLLA SBLOCCO EVOLUZIONE ───────────────────────────────────────
  private _checkEvolutionUnlock(): void {
    if (this._evolutionPhase === 1 && this._turnCount >= 4 && !this._evolutionUnlocked) {
      this._evolutionUnlocked = true;
      this._startEvolutionGlow();
    }
    if (this._evolutionPhase === 2 && this._turnCount >= 8 && !this._evo2Unlocked) {
      this._evo2Unlocked = true;
      this._startEvolutionGlow();
    }
  }

  private _startEvolutionGlow(): void {
    this._evolutionTextLabel.setColor("#ffdd00").setInteractive();
    if (this._evolutionGlowTween) this._evolutionGlowTween.stop();
    this._evolutionGlowTween = this.add.tween({
      targets: this._evolutionTextLabel,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      duration: 500,
      ease: "Sine.easeInOut",
    });
  }

  // ─── POPUP EVOLUZIONE ───────────────────────────────────────────────────
 private _showEvolutionPopup(): void {
    if (this._evolutionPopupOpen) return;
    this._evolutionPopupOpen = true;
    const isEvo1 = this._evolutionPhase === 1 && this._evolutionUnlocked;
    const isEvo2 = this._evolutionPhase === 2 && this._evo2Unlocked;
    if (!isEvo1 && !isEvo2) return;

    const cost = isEvo1 ? 3 : 5;
    const label = isEvo1 ? "PRIMA EVOLUZIONE" : "SECONDA EVOLUZIONE";

    const overlay = this.add.rectangle(1280 / 2, 800 / 2, 600, 340, 0x000000, 0.9)
      .setDepth(3000).setStrokeStyle(3, 0xffdd00);

    const title = this.add.text(1280 / 2, 800 / 2 - 110, " EVOLUZIONE ", {
      fontFamily: "Underdog", fontSize: 36, color: "#ffdd00",
      stroke: "#000000", strokeThickness: 5,
    }).setOrigin(0.5).setDepth(3001);

    const subTitle = this.add.text(1280 / 2, 800 / 2 - 65, label, {
      fontFamily: "Underdog", fontSize: 26, color: "#ffffff",
      stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setDepth(3001);

    const question = this.add.text(1280 / 2, 800 / 2, `Vuoi evolverti al\ncosto di ${cost} di mana?`, {
      fontFamily: "Underdog", fontSize: 28, color: "#ffffff",
      stroke: "#000000", strokeThickness: 3, align: "center",
    }).setOrigin(0.5).setDepth(3001);

    const hasMana = this._player.Mana >= cost;

    const yesColor = hasMana ? "#00ff00" : "#888888";
    const yesBtn = this.add.text(1280 / 2 - 110, 800 / 2 + 110, "[ SI ]", {
      fontFamily: "Underdog", fontSize: 38, color: yesColor,
      stroke: "#000000", strokeThickness: 4,
    }).setOrigin(0.5).setDepth(3001);

    if (hasMana) {
      yesBtn.setInteractive().on("pointerdown", () => {
        this._player.Mana -= cost;
        this._drawManaBar();
        destroy();
        this._doEvolution(isEvo1 ? 2 : 3);
      });
    }

    const noBtn = this.add.text(1280 / 2 + 110, 800 / 2 + 110, "[ NO ]", {
      fontFamily: "Underdog", fontSize: 38, color: "#ff4444",
      stroke: "#000000", strokeThickness: 4,
    }).setOrigin(0.5).setDepth(3001).setInteractive()
      .on("pointerdown", () => { destroy(); });

    const destroy = () => {
    this._evolutionPopupOpen = false;  // ← aggiungi questa
    overlay.destroy(); title.destroy(); subTitle.destroy();
    question.destroy(); yesBtn.destroy(); noBtn.destroy();
};
  }

  // ─── ESEGUI EVOLUZIONE ──────────────────────────────────────────────────
  private _doEvolution(newPhase: number): void {
    this.disablePlayerControls();

    // Flash bianco
    const flash = this.add.rectangle(0, 0, 1280, 800, 0xffffff, 0).setOrigin(0).setDepth(4000);

    // Particelle / raggi di luce
    const rays: Phaser.GameObjects.Graphics[] = [];
    for (let i = 0; i < 12; i++) {
      const ray = this.add.graphics().setDepth(3999);
      const angle = (i / 12) * Math.PI * 2;
      ray.fillStyle(0xffdd00, 0.6);
      ray.fillTriangle(
        300, 550,
        300 + Math.cos(angle) * 200, 550 + Math.sin(angle) * 200,
        300 + Math.cos(angle + 0.15) * 200, 550 + Math.sin(angle + 0.15) * 200
      );
      rays.push(ray);
    }

    // Testo EVOLUZIONE
    const evoText = this.add.text(1280 / 2, 300, "✦ EVOLUZIONE! ✦", {
      fontFamily: "Underdog", fontSize: 60, color: "#ffdd00",
      stroke: "#000000", strokeThickness: 8,
    }).setOrigin(0.5).setDepth(4001).setScale(0);

    // Fase label
    const faseStr = newPhase === 2 ? "SECONDA FASE" : "TERZA FASE";
    const faseText = this.add.text(1280 / 2, 400, faseStr, {
      fontFamily: "Underdog", fontSize: 40, color: "#ffffff",
      stroke: "#000000", strokeThickness: 6,
    }).setOrigin(0.5).setDepth(4001).setAlpha(0);

    // Spin dello sprite
    this.add.tween({ targets: this._playerSprite, angle: 360, duration: 800, ease: "Power2" });

    // Grow evoText
    this.add.tween({
      targets: evoText, scale: 1.4, duration: 700, ease: "Back.easeOut",
      onComplete: () => {
        // Flash bianco
        this.add.tween({
          targets: flash, fillAlpha: 1, duration: 200, ease: "Power2",
          onComplete: () => {
            // Cambia sprite
            const anim = newPhase === 2 ? "idle2" : "idle3";
            this._playerSprite.play(anim);

            // Flash via
            this.add.tween({
              targets: flash, fillAlpha: 0, duration: 400, ease: "Power2",
              onComplete: () => {
                // Mostra fase
                this.add.tween({
                  targets: faseText, alpha: 1, duration: 500,
                  onComplete: () => {
                    this.time.delayedCall(1200, () => {
                      // Pulisci
                      flash.destroy();
                      evoText.destroy();
                      faseText.destroy();
                      rays.forEach(r => r.destroy());

                      // Aggiorna fase e mosse
                      this._evolutionPhase = newPhase;
                      this._applyEvolutionPhase(newPhase);
                      this._updateFaseLabel();

                      // Stop glow
                      if (this._evolutionGlowTween) {
                        this._evolutionGlowTween.stop();
                        this._evolutionGlowTween = null;
                      }
                      this._evolutionTextLabel.setAlpha(1).setColor("#555555").removeInteractive();
                      this._evolutionUnlocked = false;
                      this._evo2Unlocked = false;

                      this.enablePlayerControls();
                    });
                  },
                });
              },
            });
          },
        });
      },
    });

    // Raggi rotanti
    this.add.tween({
      targets: rays, angle: 180, duration: 1200, ease: "linear",
    });
  }

  private _applyEvolutionPhase(phase: number): void {
    if (phase === 2) {
      this._player.mosse = [
        { nome: "punch",          danno: 30,  costo: 0 },
        { nome: "smite",          danno: 60,  costo: 1 },
        { nome: "large slayer",   danno: 140, costo: 2 },
        { nome: "prayer",         danno: 80,  costo: 1 },
        { nome: "divine attack",  danno: 220, costo: 3 },
      ];
      this._player.mossaSelected = this._player.mosse[0];
    } else if (phase === 3) {
      this._player.mosse = [
        { nome: "punch",              danno: 30,  costo: 0 },
        { nome: "smite",              danno: 60,  costo: 1 },
        { nome: "large slayer",       danno: 140, costo: 2 },
        { nome: "prayer",             danno: 80,  costo: 1 },
        { nome: "divine attack",      danno: 220, costo: 3 },
        { nome: "malevolent shrine",  danno: 500, costo: 5 },
      ];
      this._player.mossaSelected = this._player.mosse[0];
      this._player.talismanActive = false; // talismano disponibile in inventario fase 3
    }
  }

  private _updateFaseLabel(): void {
    const labels = ["", "[ FASE 1 ]", "[ FASE 2 ]", "[ FASE 3 ]"];
    this._faseLabel.setText(labels[this._evolutionPhase]);
  }

  // ─── CONFIRM BOX EXIT ───────────────────────────────────────────────────
  private showExitConfirm(): void {
    if (this._confirmBox) return;

    this._confirmBox = this.add.rectangle(1280 / 2, 800 / 2, 500, 300, 0x000000, 0.8).setDepth(2000);
    this._confirmText = this.add.text(1280 / 2, 800 / 2 - 60, "TORNARE AL MENU?", {
      fontFamily: "Underdog", fontSize: 40, color: "#ffffff",
    }).setOrigin(0.5).setDepth(2001);

    this._yesText = this.add.text(1280 / 2 - 100, 800 / 2 + 60, "SI", {
      fontFamily: "Underdog", fontSize: 40, color: "#00ff00",
    }).setOrigin(0.5).setDepth(2001).setInteractive()
      .on("pointerdown", () => {
        this._music.stop();
        this.scene.stop("Boss01");
        this.scene.start("Intro");
      });

    this._noText = this.add.text(1280 / 2 + 100, 800 / 2 + 60, "NO", {
      fontFamily: "Underdog", fontSize: 40, color: "#ff0000",
    }).setOrigin(0.5).setDepth(2001).setInteractive()
      .on("pointerdown", () => { this.closeExitConfirm(); });
  }

  private closeExitConfirm(): void {
    this._confirmBox.destroy(); this._confirmText.destroy();
    this._yesText.destroy();   this._noText.destroy();
    this._confirmBox = null;   this._confirmText = null;
    this._yesText = null;      this._noText = null;
  }

  // ─── HELPERS ────────────────────────────────────────────────────────────
  sizeUp(text: Phaser.GameObjects.Text, t: string, onComplete?: () => void): void {
    text.setScale(0); text.setText(t); text.setVisible(true);
    this.add.tween({
      targets: text, scale: 1.5, duration: 1000, ease: "Power2",
      onComplete: () => {
        this.add.tween({
          targets: text, alpha: 0, scale: 1, duration: 500, ease: "Power2",
          onComplete: () => {
            text.setAlpha(1); text.setVisible(false);
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
    this.add.tween({ targets: params, scale: x, duration: 100, ease: "linear", repeat: 0 });
  }

  info(move: string, dmg: number): void {
    this._infoText.setText(`${move}: ${dmg} damage`);
  }
}