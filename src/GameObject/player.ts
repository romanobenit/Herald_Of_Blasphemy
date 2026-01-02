import { GameData } from "../GameData";
import GameOver from "../scenes/GameOver";
import iMosse from "./iMosse";
import IPlayer from "./iPlayer";


export default class Player extends Phaser.GameObjects.Sprite implements IPlayer {

    private _genericConfig: genericConfig;
    private game:boolean = true;
    private _dmg: Phaser.Sound.BaseSound;

    
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

    turn: boolean;

    constructor(params: genericConfig, nome: string, Vita: number, maxVita: number, Mana: number, maxMana: number, mosse: iMosse[])
    {
        super(params.scene, params.x, params.y, params.key);
        this.nome = nome;
        this.Vita = Vita;
        this.maxVita = maxVita;
        this.Mana = Mana;
        this.maxMana = maxMana;
        this.mosse = mosse;
        this.mossaSelected = mosse[0];
        this.turn = true;
        this.p = this.scene.add.sprite(0,0,"TU");
        this.pBody = <Phaser.Physics.Arcade.Body>this.p.body;
        this.keyboard = this.scene.input.keyboard.createCursorKeys();
        this._dmg = this.scene.sound.add("dmg");
    }

    update(time: number, delta: number,x: IPlayer, y: Phaser.GameObjects.Sprite, sp: string, n: number, liv:string, fase:number): void {
        if(this.game == true){
            if(this.Vita == 0){
                this.sconfitta();
                this.game = false;
            }
            if(x.Vita == 0){
                this._vittoria = true;
                this.vittoria(liv, fase);
                let polloArrosto = this.scene.physics.add.sprite(900, 250, sp, 5).setScale(4).setDepth(1);
                polloArrosto.setAngularVelocity(n);
                y.destroy();
                this.game = false;
            }
        }

        if(this.keyboard.up.isDown == true){
            this.p.y-= 10;
        }
        else if(this.keyboard.down.isDown == true){
            this.p.y+= 10;
        }
        else if(this.keyboard.left.isDown == true){
            this.p.x-= 10;
        }
        else if(this.keyboard.right.isDown == true){
            this.p.x+= 10;
        }
        
    }

    fineTurno(): void {
        this.turn = !this.turn;
    }
    attack(x: IPlayer, y: Phaser.GameObjects.Sprite, z: Phaser.GameObjects.Graphics, t: Phaser.GameObjects.Text): number {

        if(this.Mana >= this.mossaSelected.costo){
            this.Mana -= this.mossaSelected.costo;
            t.setText(this.Mana.toString());

            let _container: Phaser.GameObjects.Container = this.scene.add.container(0, 0).setDepth(2002).setInteractive();
            let _sfondo: Phaser.GameObjects.Image = this.scene.add.image(0,0,"layer").setOrigin(0).setInteractive();
            let _Test: Phaser.GameObjects.Image = this.scene.add.image(640,400,"AttackTest").setOrigin(0.5).setScale(10).setInteractive();
            let _pallino: Phaser.GameObjects.Image = this.scene.add.image(0,400,"TU").setOrigin(0.5).setScale(3).setInteractive();

            _container.add([_sfondo,_Test,_pallino]);
            this.scene.add.tween({
                targets: _pallino,
                x: 1280,
                ease: 'linear',
                duration: Phaser.Math.RND.between(1100,1200),
                repeat: 0,
                onComplete: () => {
                    _container.destroy();
                },
            });


            this.scene.input.keyboard.on( "keydown-SPACE",() => {
                if(_pallino.x > 500 && _pallino.x < 780){
                    x.Vita -= this.mossaSelected.danno;
                    if(x.Vita > 0){
                        this.scene.add.tween({
                            targets: y,
                            x: y.x + 20,
                            ease: 'Sine.easeInOut',
                            duration: 20,
                            yoyo: true, 
                            repeat: 10, 
                            callbacks: () => {
                                y.setFrame(4);
                            },
                            onComplete: () => {
                                y.setFrame(0);
                            },
                        });
                    }
                    z.clear();
                    if(x.Vita <= 0){
                        x.Vita = 0;
                    }
                    z.fillRect(20, 50, x.Vita, 20).lineStyle(4, 0x000000, 1).fillRoundedRect(20, 50,  x.Vita, 20, 10)
                    .strokeRoundedRect(20, 50,  x.Vita, 20, 10);
                }
                _container.destroy();
            });
            /*_Test.on("pointerdown", () =>{
                if(_pallino.x > 500 && _pallino.x < 780){
                    x.Vita -= this.mossaSelected.danno;
                    if(x.Vita > 0){
                        this.scene.add.tween({
                            targets: y,
                            x: y.x + 20,
                            ease: 'Sine.easeInOut',
                            duration: 20,
                            yoyo: true, 
                            repeat: 10, 
                            callbacks: () => {
                                y.setFrame(2);
                            },
                            onComplete: () => {
                                y.setFrame(0);
                            },
                        });
                    }
                    z.clear();
                    if(x.Vita <= 0){
                        x.Vita = 0;
                    }
                    z.fillRect(20, 50, x.Vita, 20).lineStyle(4, 0x000000, 1).fillRoundedRect(20, 50,  x.Vita, 20, 10)
                    .strokeRoundedRect(20, 50,  x.Vita, 20, 10);
                }
                _container.destroy();
            });
            */
            this.fineTurno();
            return this.mossaSelected.danno;
            

            
        }
        
    }


