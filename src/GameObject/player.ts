import { GameData } from "../GameData";
import GameOver from "../scenes/GameOver";
import iMosse from "./iMosse";
import IPlayer from "./iPlayer";


export default class Player extends Phaser.GameObjects.Sprite implements IPlayer {

    private _genericConfig: genericConfig;
    private game: boolean = true;
    private _dmg: Phaser.Sound.BaseSound;

    bossTurnActive: boolean = false;
    activeDefenceTimers: Phaser.Time.TimerEvent[] = [];
    private activeAxes: Phaser.GameObjects.Sprite[] = [];
    private activeCrosses: Phaser.GameObjects.Sprite[] = [];

    // SHIELD
    shieldActive: boolean = false;
    shieldUsed: boolean = false;

    // ATTACK BOOST — x2 danno sulla prossima mossa, costa un turno
    attackBoostActive: boolean = false;

    // TALISMANO — doppio attacco (solo Boss03)
    // Se il primo timing è giusto → secondo attacco automatico
    // Se sbaglia → danno normale, talismano consumato
    talismanActive: boolean = false;

    nome: string;
    Vita: number;
    maxVita: number;
    Mana: number;
    maxMana: number;
    mosse: iMosse[];
    mossaSelected: iMosse;
    _vittoria: boolean;

    p: Phaser.GameObjects.Sprite;
    pBody: Phaser.Physics.Arcade.Body;
    keyboard: Phaser.Types.Input.Keyboard.CursorKeys;
    keys: any;

    turn: boolean;

    constructor(params: genericConfig, nome: string, Vita: number, maxVita: number, Mana: number, maxMana: number, mosse: iMosse[]) {
        super(params.scene, params.x, params.y, params.key);
        this.nome = nome;
        this.Vita = Vita;
        this.maxVita = maxVita;
        this.Mana = Mana;
        this.maxMana = maxMana;
        this.mosse = mosse;
        this.mossaSelected = mosse[0];
        this.turn = true;
        this.p = this.scene.add.sprite(0, 0, "TU");
        this.pBody = <Phaser.Physics.Arcade.Body>this.p.body;
        this.keyboard = this.scene.input.keyboard.createCursorKeys();
        this._dmg = this.scene.sound.add("dmg");
        this.keys = this.scene.input.keyboard!.addKeys('W,A,S,D');
    }


    // ─────────────────────────────────────────────────────────────────────────
    // UPDATE
    // ─────────────────────────────────────────────────────────────────────────
    update(time: number, delta: number, x: IPlayer, y: Phaser.GameObjects.Sprite, sp: string, n: number, liv: string, fase: number): void {
        if (this.game == true) {
            if (this.Vita == 0) {
                this.sconfitta();
                this.game = false;
            }
            if (x.Vita == 0) {
                this._vittoria = true;
                this.vittoria(liv, fase);
                const polloArrosto = this.scene.physics.add.sprite(900, 250, sp, 5).setScale(4).setDepth(1);
                polloArrosto.setAngularVelocity(n);
                y.destroy();
                this.game = false;
            }
        }

        const controlMode = this.scene.registry.get("controlMode");
        if (controlMode === "WASD") {
            if (this.keys.W.isDown)      { this.p.y -= 10; }
            else if (this.keys.S.isDown) { this.p.y += 10; }
            else if (this.keys.A.isDown) { this.p.x -= 10; }
            else if (this.keys.D.isDown) { this.p.x += 10; }
        } else {
            if (this.keyboard.up.isDown)        { this.p.y -= 10; }
            else if (this.keyboard.down.isDown)  { this.p.y += 10; }
            else if (this.keyboard.left.isDown)  { this.p.x -= 10; }
            else if (this.keyboard.right.isDown) { this.p.x += 10; }
        }
    }


    // ─────────────────────────────────────────────────────────────────────────
    // FINE TURNO
    // ─────────────────────────────────────────────────────────────────────────
    fineTurno(): void {
        this.turn = !this.turn;
    }


