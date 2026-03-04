import iMosse from "./iMosse";

interface IPlayer {
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
    
    update(time: number, delta: number,x: IPlayer, y: Phaser.GameObjects.Sprite, sp: string, n: number, liv:string, fase:number): void;

    fineTurno(): void;
    attack(x: IPlayer, y: Phaser.GameObjects.Sprite, z: Phaser.GameObjects.Graphics, t: Phaser.GameObjects.Text): number;
    tech(): iMosse;
    inventory(t: Phaser.GameObjects.Text, z: Phaser.GameObjects.Graphics): void;
    vittoria(x:string, y:number): void;
    sconfitta(): void;

    activeDefence01(x: IPlayer, z: Phaser.GameObjects.Graphics): void;
    activeDefence02(x: IPlayer, z: Phaser.GameObjects.Graphics): void;
    activeDefence03(x: IPlayer, z: Phaser.GameObjects.Graphics): void;
}
export default IPlayer;