    //TECH---------------------------------------------------------------------------------------------------------------------------
    tech(): iMosse {
        let container: Phaser.GameObjects.Container = this.scene.add.container(0, 0).setDepth(2002);
    
        let modal: Phaser.GameObjects.Image = this.scene.add.image(1280 / 2, 800 / 2, "movesetGUI")
            .setOrigin(0.5)
            .setInteractive();
        container.add(modal);
    
        let text: Phaser.GameObjects.Text = this.scene.add.text(1280 / 2, 165, "Scegli la mossa!")
            .setOrigin(0.5)
            .setDepth(2001)
            .setFontSize(37)
            .setFontFamily("Underdog")
            .setShadow(2, 2, "#000000", 2, false, true);
        container.add(text);

        let _sfondoMomentaneo: Phaser.GameObjects.Image = this.scene.add.image(0,0,"layer").setOrigin(0).setInteractive()
        .on("pointerdown", () => {
            container.destroy();
        });
        container.add(_sfondoMomentaneo);

        let position = 250;
        for (const i in this.mosse) {
            let Moves: Phaser.GameObjects.Text = this.scene.add.text(1280 / 2, position, this.mosse[i].nome)
                .setDepth(2001)
                .setOrigin(0.5)
                .setColor("#ffffff")
                .setFontFamily("Underdog")
                .setFontSize(40)
                .setInteractive()
                .setWordWrapWidth(700);

                let infoText: Phaser.GameObjects.Text = this.scene.add
                .text(1280 / 2, position + 40,  this.mosse[i].danno.toString()+ " / "+this.mosse[i].costo.toString()).
                setDepth(2001).
                setOrigin(0.5).
                setColor("#ffffff").
                setFontFamily("Underdog").
                setFontSize(20).
                setVisible(false);


                Moves.on("pointerdown", () => {
                    this.mossaSelected = this.mosse[i];
                    container.destroy();
                    console.log(this.mossaSelected.nome);
                    })
                    .on("pointerover", () => {
                        this.onTwiin(Moves, 1.1);
                        infoText.setVisible(true);
                      })
                      .on("pointerout", () => {
                        this.onTwiin(Moves, 1);
                        infoText.setVisible(false);
                      });
            container.add(infoText);
            container.add(Moves);
            position += 75;
        }
        return this.mossaSelected;
    }