    // ─────────────────────────────────────────────────────────────────────────
    // ATTACK — normale
    // ─────────────────────────────────────────────────────────────────────────
    attack(x: IPlayer, y: Phaser.GameObjects.Sprite, z: Phaser.GameObjects.Graphics, t: Phaser.GameObjects.Text): number {
        if (this.Mana >= this.mossaSelected.costo) {
            this.Mana -= this.mossaSelected.costo;
            t.setText(this.Mana.toString());

            const baseDanno  = this.mossaSelected.danno;
            const finalDanno = this.attackBoostActive ? baseDanno * 2 : baseDanno;
            if (this.attackBoostActive) { this.attackBoostActive = false; }

            const _container = this.scene.add.container(0, 0).setDepth(2002).setInteractive();
            const _sfondo    = this.scene.add.image(0, 0, "layer").setOrigin(0).setInteractive();
            const _Test      = this.scene.add.image(640, 400, "AttackTest").setOrigin(0.5).setScale(10).setInteractive();
            const _pallino   = this.scene.add.image(0, 400, "TU").setOrigin(0.5).setScale(3).setInteractive();

            _container.add([_sfondo, _Test, _pallino]);

            this.scene.add.tween({
                targets: _pallino,
                x: 1280,
                ease: 'linear',
                duration: Phaser.Math.RND.between(1100, 1200),
                repeat: 0,
                onComplete: () => { _container.destroy(); },
            });

            this.scene.input.keyboard.on("keydown-SPACE", () => {
                if (_pallino.x > 500 && _pallino.x < 780) {
                    x.Vita -= finalDanno;
                    if (x.Vita > 0) {
                        this.scene.add.tween({
                            targets: y,
                            x: y.x + 20,
                            ease: 'Sine.easeInOut',
                            duration: 20,
                            yoyo: true,
                            repeat: 10,
                            callbacks: () => { y.setFrame(4); },
                            onComplete: () => { y.setFrame(0); },
                        });
                    }
                    z.clear();
                    if (x.Vita <= 0) { x.Vita = 0; }
                    z.fillStyle(0x770000, 1)
                     .fillRect(20, 50, x.Vita, 20)
                     .lineStyle(4, 0x000000, 1)
                     .fillRoundedRect(20, 50, x.Vita, 20, 10)
                     .strokeRoundedRect(20, 50, x.Vita, 20, 10);
                }
                _container.destroy();
            });

            this.fineTurno();
            return finalDanno;
        }
    }


    // ─────────────────────────────────────────────────────────────────────────
    // ATTACK CON TALISMANO — doppio attacco
    // Primo timing giusto → secondo attacco automatico con stessa mossa
    // Primo timing sbagliato → danno normale, talismano consumato
    // Costo: mossa.costo + 2 (già scalato prima di chiamare questo metodo)
    // ─────────────────────────────────────────────────────────────────────────
    attackWithTalisman(x: IPlayer, y: Phaser.GameObjects.Sprite, z: Phaser.GameObjects.Graphics, t: Phaser.GameObjects.Text): void {
        const mossaCosto = this.mossaSelected.costo;
        const costTotale = mossaCosto + 2;

        if (this.Mana < costTotale) return;

        this.Mana -= costTotale;
        t.setText(this.Mana.toString());
        this.talismanActive = false; // consumato subito

        const danno = this.mossaSelected.danno;

        // ── PRIMO ATTACCO ────────────────────────────────────────────────────
        const _container1 = this.scene.add.container(0, 0).setDepth(2002).setInteractive();
        const _sfondo1    = this.scene.add.image(0, 0, "layer").setOrigin(0).setInteractive();
        const _Test1      = this.scene.add.image(640, 400, "AttackTest").setOrigin(0.5).setScale(10).setInteractive();
        const _pallino1   = this.scene.add.image(0, 400, "TU").setOrigin(0.5).setScale(3).setInteractive();

        // Label "COLPO 1/2"
        const _label1 = this.scene.add.text(640, 200, "✦ COLPO 1 / 2 ✦", {
            fontFamily: "Underdog", fontSize: 40, color: "#ffdd00",
            stroke: "#000000", strokeThickness: 5,
        }).setOrigin(0.5).setDepth(2003);

        _container1.add([_sfondo1, _Test1, _pallino1]);

        this.scene.add.tween({
            targets: _pallino1,
            x: 1280,
            ease: 'linear',
            duration: Phaser.Math.RND.between(1100, 1200),
            repeat: 0,
            onComplete: () => {
                // Tempo scaduto senza premere SPACE → danno normale, turno finisce
                _container1.destroy();
                _label1.destroy();
                x.Vita -= danno;
                if (x.Vita <= 0) x.Vita = 0;
                this._aggiornaBarra(x, y, z, danno, false);
                this.fineTurno();
            },
        });

        const onSpace1 = () => {
            const hit = _pallino1.x > 500 && _pallino1.x < 780;
            _container1.destroy();
            _label1.destroy();
            this.scene.input.keyboard.off("keydown-SPACE", onSpace1);

            if (hit) {
                // Primo colpo centrato → applica danno e lancia secondo attacco
                x.Vita -= danno;
                if (x.Vita <= 0) x.Vita = 0;
                this._aggiornaBarra(x, y, z, danno, true);
                this._secondoAttaccoTalismano(x, y, z, t, danno);
            } else {
                // Primo colpo mancato → danno normale, talismano consumato, turno finisce
                x.Vita -= danno;
                if (x.Vita <= 0) x.Vita = 0;
                this._aggiornaBarra(x, y, z, danno, false);
                this.fineTurno();
            }
        };

        this.scene.input.keyboard.on("keydown-SPACE", onSpace1);
    }

