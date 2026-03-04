//importiamo la libreria phaser
import "phaser";
//importiamo le nostre scene
import Boot from "./scenes/Boot";
import Hud from "./scenes/Hud";
import Preloader from "./scenes/Preloader";
import GamePlay from "./scenes/Boss01";
import GameOver from "./scenes/GameOver";
import Intro from "./scenes/Intro";
//importiamo GameData che contiene i valori globali del gioco
import { GameData } from "./GameData";
import BossLead from "./scenes/BossLead";
import Boss01 from "./scenes/Boss01";
import Boss02 from "./scenes/Boss02";
import Boss03 from "./scenes/Boss03";

//il listener per l'evento load della pagina
//questo evento viene lanciato quando la pagina è stata caricata
//e tutti gli elementi della pagina sono disponibili
window.addEventListener("load", () => {


  //creiamo un oggetto di configurazione per il gioco
  //questo oggetto viene passato al costruttore di Phaser.Game
  // e contiene i parametri di configurazione del gioco
  // come il tipo di rendering, le dimensioni del canvas, le scene, ecc.
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    parent: "my-game",
    scale: {
      mode: Phaser.Scale.FIT,
      width: GameData.globals.gameWidth,
      height: GameData.globals.gameHeight,
    },

    scene: [
      Boot,
      Hud,
      Preloader,
      Intro,
      Boss01,
      Boss02,
      Boss03,
      BossLead,
      GameOver,
    ],
    physics: {
      default: "arcade",
      arcade: { debug: GameData.globals.debug, }
    },

    input: {
      activePointers: 2,
      keyboard: true,
    },
    render: {
      pixelArt: true,
      antialias: true,
    },
  };

  //inizializziamo il gioco passando la configurazione
  const game = new Phaser.Game(config);

});