    inventory(t: Phaser.GameObjects.Text, z: Phaser.GameObjects.Graphics): void {
        let _container: Phaser.GameObjects.Container = this.scene.add.container(0,0).setDepth(2002);
        let _inventoryGUI: Phaser.GameObjects.Image =  this.scene.add.image(1280/2, 400, "INV");
        
        let item1: Phaser.GameObjects.Image = this.scene.add.image(400, 400, "pozioneVita").setScale(3.5);
        let item2: Phaser.GameObjects.Image = this.scene.add.image(520, 400, "pozioneMana").setScale(3.5);
        let item3: Phaser.GameObjects.Image = this.scene.add.image(640, 400, "pozioneAttacco").setScale(3.5);
        
        let descrizione: Phaser.GameObjects.Text = this.scene.add.text(400, 470, "Vita +20").setAlpha(0).setOrigin(0.5);


        let _Text: Phaser.GameObjects.Text = this.scene.add.text(1280/2, 330, "INVENTARIO")
        .setDepth(2001)
        .setOrigin(0.5)
        .setFontSize(25)
        .setFontFamily("Underdog")
        .setColor("#ffffff");

        item1.setInteractive().on("pointerdown", () => {
            if(this.Vita < this.maxVita-20){
                this.Vita += 60;
                this.fineTurno();
                z.fillRect(550, 550, this.Vita, 20).lineStyle(4, 0x000000, 1).fillRoundedRect(550, 550,  this.Vita, 20, 10)
                .strokeRoundedRect(550, 550,  this.Vita, 20, 10);
            }
            _container.destroy();
        }).on("pointerover", () => {
            this.onTwiin(item1, 3.7);
            descrizione.setAlpha(1).setText("Vita +60");
            descrizione.x = 400;
        }).on("pointerout", () => {
            this.onTwiin(item1, 3.5);
            descrizione.setAlpha(0);
        });

        item2.setInteractive().on("pointerdown", () => {
            if(this.Mana+1 < this.maxMana){
                this.Mana += 2;
                t.setText(this.Mana.toString());
                this.fineTurno();
            }
            _container.destroy();
        }).on("pointerover", () => {
            this.onTwiin(item2, 3.7);
            descrizione.setAlpha(1).setText("Mana +2");
            descrizione.x = 520;
        }).on("pointerout", () => {
            this.onTwiin(item2, 3.5);
            descrizione.setAlpha(0);
        });

        item3.setInteractive().on("pointerdown", () => {
            this.mossaSelected.danno += 15;
            this.fineTurno();
            _container.destroy();
        }).on("pointerover", () => {
                this.onTwiin(item3, 3.7);
                descrizione.setAlpha(1).setText("Danno +15");
                descrizione.x = 640;
            }).on("pointerout", () => {
                this.onTwiin(item3, 3.5);
                descrizione.setAlpha(0);
            });

        let _sfondoMomentaneo: Phaser.GameObjects.Image = this.scene.add.image(0,0,"layer").setOrigin(0).setInteractive().setDepth(10)
        .on("pointerdown", () => {
            _container.destroy();
        });
        _container.add([ _sfondoMomentaneo,_inventoryGUI,_Text,item1,item2,item3, descrizione]);
        
    }