    // Secondo attacco del talismano (automatico dopo primo giusto)
    private _secondoAttaccoTalismano(x: IPlayer, y: Phaser.GameObjects.Sprite, z: Phaser.GameObjects.Graphics, t: Phaser.GameObjects.Text, danno: number): void {
        const _container2 = this.scene.add.container(0, 0).setDepth(2002).setInteractive();
        const _sfondo2    = this.scene.add.image(0, 0, "layer").setOrigin(0).setInteractive();
        const _Test2      = this.scene.add.image(640, 400, "AttackTest").setOrigin(0.5).setScale(10).setInteractive();
        const _pallino2   = this.scene.add.image(0, 400, "TU").setOrigin(0.5).setScale(3).setInteractive();

        // Label "COLPO 2/2" in oro più brillante
        const _label2 = this.scene.add.text(640, 200, "✦ COLPO 2 / 2 ✦", {
            fontFamily: "Underdog", fontSize: 40, color: "#ff8800",
            stroke: "#000000", strokeThickness: 5,
        }).setOrigin(0.5).setDepth(2003);

        _container2.add([_sfondo2, _Test2, _pallino2]);

        this.scene.add.tween({
            targets: _pallino2,
            x: 1280,
            ease: 'linear',
            duration: Phaser.Math.RND.between(1100, 1200),
            repeat: 0,
            onComplete: () => {
                _container2.destroy();
                _label2.destroy();
                this.fineTurno();
            },
        });

        const onSpace2 = () => {
            const hit2 = _pallino2.x > 500 && _pallino2.x < 780;
            _container2.destroy();
            _label2.destroy();
            this.scene.input.keyboard.off("keydown-SPACE", onSpace2);

            if (hit2) {
                x.Vita -= danno;
                if (x.Vita <= 0) x.Vita = 0;
                this._aggiornaBarra(x, y, z, danno, true);
            }
            this.fineTurno();
        };

        this.scene.input.keyboard.on("keydown-SPACE", onSpace2);
    }

    // Helper — shake boss + aggiorna barra vita boss
    private _aggiornaBarra(x: IPlayer, y: Phaser.GameObjects.Sprite, z: Phaser.GameObjects.Graphics, danno: number, shake: boolean): void {
        if (shake && x.Vita > 0) {
            this.scene.add.tween({
                targets: y,
                x: y.x + 20,
                ease: 'Sine.easeInOut',
                duration: 20,
                yoyo: true,
                repeat: 10,
                onComplete: () => { y.setFrame(0); },
            });
        }
        z.clear();
        z.fillStyle(0x770000, 1)
         .fillRect(20, 50, x.Vita, 20)
         .lineStyle(4, 0x000000, 1)
         .fillRoundedRect(20, 50, x.Vita, 20, 10)
         .strokeRoundedRect(20, 50, x.Vita, 20, 10);
    }


    // ─────────────────────────────────────────────────────────────────────────
    // TECH — scegli mossa
    // ─────────────────────────────────────────────────────────────────────────
    tech(): iMosse {
        const container = this.scene.add.container(0, 0).setDepth(2002);
        const modal = this.scene.add.image(1280 / 2, 800 / 2, "movesetGUI").setOrigin(0.5).setInteractive();
        container.add(modal);

        const text = this.scene.add.text(1280 / 2, 165, "Scegli la mossa!")
            .setOrigin(0.5).setDepth(2001).setFontSize(37).setFontFamily("Underdog")
            .setShadow(2, 2, "#000000", 2, false, true);
        container.add(text);

        const _sfondoMomentaneo = this.scene.add.image(0, 0, "layer").setOrigin(0).setInteractive()
            .on("pointerdown", () => { container.destroy(); });
        container.add(_sfondoMomentaneo);

        let position = 250;
        for (const i in this.mosse) {
            const Moves = this.scene.add.text(1280 / 2, position, this.mosse[i].nome)
                .setDepth(2001).setOrigin(0.5).setColor("#ffffff")
                .setFontFamily("Underdog").setFontSize(40)
                .setInteractive().setWordWrapWidth(700);

            const infoText = this.scene.add
                .text(1280 / 2, position + 40, this.mosse[i].danno.toString() + " / " + this.mosse[i].costo.toString())
                .setDepth(2001).setOrigin(0.5).setColor("#ffffff")
                .setFontFamily("Underdog").setFontSize(20).setVisible(false);

            Moves.on("pointerdown", () => {
                this.mossaSelected = this.mosse[i];
                container.destroy();
                console.log(this.mossaSelected.nome);
            })
            .on("pointerover", () => { this.onTwiin(Moves, 1.1); infoText.setVisible(true); })
            .on("pointerout",  () => { this.onTwiin(Moves, 1);   infoText.setVisible(false); });

            container.add(infoText);
            container.add(Moves);
            position += 75;
        }
        return this.mossaSelected;
    }


    // ─────────────────────────────────────────────────────────────────────────
    // INVENTORY — versione base (Boss01)
    // ─────────────────────────────────────────────────────────────────────────
    inventory(t: Phaser.GameObjects.Text, z: Phaser.GameObjects.Graphics): void {
        this._openInventory(t, z, null, null, false, false, false);
    }

    // INVENTORY CON SCUDO + POZIONE ATTACCO — Boss02
    inventoryWithShield(
        t: Phaser.GameObjects.Text,
        z: Phaser.GameObjects.Graphics,
        bossBar: Phaser.GameObjects.Graphics,
        boss: IPlayer
    ): void {
        this._openInventory(t, z, bossBar, boss, true, true, false);
    }

