//importiamo la classe GameData
import { GameData } from "../GameData";
import WebFontFile from '../scenes/webFontFile';

export default class Preloader extends Phaser.Scene {

  private _loading: Phaser.GameObjects.Text;
  private _mita: Phaser.GameObjects.Text;
  private _progress: Phaser.GameObjects.Graphics;
  private _image: Phaser.GameObjects.Image;


  constructor() {
    super({
      key: "Preloader",
    });
  }

  preload() {
    this.cameras.main.setBackgroundColor(GameData.globals.bgColor);
    this.load.image("PreImage", "assets/images/preloaderImage_.png");
    this._progress = this.add.graphics();
    this.loadAssets();
  }

create(){

  let _sfondoNero: Phaser.GameObjects.Image = this.add.image(0, 0, "sfondoNero").setOrigin(0, 0).setAlpha(0).setDepth(1002);
  this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, "PreImage").setOrigin(0.5).setScale(5);
  this._mita = this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2+100, "Embrace your faith.");
  this._mita.setOrigin(0.5).setInteractive().
  setAlpha(1).setAngle(0)
    .setShadow(5, 5, "#777777", 5, true, true)
    .setFlipX(false).setFlipY(false).setFontSize(40).setScale(1)
    this._mita.setStroke("#000000", 10).
    on("pointerover", () => {
      this._mita.setColor("#ff0000");
    }).on("pointerout", () => {
      this._mita.setColor("#ffffff");
    }).on("pointerdown", () => {
      this.tweens.add({
        targets: _sfondoNero,
        alpha: 1,
        duration: 1000,
        ease: "Power2",
        onComplete: () => {
          this.scene.stop("Preloader");
          this.scene.start("Intro");
        },
      });
    });

    this.tweens.add({
      targets: this._mita,
      angle: { from: -10, to: 10 },
      duration: 4500,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });
}

  init() {

  }

  loadAssets(): void {

    //Assets Load
    //--------------------------

    //WEB FONT
    if (GameData.webfonts != null) {
      let _fonts: Array<string> = [];
      GameData.webfonts.forEach((element: FontAsset) => {
        _fonts.push(element.key);
      });
      this.load.addFile(new WebFontFile(this.load, _fonts));
    }

    //local FONT
    if (GameData.fonts != null) {
      let _fonts: Array<string> = [];
      GameData.fonts.forEach((element: FontAsset) => {
        this.load.font(element.key, element.path,element.type);
      });
      
    }



    //SCRIPT
    if (GameData.scripts != null)
      GameData.scripts.forEach((element: ScriptAsset) => {
        this.load.script(element.key, element.path);
      });

    // IMAGES
    if (GameData.images != null)
      GameData.images.forEach((element: ImageAsset) => {
        this.load.image(element.name, element.path);
      });

    // TILEMAPS
    if (GameData.tilemaps != null)
      GameData.tilemaps.forEach((element: TileMapsAsset) => {
        this.load.tilemapTiledJSON(element.key, element.path);
      });

    // ATLAS
    if (GameData.atlas != null)
      GameData.atlas.forEach((element: AtlasAsset) => {
        this.load.atlas(element.key, element.imagepath, element.jsonpath);
      });

    // SPRITESHEETS
    if (GameData.spritesheets != null)
      GameData.spritesheets.forEach((element: SpritesheetsAsset) => {
        this.load.spritesheet(element.name, element.path, {
          frameWidth: element.width,
          frameHeight: element.height,
          endFrame: element.frames,
        });
      });

    //video 
    if (GameData.videos != null) {
      GameData.videos.forEach((element: VideoAsset) => {
        this.load.video(element.name, element.path, true);
      });
    }

    //bitmap fonts
    if (GameData.bitmapfonts != null)
      GameData.bitmapfonts.forEach((element: BitmapfontAsset) => {
        this.load.bitmapFont(element.name, element.imgpath, element.xmlpath);
      });

    // SOUNDS
    if (GameData.sounds != null)
      GameData.sounds.forEach((element: SoundAsset) => {
        this.load.audio(element.name, element.paths);
      });

    // Audio
    if (GameData.audios != null)
      GameData.audios.forEach((element: AudioSpriteAsset) => {
        this.load.audioSprite(
          element.name,
          element.jsonpath,
          element.paths,
          element.instance
        );
      });
  }
}