    takedamage(damage: number): void {
        
    }












//ACTIVE DEFENCE---------------------------------------------------------------------------------------------------------------------------------------
activeDefence01(x: IPlayer, z: Phaser.GameObjects.Graphics): void {

    let velovity:number = 1000;

    if(x.Vita < x.maxVita/2){
        velovity = 500;
    }

    if(this._vittoria == false){
    let image = this.scene.add.image(0, 0, "sfondoBoss01").setOrigin(0, 0).setScale(5).setDepth(1002);
    let _box = this.scene.add.image(1280 / 2, 400,"BOX").setScale(4).setDepth(1002);
    let _border: Phaser.GameObjects.Image = this.scene.add.image(1280 / 2, 400, "BOX_BORDER").setScale(4).setDepth(1003);
    this.scene.physics.world.enable(_border);
    let _borderBody: Phaser.Physics.Arcade.Body = <Phaser.Physics.Arcade.Body>_border.body;
    
    _borderBody.setCollideWorldBounds(true);
    _borderBody.setImmovable(true);

    this.p = this.scene.add.sprite(640, 400, "TU").setDepth(1002).setScale(2);
    this.scene.physics.world.enable(this.p); 
    this.pBody = <Phaser.Physics.Arcade.Body>this.p.body;
    this.pBody.setCollideWorldBounds(true); 
    this.pBody.setImmovable(true);

    this.pBody.setBoundsRectangle(new Phaser.Geom.Rectangle(360, 120, _border.width*4, _border.height*4));

    this.scene.physics.add.collider(this.p, _border);

    let controllo: boolean = true;

    const creaAscia = (i: number) => {
        if (!controllo) return; 

        let _axe: Phaser.GameObjects.Sprite = this.scene.add
            .sprite(Phaser.Math.RND.between(100, 1180), Phaser.Math.RND.pick([50, 750]), "AXE")
            .setScale(1)
            .setDepth(1002)
            .setOrigin(.5);

        let angle = Phaser.Math.Angle.Between(_axe.x, _axe.y, this.p.x, this.p.y);
        _axe.setRotation(angle);

        this.scene.physics.world.enable(_axe);
        let _axeBody: Phaser.Physics.Arcade.Body = <Phaser.Physics.Arcade.Body>_axe.body;
        _axeBody.setImmovable();
        let speed = Phaser.Math.RND.between(350, 650);
        _axeBody.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        _axeBody.setAngularVelocity(700);

        this.scene.physics.add.collider(this.pBody, _axeBody, () => {
            console.log("Player colpito dall'ascia!");
            this._dmg.play();
            this.Vita -= x.mossaSelected.danno;
            controllo = false;
            z.clear();
            if(this.Vita <= 0){
                this.Vita = 0;
            }
            z.fillRect(550, 550, this.Vita, 20).lineStyle(4, 0x000000, 1).fillRoundedRect(550, 550, this.Vita, 20, 10)
            .strokeRoundedRect(550, 550, this.Vita, 20, 10);
            cleanup();
        });

        if (i === 9) {
            console.log("FineTurno Boss");
            controllo = false;
            cleanup();
        }
    };

    const cleanup = () => {
        image.destroy();
        _border.destroy();
        _borderBody.destroy();
        this.p.destroy();
        this.pBody.destroy();
        this.fineTurno();
        _box.destroy();
    };

    for (let i = 0; i < 10; i++) {
        this.scene.time.addEvent({
            delay: velovity * i,
            callback: () => creaAscia(i),
        });
    }
}
}












activeDefence02(x: IPlayer, z: Phaser.GameObjects.Graphics): void {
    if (this._vittoria == false) {
        let image = this.scene.add.image(0, 0, "sfondo02").setOrigin(0, 0).setScale(10).setDepth(1002);
        let _box = this.scene.add.image(1280 / 2, 400, "BOX").setScale(4).setDepth(1002);
        let _border: Phaser.GameObjects.Image = this.scene.add.image(1280 / 2, 400, "BOX_BORDER").setScale(4).setDepth(1003);
        this.scene.physics.world.enable(_border);
        let _borderBody: Phaser.Physics.Arcade.Body = <Phaser.Physics.Arcade.Body>_border.body;

        _borderBody.setCollideWorldBounds(true);
        _borderBody.setImmovable(true);

        this.p = this.scene.add.sprite(640, 400, "TU").setDepth(1002).setScale(2);
        this.scene.physics.world.enable(this.p);
        this.pBody = <Phaser.Physics.Arcade.Body>this.p.body;
        this.pBody.setCollideWorldBounds(true);
        this.pBody.setImmovable(true);

        this.pBody.setBoundsRectangle(new Phaser.Geom.Rectangle(360, 120, _border.width * 4, _border.height * 4));

        let controllo: boolean = true;

        let _weapon1: Phaser.GameObjects.Sprite = this.scene.physics.add.sprite(450, 400, "Falce").setDepth(1002).setScale(1);
        let _weapon2: Phaser.GameObjects.Sprite = this.scene.physics.add.sprite(850, 400, "Falce").setDepth(1002).setScale(1);
        let weaponBody1: Phaser.Physics.Arcade.Body = <Phaser.Physics.Arcade.Body>_weapon1.body;
        weaponBody1.setAngularVelocity(700)
            .setVelocityX(Phaser.Math.RND.between(-500, 500))
            .setVelocityY(Phaser.Math.RND.between(-500, 500))
            .setBounce(1).setCollideWorldBounds(true)
            .setBoundsRectangle(new Phaser.Geom.Rectangle(360, 120, _border.width * 4, _border.height * 4));
        let weaponBody2: Phaser.Physics.Arcade.Body = <Phaser.Physics.Arcade.Body>_weapon2.body;
        weaponBody2.setAngularVelocity(700)
            .setVelocityX(Phaser.Math.RND.between(-500, 500))
            .setVelocityY(Phaser.Math.RND.between(-500, 500))
            .setBounce(1).setCollideWorldBounds(true)
            .setBoundsRectangle(new Phaser.Geom.Rectangle(360, 120, _border.width * 4, _border.height * 4));

        // Aggiungo una flag per evitare chiamate multiple a cleanup
        let cleanupDone = false;

        const cleanup = () => {
            if (cleanupDone) return; // Evita chiamate multiple
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
            this.fineTurno();
            _box.destroy();
        };

        this.scene.physics.add.collider(this.p, [_weapon1, _weapon2], () => {
            if (!controllo) return; // Assicura che l'evento collider venga gestito una sola volta
            console.log("Player colpito dalla falce!");
            this._dmg.play();
            this.Vita -= x.mossaSelected.danno;
            controllo = false;
            z.clear();
            if (this.Vita <= 0) {
                this.Vita = 0;
            }
            z.fillRect(550, 550, this.Vita, 20).lineStyle(4, 0x000000, 1).fillRoundedRect(550, 550, this.Vita, 20, 10)
                .strokeRoundedRect(550, 550, this.Vita, 20, 10);
            cleanup();
        });

        this.scene.time.addEvent({
            delay: 5000,
            callback: cleanup,
        });
    }
}











activeDefence03(x: IPlayer, z: Phaser.GameObjects.Graphics): void {
    if(this._vittoria == false){
        let image = this.scene.add.image(0, 0, "sfondoBoss03").setOrigin(0, 0).setScale(5).setDepth(1002);
        let _box = this.scene.add.image(1280 / 2, 400,"BOX").setScale(4).setDepth(1002);
        let _border: Phaser.GameObjects.Image = this.scene.add.image(1280 / 2, 400, "BOX_BORDER").setScale(4).setDepth(1003);
        this.scene.physics.world.enable(_border);
        let _borderBody: Phaser.Physics.Arcade.Body = <Phaser.Physics.Arcade.Body>_border.body;
        
        _borderBody.setCollideWorldBounds(true);
        _borderBody.setImmovable(true);
    
        this.p = this.scene.add.sprite(640, 400, "TU").setDepth(1002).setScale(2);
        this.scene.physics.world.enable(this.p); 
        this.pBody = <Phaser.Physics.Arcade.Body>this.p.body;
        this.pBody.setCollideWorldBounds(true); 
        this.pBody.setImmovable(true);
    
        this.pBody.setBoundsRectangle(new Phaser.Geom.Rectangle(360, 120, _border.width*4, _border.height*4));

     
        this.scene.physics.add.collider(this.p, _border);
    
        let controllo: boolean = true;
    
        const creaCroce = (i: number) => {
            
            if (!controllo) return; 
    
            let _Croce: Phaser.GameObjects.Sprite = this.scene.add
                .sprite(Phaser.Math.RND.between(300, 900), 0, "Croci")
                .setScale(1)
                .setDepth(1002)
                .setOrigin(.5);
    
            
    
            this.scene.physics.world.enable(_Croce);
            let _croceBody: Phaser.Physics.Arcade.Body = <Phaser.Physics.Arcade.Body>_Croce.body;
            _croceBody.setImmovable().setGravityY(600);


            if(x.Vita < x.maxVita/2){
                let _Croce2: Phaser.GameObjects.Sprite = this.scene.add
                .sprite(Phaser.Math.RND.pick([0, 1200]), Phaser.Math.RND.between(150, 650), "Croci")
                .setAngle(90)
                .setScale(.5)
                .setDepth(1002)
                .setOrigin(.5);


                this.scene.physics.world.enable(_Croce2);
                let _croceBody2: Phaser.Physics.Arcade.Body = <Phaser.Physics.Arcade.Body>_Croce2.body;
                

                if(_Croce2.x == 0){
                    _Croce2.setAngle(0);
                    _croceBody2.setImmovable().setGravityX(300);
                }
                if(_Croce2.x == 1200){
                    _Croce2.setAngle(180);
                    _croceBody2.setImmovable().setGravityX(-300);
                }

                this.scene.physics.add.collider(this.pBody, _croceBody2, () => {
                    console.log("Player colpito dalla croce!");
                    this._dmg.play();
                    this.Vita -= x.mossaSelected.danno;
                    controllo = false;
                    z.clear();
                    if(this.Vita <= 0){
                        this.Vita = 0;
                    }
                    z.fillRect(550, 550, this.Vita, 20).lineStyle(4, 0x000000, 1).fillRoundedRect(550, 550, this.Vita, 20, 10)
                    .strokeRoundedRect(550, 550, this.Vita, 20, 10);
                    cleanup();
                });
            }
            
    
            this.scene.physics.add.collider(this.pBody, _croceBody, () => {
                console.log("Player colpito dalla croce!");
                this._dmg.play();
                this.Vita -= x.mossaSelected.danno;
                controllo = false;
                z.clear();
                if(this.Vita <= 0){
                    this.Vita = 0;
                }
                z.fillRect(550, 550, this.Vita, 20).lineStyle(4, 0x000000, 1).fillRoundedRect(550, 550, this.Vita, 20, 10)
                .strokeRoundedRect(550, 550, this.Vita, 20, 10);
                cleanup();
            });

            
    
            if (i === 19) {
                console.log("FineTurno Boss");
                controllo = false;
                cleanup();
            }
        };


        
    
        const cleanup = () => {
            image.destroy();
            _border.destroy();
            _borderBody.destroy();
            this.p.destroy();
            this.pBody.destroy();
            this.fineTurno();
            _box.destroy();
        };
    
        for (let i = 0; i < 20; i++) {
            this.scene.time.addEvent({
                delay: 500 * i,
                callback: () => creaCroce(i),
            });
        }
    }
}









sconfitta(): void {
    console.log("fine gioco");
    let _sfondoNero = this.scene.add.image(0, 0, "sfondoNero").setOrigin(0, 0).setAlpha(0).setDepth(1002).setInteractive();
    let lost: Phaser.GameObjects.Text = this.scene.add.text(600,400,"GAME OVER",{
        fontFamily: "Underdog",
        fontSize: 100,
        color: "#ff0000",
    }).setOrigin(0.5).setDepth(1005);
    
    this.sizeUp(lost,"GAME OVER");
    this.scene.add.tween({
        targets: _sfondoNero,
        alpha: 1,
        duration: 4000,
        ease: "linear",
        repeat: 0,
        onComplete: () =>{
          this.scene.sound.stopAll();
          this.scene.scene.start("Intro");
        },
      });
}


onTwiin(params: any, x: number): void {
    this.scene.add.tween({
      targets: params,
      scale: x,
      duration: 100,
      ease: "linear",
      repeat: 0,
    });
  }


  vittoria(x:string, y:number): void {
    let _sfondoNero = this.scene.add.image(0, 0, "sfondoNero").setOrigin(0, 0).setAlpha(0).setDepth(1002).setInteractive();
    let won: Phaser.GameObjects.Text = this.scene.add.text(600,400,"ENEMY SLAYED",{
        fontFamily: "Underdog",
        fontSize: 100,
        color: "#ffff00",
    }).setOrigin(0.5).setDepth(1005);
    
    this.sizeUp(won,"Enemy Slayed");
    this.animationSfondoNero(_sfondoNero, x, y);
    }



  animationSfondoNero(params: any, levely: string, fase:number){
    this.scene.add.tween({
      targets: params,
      alpha: 1,
      duration: 4000,
      ease: "linear",
      repeat: 0,
      onComplete: () =>{
        this.scene.sound.stopAll();
        this.scene.scene.start("BossLead");
        this.scene.registry.set("level", levely)
        this.scene.registry.set("fase", fase);
      },
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