    // INVENTORY COMPLETO CON TALISMANO — Boss03
    inventoryBoss03(
        t: Phaser.GameObjects.Text,
        z: Phaser.GameObjects.Graphics,
        bossBar: Phaser.GameObjects.Graphics,
        boss: IPlayer
    ): void {
        this._openInventory(t, z, bossBar, boss, true, true, true);
    }

    private _openInventory(
        t: Phaser.GameObjects.Text,
        z: Phaser.GameObjects.Graphics,
        bossBar: Phaser.GameObjects.Graphics | null,
        boss: IPlayer | null,
        showShield: boolean,
        showAttackPotion: boolean,
        showTalisman: boolean
    ): void {
        const _container    = this.scene.add.container(0, 0).setDepth(2002);
        const _inventoryGUI = this.scene.add.image(1280 / 2, 400, "INV");
        const item1         = this.scene.add.image(400, 400, "pozioneVita").setScale(3.5);
        const item2         = this.scene.add.image(520, 400, "pozioneMana").setScale(3.5);
        const descrizione   = this.scene.add.text(400, 470, "").setAlpha(0).setOrigin(0.5);
        const _Text         = this.scene.add.text(1280 / 2, 330, "INVENTARIO")
            .setDepth(2001).setOrigin(0.5).setFontSize(25).setFontFamily("Underdog").setColor("#ffffff");

        // Pozione vita
        item1.setInteractive()
            .on("pointerdown", () => {
                if (this.Vita < this.maxVita - 20) {
                    this.Vita += 60;
                    this.fineTurno();
                    z.clear();
                    z.fillStyle(0x770000, 1)
                     .fillRect(550, 550, this.Vita, 20)
                     .lineStyle(4, 0x000000, 1)
                     .fillRoundedRect(550, 550, this.Vita, 20, 10)
                     .strokeRoundedRect(550, 550, this.Vita, 20, 10);
                }
                _container.destroy();
            })
            .on("pointerover", () => { this.onTwiin(item1, 3.7); descrizione.setAlpha(1).setText("Vita +60"); descrizione.x = 400; })
            .on("pointerout",  () => { this.onTwiin(item1, 3.5); descrizione.setAlpha(0); });

        // Pozione mana
        item2.setInteractive()
            .on("pointerdown", () => {
                if (this.Mana + 1 < this.maxMana) {
                    this.Mana += 2;
                    t.setText(this.Mana.toString());
                    this.fineTurno();
                }
                _container.destroy();
            })
            .on("pointerover", () => { this.onTwiin(item2, 3.7); descrizione.setAlpha(1).setText("Mana +2"); descrizione.x = 520; })
            .on("pointerout",  () => { this.onTwiin(item2, 3.5); descrizione.setAlpha(0); });

        const _sfondoMomentaneo = this.scene.add.image(0, 0, "layer").setOrigin(0).setInteractive().setDepth(10)
            .on("pointerdown", () => { _container.destroy(); });

        _container.add([_sfondoMomentaneo, _inventoryGUI, _Text, item1, item2, descrizione]);

        // ── SCUDO ────────────────────────────────────────────────────────────
        if (showShield) {
            const itemShield = this.scene.add.image(640, 400, "scudoFantasma").setScale(3.5);

            if (this.shieldUsed) {
                itemShield.setAlpha(0.3).setTint(0x888888);
                itemShield.setInteractive()
                    .on("pointerover", () => { descrizione.setAlpha(1).setText("Scudo: già usato"); descrizione.x = 640; })
                    .on("pointerout",  () => { descrizione.setAlpha(0); });
            } else if (this.shieldActive) {
                itemShield.setAlpha(0.5);
                itemShield.setInteractive()
                    .on("pointerover", () => { descrizione.setAlpha(1).setText("Scudo: ATTIVO!"); descrizione.x = 640; })
                    .on("pointerout",  () => { descrizione.setAlpha(0); });
            } else {
                itemShield.setInteractive()
                    .on("pointerdown", () => {
                        this.shieldActive = true;
                        _container.destroy();
                    })
                    .on("pointerover", () => {
                        this.onTwiin(itemShield, 3.7);
                        descrizione.setAlpha(1).setText("Scudo: blocca 1 attacco\n(puoi ancora attaccare!)");
                        descrizione.x = 640;
                    })
                    .on("pointerout", () => {
                        this.onTwiin(itemShield, 3.5);
                        descrizione.setAlpha(0);
                    });
            }

            _container.add(itemShield);
        }

        // ── POZIONE ATTACCO ──────────────────────────────────────────────────
        if (showAttackPotion) {
            const itemAttack = this.scene.add.image(760, 400, "pozioneAttacco").setScale(3.5);

            if (this.attackBoostActive) {
                itemAttack.setAlpha(0.5).setTint(0xffaa00);
                itemAttack.setInteractive()
                    .on("pointerover", () => { descrizione.setAlpha(1).setText("Attacco x2: pronto!"); descrizione.x = 760; })
                    .on("pointerout",  () => { descrizione.setAlpha(0); });
            } else {
                itemAttack.setInteractive()
                    .on("pointerdown", () => {
                        this.attackBoostActive = true;
                        this.fineTurno(); // costa un turno
                        _container.destroy();
                    })
                    .on("pointerover", () => {
                        this.onTwiin(itemAttack, 3.7);
                        descrizione.setAlpha(1).setText("Attacco x2 (costa 1 turno)");
                        descrizione.x = 760;
                    })
                    .on("pointerout", () => {
                        this.onTwiin(itemAttack, 3.5);
                        descrizione.setAlpha(0);
                    });
            }

            _container.add(itemAttack);
        }

        // ── TALISMANO ────────────────────────────────────────────────────────
        if (showTalisman) {
            const itemTalisman = this.scene.add.image(880, 400, "talismano").setScale(3.5);
            const costTalismano = this.mossaSelected.costo + 2;
            const hasMana = this.Mana >= costTalismano;

            if (this.talismanActive) {
                // Già attivo questo turno
                itemTalisman.setAlpha(0.5).setTint(0xffdd00);
                itemTalisman.setInteractive()
                    .on("pointerover", () => { descrizione.setAlpha(1).setText("Talismano: ATTIVO!"); descrizione.x = 880; })
                    .on("pointerout",  () => { descrizione.setAlpha(0); });
            } else if (!hasMana) {
                // Mana insufficiente
                itemTalisman.setAlpha(0.3).setTint(0x888888);
                itemTalisman.setInteractive()
                    .on("pointerover", () => {
                        descrizione.setAlpha(1).setText(`Mana insufficiente!\n(serve ${costTalismano})`);
                        descrizione.x = 880;
                    })
                    .on("pointerout",  () => { descrizione.setAlpha(0); });
            } else {
                itemTalisman.setInteractive()
                    .on("pointerdown", () => {
                        this.talismanActive = true;
                        // NON consuma il turno: il player dovrà cliccare ATTACK
                        _container.destroy();
                    })
                    .on("pointerover", () => {
                        this.onTwiin(itemTalisman, 3.7);
                        descrizione.setAlpha(1).setText(
                            `Talismano: doppio attacco\n(costo ${costTalismano} mana, 1° timing = 2° colpo gratis!)`
                        );
                        descrizione.x = 880;
                    })
                    .on("pointerout", () => {
                        this.onTwiin(itemTalisman, 3.5);
                        descrizione.setAlpha(0);
                    });
            }

            _container.add(itemTalisman);
        }
    }


