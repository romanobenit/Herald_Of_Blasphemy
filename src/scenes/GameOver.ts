import { GameData } from "../GameData";

export default class GameOver extends Phaser.Scene {



  constructor() {
    super({
      key: "GameOver",
    });
  }


  create() {
    console.log("GameOver");
    let sfondo = this.add.image(0, 0, "sfondoBoss01").setOrigin(0, 0).setDepth(0).setScale(10);
  }




}
