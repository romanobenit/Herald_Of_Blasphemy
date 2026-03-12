//viene importato un riferimento a gamedata per poter usare le variabili globali
import { GameData } from "../GameData";

//creiamo la classe Boot che estende Phaser.Scene
export default class Boot extends Phaser.Scene {


  private _text: Phaser.GameObjects.Text;
  //il costruttore richiama il costruttore della classe Phaser.Scene
  //si usa il metodo super per richiamare il costruttore della classe Phaser.Scene

  constructor() {
    // il metodo super prende come parametro un oggetto con una chiave key che ha come valore il nome della scena
    super({
      key: "Boot",
    });

  }

  //il metodo init viene chiamato all'inizio della scena
  //in questo caso non esegue nessuna operazione
  init() {

  }
  //il metodo preload viene chiamato dopo il metodo init
  //nel metodo preload vengono caricati gli assets che servono per il caricamento della scena successiva
  preload() {


    //settiamo il colore di sfondo della scena
    this.cameras.main.setBackgroundColor("#000000");
    //precarichiamo l'immagine del logo
    this.load.image("logo", "assets/images/phaser.png");
    this.load.image("BootImage", "assets/images/preloaderimage.png");
  }

  //il metodo create viene chiamato dopo il metodo preload
  create() {
    let graphics:Phaser.GameObjects.Graphics = this.add.graphics();
    graphics.fillStyle(0x808080, 0.4);
    graphics.fillRect(0,0,1280,800);
    graphics.generateTexture("layer", 1280, 800); 
    graphics.fillStyle(0x808080, 1);
    graphics.fillRoundedRect(0,0,800,500,20);
    graphics.generateTexture("modal", 800, 500);
    
    //Bordo per il credits
    graphics.fillStyle(0x808080, 1);
    graphics.fillRoundedRect(0,0,800,500,10);
    graphics.lineStyle(5, 0x000000,1);
    graphics.strokeRoundedRect(0,0,800,500,10);
    graphics.generateTexture("modal", 800, 500);
    graphics.destroy();

    

    //BOSS BOX

    let BOX:Phaser.GameObjects.Graphics = this.add.graphics();
    BOX.fillStyle(0x333333, 0.4);
    BOX.fillRect(0,0,1280,800);
    BOX.generateTexture("layer", 1280, 800); 
    BOX.fillStyle(0x333333, 1);
    BOX.fillRoundedRect(0,0,140,140,20);
    BOX.generateTexture("BOX", 140, 140);
    
    let BORDER:Phaser.GameObjects.Graphics = this.add.graphics();
    BORDER.lineStyle(5, 0xFFFFFF, 1);
    BORDER.strokeRoundedRect(0,0,140,140,10);
    BORDER.generateTexture("BOX_BORDER", 140, 140);
    BORDER.destroy();
    BOX.destroy();

    //TEXT BOX
    let GUI:Phaser.GameObjects.Graphics = this.add.graphics();
    GUI.fillStyle(0x808080, 0.4);
    GUI.fillRect(0,0,1280,800);
    GUI.generateTexture("layer", 1280, 800); 
    GUI.fillStyle(0x808080, 1);
    GUI.fillRoundedRect(0,0,600,140,20);
    GUI.generateTexture("GUI", 600, 140);
    
    //TEXT BOX BORDER
    GUI.fillStyle(0x808080, 1);
    GUI.fillRoundedRect(0,0,600,140,10);
    GUI.lineStyle(5, 0x000000,1);
    GUI.strokeRoundedRect(0,0,600,140,10);
    GUI.generateTexture("GUI", 600, 140);
    GUI.destroy();

    //INVENTORY BOX
    let INV:Phaser.GameObjects.Graphics = this.add.graphics();
    INV.fillStyle(0x808080, 0.4);
    INV.fillRect(0,0,1280,800);
    INV.generateTexture("MITA", 1280, 800); 
    INV.fillStyle(0x808080, 1);
    INV.fillRoundedRect(0,0,600,179,20);
    INV.generateTexture("INV", 600, 179);
    
    //INVENTORY BOX BORDER
    INV.fillStyle(0x808080, 1);
    INV.fillRoundedRect(0,0,600,179,10);
    INV.lineStyle(5, 0x000000,1);
    INV.strokeRoundedRect(0,0,600,179,10);
    INV.generateTexture("INV", 600, 179);
    INV.destroy();


    //MOVESET
    let graphicsS:Phaser.GameObjects.Graphics = this.add.graphics();
    graphicsS.fillStyle(0x808080, 0.4);
    graphicsS.fillRect(0,0,1280,800);
    graphicsS.generateTexture("test", 1280, 800); 
    graphicsS.fillStyle(0x808080, 1);
    graphicsS.fillRoundedRect(0,0,350,600,20);
    graphicsS.generateTexture("movesetGUI", 350, 600);
    
    //MOVESET BORDER
    graphicsS.fillStyle(0x808080, 1);
    graphicsS.fillRoundedRect(0,0,350,600,10);
    graphicsS.lineStyle(5, 0x000000,1);
    graphicsS.strokeRoundedRect(0,0,350,600,10);
    graphicsS.generateTexture("movesetGUI", 350, 600);
    graphicsS.destroy();

    //Attack button
    let button:Phaser.GameObjects.Graphics = this.add.graphics();
    button.fillStyle(0x000000, 1);
    button.fillRoundedRect(0,0,300,75,10);
    button.lineStyle(2, 0xFFFFFF,1);
    button.strokeRoundedRect(0,0,300,75,10);
    button.generateTexture("button", 300, 75);
    button.destroy();
    
    let graphycs = this.add.graphics();
    graphycs.fillStyle(0x000000, 1);
    graphycs.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    graphycs.generateTexture("sfondoNero", this.game.canvas.width, this.game.canvas.height);
    graphycs.destroy();
   

    //fermiamo la scena corrente
    this.scene.stop("Boot");
    //richiamiamo il metodo start della scena Preloader per
    //passare alla scena successiva
    this.scene.start("Preloader");

  }

  update(time: number, delta: number): void {

    //this._text.angle += 1;

  }




}