    takedamage(damage: number): void {}


    // ─────────────────────────────────────────────────────────────────────────
    // ACTIVE DEFENCE 01 — asce
    // ─────────────────────────────────────────────────────────────────────────
    activeDefence01(x: IPlayer, z: Phaser.GameObjects.Graphics): void {
        this.activeDefenceTimers.forEach(t => t.remove(false));
        this.activeDefenceTimers = [];

        if (this.bossTurnActive) return;
        this.bossTurnActive = true;

        if (this.shieldActive) {
            this.shieldActive   = false;
            this.shieldUsed     = true;
            this.bossTurnActive = false;
            this._playShieldAnimation(() => { this.fineTurno(); });
            return;
        }

        let velocity: number = 1000;
        if (x.Vita < x.maxVita / 2) { velocity = 500; }

        if (this._vittoria == false) {
            this.bossTurnActive = true;

            const image       = this.scene.add.image(0, 0, "sfondoBoss01").setOrigin(0, 0).setScale(5).setDepth(1002);
            const _box        = this.scene.add.image(1280 / 2, 400, "BOX").setScale(4).setDepth(1002);
            const _border     = this.scene.add.image(1280 / 2, 400, "BOX_BORDER").setScale(4).setDepth(1003);
            this.scene.physics.world.enable(_border);
            const _borderBody = <Phaser.Physics.Arcade.Body>_border.body;
            _borderBody.setCollideWorldBounds(true);
            _borderBody.setImmovable(true);

            this.p = this.scene.add.sprite(640, 400, "TU").setDepth(1002).setScale(2);
            this.scene.physics.world.enable(this.p);
            this.pBody = <Phaser.Physics.Arcade.Body>this.p.body;
            this.pBody.setCollideWorldBounds(true);
            this.pBody.setImmovable(true);
            this.pBody.setBoundsRectangle(new Phaser.Geom.Rectangle(360, 120, _border.width * 4, _border.height * 4));
            this.scene.physics.add.collider(this.p, _border);

            let controllo = true;

            const creaAscia = (i: number) => {
                if (!controllo || !this.bossTurnActive) return;

                const _axe = this.scene.add
                    .sprite(Phaser.Math.RND.between(100, 1180), Phaser.Math.RND.pick([50, 750]), "AXE")
                    .setScale(1).setDepth(1002).setOrigin(0.5);
                this.activeAxes.push(_axe);

                const angle = Phaser.Math.Angle.Between(_axe.x, _axe.y, this.p.x, this.p.y);
                _axe.setRotation(angle);
                this.scene.physics.world.enable(_axe);
                const _axeBody = <Phaser.Physics.Arcade.Body>_axe.body;
                _axeBody.setImmovable();
                const speed = Phaser.Math.RND.between(350, 650);
                _axeBody.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
                _axeBody.setAngularVelocity(700);

                this.scene.physics.add.collider(this.pBody, _axeBody, () => {
                    this._dmg.play();
                    this.Vita -= x.mossaSelected.danno;
                    controllo = false;
                    z.clear();
                    if (this.Vita <= 0) { this.Vita = 0; }
                    z.fillStyle(0x770000, 1)
                     .fillRect(550, 550, this.Vita, 20)
                     .lineStyle(4, 0x000000, 1)
                     .fillRoundedRect(550, 550, this.Vita, 20, 10)
                     .strokeRoundedRect(550, 550, this.Vita, 20, 10);
                    _axe.destroy();
                    _axeBody.destroy();
                    cleanup();
                });

                if (i === 9) {
                    controllo = false;
                    cleanup();
                    return;
                }
            };

            const cleanup = () => {
                this.activeDefenceTimers.forEach(t => t.remove(false));
                this.activeDefenceTimers = [];
                this.activeAxes.forEach(a => { a.destroy(); });
                this.activeAxes = [];
                image.destroy();
                _border.destroy();
                _borderBody.destroy();
                this.p.destroy();
                this.pBody.destroy();
                _box.destroy();
                this.fineTurno();
                this.bossTurnActive = false;
            };

            for (let i = 0; i < 10; i++) {
                const event = this.scene.time.addEvent({
                    delay: velocity * i,
                    callback: () => creaAscia(i),
                });
                this.activeDefenceTimers.push(event);
            }
        }
    }


    // ─────────────────────────────────────────────────────────────────────────
    // ACTIVE DEFENCE 02 — falci
    // ─────────────────────────────────────────────────────────────────────────
    activeDefence02(x: IPlayer, z: Phaser.GameObjects.Graphics): void {

        if (this.shieldActive) {
            this.shieldActive = false;
            this.shieldUsed   = true;
            this._playShieldAnimation(() => { this.fineTurno(); });
            return;
        }

        if (this._vittoria == false) {
            const image       = this.scene.add.image(0, 0, "sfondo02").setOrigin(0, 0).setScale(10).setDepth(1002);
            const _box        = this.scene.add.image(1280 / 2, 400, "BOX").setScale(4).setDepth(1002);
            const _border     = this.scene.add.image(1280 / 2, 400, "BOX_BORDER").setScale(4).setDepth(1003);
            this.scene.physics.world.enable(_border);
            const _borderBody = <Phaser.Physics.Arcade.Body>_border.body;
            _borderBody.setCollideWorldBounds(true);
            _borderBody.setImmovable(true);

            this.p = this.scene.add.sprite(640, 400, "TU").setDepth(1002).setScale(2);
            this.scene.physics.world.enable(this.p);
            this.pBody = <Phaser.Physics.Arcade.Body>this.p.body;
            this.pBody.setCollideWorldBounds(true);
            this.pBody.setImmovable(true);
            this.pBody.setBoundsRectangle(new Phaser.Geom.Rectangle(360, 120, _border.width * 4, _border.height * 4));

            let controllo = true;

            const _weapon1    = this.scene.physics.add.sprite(450, 400, "Falce").setDepth(1002).setScale(1);
            const _weapon2    = this.scene.physics.add.sprite(850, 400, "Falce").setDepth(1002).setScale(1);
            const weaponBody1 = <Phaser.Physics.Arcade.Body>_weapon1.body;
            weaponBody1
                .setAngularVelocity(700)
                .setVelocityX(Phaser.Math.RND.between(-500, 500))
                .setVelocityY(Phaser.Math.RND.between(-500, 500))
                .setBounce(1).setCollideWorldBounds(true)
                .setBoundsRectangle(new Phaser.Geom.Rectangle(360, 120, _border.width * 4, _border.height * 4));
            const weaponBody2 = <Phaser.Physics.Arcade.Body>_weapon2.body;
            weaponBody2
                .setAngularVelocity(700)
                .setVelocityX(Phaser.Math.RND.between(-500, 500))
                .setVelocityY(Phaser.Math.RND.between(-500, 500))
                .setBounce(1).setCollideWorldBounds(true)
                .setBoundsRectangle(new Phaser.Geom.Rectangle(360, 120, _border.width * 4, _border.height * 4));

            let cleanupDone = false;

            const cleanup = () => {
                if (cleanupDone) return;
                cleanupDone = true;
                image.destroy();
                _border.destroy();
                _borderBody.destroy();
                _weapon1.destroy();
                _weapon2.destroy();
                weaponBody1.destroy();
                weaponBody2.destroy();
                this.p.destroy();
                this.pBody.destroy();
                _box.destroy();
                this.fineTurno();
            };

            this.scene.physics.add.collider(this.p, [_weapon1, _weapon2], () => {
                if (!controllo) return;
                this._dmg.play();
                this.Vita -= x.mossaSelected.danno;
                controllo = false;
                z.clear();
                if (this.Vita <= 0) { this.Vita = 0; }
                z.fillStyle(0x770000, 1)
                 .fillRect(550, 550, this.Vita, 20)
                 .lineStyle(4, 0x000000, 1)
                 .fillRoundedRect(550, 550, this.Vita, 20, 10)
                 .strokeRoundedRect(550, 550, this.Vita, 20, 10);
                cleanup();
            });

            this.scene.time.addEvent({ delay: 5000, callback: cleanup });
        }
    }


    // ─────────────────────────────────────────────────────────────────────────
    // ACTIVE DEFENCE 03 — croci
    // ─────────────────────────────────────────────────────────────────────────
    activeDefence03(x: IPlayer, z: Phaser.GameObjects.Graphics): void {

        if (this.shieldActive) {
            this.shieldActive = false;
            this.shieldUsed   = true;
            this._playShieldAnimation(() => { this.fineTurno(); });
            return;
        }

        if (this._vittoria == false) {
            const image       = this.scene.add.image(0, 0, "sfondoBoss03").setOrigin(0, 0).setScale(5).setDepth(1002);
            const _box        = this.scene.add.image(1280 / 2, 400, "BOX").setScale(4).setDepth(1002);
            const _border     = this.scene.add.image(1280 / 2, 400, "BOX_BORDER").setScale(4).setDepth(1003);
            this.scene.physics.world.enable(_border);
            const _borderBody = <Phaser.Physics.Arcade.Body>_border.body;
            _borderBody.setCollideWorldBounds(true);
            _borderBody.setImmovable(true);

            this.p = this.scene.add.sprite(640, 400, "TU").setDepth(1002).setScale(2);
            this.scene.physics.world.enable(this.p);
            this.pBody = <Phaser.Physics.Arcade.Body>this.p.body;
            this.pBody.setCollideWorldBounds(true);
            this.pBody.setImmovable(true);
            this.pBody.setBoundsRectangle(new Phaser.Geom.Rectangle(360, 120, _border.width * 4, _border.height * 4));
            this.scene.physics.add.collider(this.p, _border);

            let controllo = true;

            const creaCroce = (i: number) => {
                if (!controllo) return;

                const _Croce = this.scene.add
                    .sprite(Phaser.Math.RND.between(300, 900), 0, "Croci")
                    .setScale(1).setDepth(1002).setOrigin(0.5);
                this.activeCrosses.push(_Croce);

                this.scene.physics.world.enable(_Croce);
                const _croceBody = <Phaser.Physics.Arcade.Body>_Croce.body;
                _croceBody.setImmovable().setGravityY(600);

                if (x.Vita < x.maxVita / 2) {
                    const _Croce2 = this.scene.add
                        .sprite(Phaser.Math.RND.pick([0, 1200]), Phaser.Math.RND.between(150, 650), "Croci")
                        .setAngle(90).setScale(0.5).setDepth(1002).setOrigin(0.5);
                    this.activeCrosses.push(_Croce2);

                    this.scene.physics.world.enable(_Croce2);
                    const _croceBody2 = <Phaser.Physics.Arcade.Body>_Croce2.body;

                    if (_Croce2.x == 0)    { _Croce2.setAngle(0);   _croceBody2.setImmovable().setGravityX(300);  }
                    if (_Croce2.x == 1200) { _Croce2.setAngle(180); _croceBody2.setImmovable().setGravityX(-300); }

                    this.scene.physics.add.collider(this.pBody, _croceBody2, () => {
                        this._dmg.play();
                        this.Vita -= x.mossaSelected.danno;
                        controllo = false;
                        z.clear();
                        if (this.Vita <= 0) { this.Vita = 0; }
                        z.fillStyle(0x770000, 1)
                         .fillRect(550, 550, this.Vita, 20)
                         .lineStyle(4, 0x000000, 1)
                         .fillRoundedRect(550, 550, this.Vita, 20, 10)
                         .strokeRoundedRect(550, 550, this.Vita, 20, 10);
                        cleanup();
                    });
                }

                this.scene.physics.add.collider(this.pBody, _croceBody, () => {
                    this._dmg.play();
                    this.Vita -= x.mossaSelected.danno;
                    controllo = false;
                    z.clear();
                    if (this.Vita <= 0) { this.Vita = 0; }
                    z.fillStyle(0x770000, 1)
                     .fillRect(550, 550, this.Vita, 20)
                     .lineStyle(4, 0x000000, 1)
                     .fillRoundedRect(550, 550, this.Vita, 20, 10)
                     .strokeRoundedRect(550, 550, this.Vita, 20, 10);
                    cleanup();
                });

                if (i === 19) {
                    controllo = false;
                    cleanup();
                }
            };

            const cleanup = () => {
                this.activeCrosses.forEach(c => { if (c.body) c.destroy(); });
                this.activeCrosses = [];
                image.destroy();
                _border.destroy();
                _borderBody.destroy();
                this.p.destroy();
                this.pBody.destroy();
                _box.destroy();
                this.fineTurno();
            };

            for (let i = 0; i < 20; i++) {
                this.scene.time.addEvent({
                    delay: 500 * i,
                    callback: () => creaCroce(i),
                });
            }
        }
    }


    // ─────────────────────────────────────────────────────────────────────────
    // SHIELD ANIMATION
    // ─────────────────────────────────────────────────────────────────────────
    private _playShieldAnimation(onDone: () => void): void {
        const _overlay = this.scene.add.rectangle(0, 0, 1280, 800, 0x001133, 0.85)
            .setOrigin(0).setDepth(1500);

        const _shieldCircle = this.scene.add.graphics().setDepth(1501);
        _shieldCircle.lineStyle(8, 0x44aaff, 1);
        _shieldCircle.strokeCircle(640, 400, 120);

        const _shieldIcon = this.scene.add.sprite(640, 400, "TU")
            .setScale(3).setDepth(1502).setTint(0x44aaff);

        const _shieldText = this.scene.add.text(640, 260, "SHIELD ACTIVE", {
            fontFamily: "Underdog",
            fontSize: 70,
            color: "#44aaff",
            stroke: "#001133",
            strokeThickness: 8,
        }).setOrigin(0.5).setDepth(1502).setScale(0);

        this.scene.add.tween({
            targets: _shieldText,
            scale: 1.3,
            duration: 600,
            ease: "Back.easeOut",
            onComplete: () => {
                this.scene.add.tween({
                    targets: _shieldCircle,
                    alpha: 0,
                    duration: 400,
                    yoyo: true,
                    repeat: 2,
                    onComplete: () => {
                        this.scene.add.tween({
                            targets: [_overlay, _shieldCircle, _shieldIcon, _shieldText],
                            alpha: 0,
                            duration: 600,
                            ease: "Power2",
                            onComplete: () => {
                                _overlay.destroy();
                                _shieldCircle.destroy();
                                _shieldIcon.destroy();
                                _shieldText.destroy();
                                onDone();
                            },
                        });
                    },
                });
            },
        });
    }


    // ─────────────────────────────────────────────────────────────────────────
    // SCONFITTA
    // ─────────────────────────────────────────────────────────────────────────
    sconfitta(): void {
        const _sfondoNero = this.scene.add.image(0, 0, "sfondoNero")
            .setOrigin(0, 0).setAlpha(0).setDepth(1002).setInteractive();
        const lost = this.scene.add.text(600, 400, "GAME OVER", {
            fontFamily: "Underdog", fontSize: 100, color: "#ff0000",
        }).setOrigin(0.5).setDepth(1005);

        this.sizeUp(lost, "GAME OVER");
        this.scene.add.tween({
            targets: _sfondoNero,
            alpha: 1,
            duration: 4000,
            ease: "linear",
            repeat: 0,
            onComplete: () => {
                this.scene.sound.stopAll();
                this.scene.scene.start("Intro");
            },
        });
    }


    // ─────────────────────────────────────────────────────────────────────────
    // VITTORIA
    // ─────────────────────────────────────────────────────────────────────────
    vittoria(x: string, y: number): void {
        const _sfondoNero = this.scene.add.image(0, 0, "sfondoNero")
            .setOrigin(0, 0).setAlpha(0).setDepth(1002).setInteractive();
        const won = this.scene.add.text(600, 400, "ENEMY SLAYED", {
            fontFamily: "Underdog", fontSize: 100, color: "#ffff00",
        }).setOrigin(0.5).setDepth(1005);

        this.sizeUp(won, "Enemy Slayed");
        this.animationSfondoNero(_sfondoNero, x, y);
    }

    animationSfondoNero(params: any, levely: string, fase: number): void {
        this.scene.add.tween({
            targets: params,
            alpha: 1,
            duration: 4000,
            ease: "linear",
            repeat: 0,
            onComplete: () => {
                this.scene.sound.stopAll();
                this.scene.scene.start("BossLead");
                this.scene.registry.set("level", levely);
                this.scene.registry.set("fase", fase);
            },
        });
    }


    // ─────────────────────────────────────────────────────────────────────────
    // UTILS
    // ─────────────────────────────────────────────────────────────────────────
    onTwiin(params: any, x: number): void {
        this.scene.add.tween({
            targets: params, scale: x, duration: 100, ease: "linear", repeat: 0,
        });
    }

    sizeUp(text: Phaser.GameObjects.Text, t: string, onComplete?: () => void): void {
        text.setScale(0);
        text.setText(t);
        text.setVisible(true);

        this.scene.add.tween({
            targets: text,
            scale: 1.5,
            duration: 3000,
            ease: "Power2",
            onComplete: () => {
                this.scene.add.tween({
                    targets: text,
                    alpha: 0,
                    scale: 1,
                    duration: 1000,
                    ease: "Power2",
                });
            },
        });
    }
}