export default class IntroVideo extends Phaser.Scene {

  private _video: Phaser.GameObjects.Video;
  private _gone: boolean = false;

  constructor() {
    super({ key: "IntroVideo" });
  }

  preload() {}

  create() {
    this._gone = false;
    const { width, height } = this.game.canvas;

    // Sblocca audio WebAudio
    if ((this.sound as any).context && (this.sound as any).context.state === "suspended") {
      (this.sound as any).context.resume();
    }

    // Sfondo nero
    this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0).setDepth(0);

    // Video centrato
    this._video = this.add.video(width / 2, height / 2, "introVideo")
      .setOrigin(0.5).setDepth(1);

    // Parte muted (obbligatorio per autoplay browser), poi smuta
    this._video.play();

    this._video.on("playing", () => {
      const el = (this._video as any).video as HTMLVideoElement;
      const vidW = el.videoWidth;
      const vidH = el.videoHeight;

      // Scala per adattare al canvas con margine
      if (vidW > 0 && vidH > 0) {
        const scaleX = width  / vidW;
        const scaleY = height / vidH;
        this._video.setScale(Math.min(scaleX, scaleY) * 0.85);
      }

      // Smuta dopo che il video è partito
      el.muted = false;
      el.volume = 1;
    });

    // Testo skip — appare dopo 1.5 secondi
    const skipText = this.add.text(width / 2, height - 40, "[ clicca per skippare ]", {
      fontFamily: "Underdog",
      fontSize: 22,
      color: "#aaaaaa",
      stroke: "#000000",
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(2).setAlpha(0);

    this.time.delayedCall(1500, () => {
      this.tweens.add({ targets: skipText, alpha: 1, duration: 500 });
      this.input.once("pointerdown", () => {
        this._goToIntro();
      });
    });

    // Video finito → vai a Intro
    this._video.on("complete", () => {
      this._goToIntro();
    });
  }

  private _goToIntro(): void {
    if (this._gone) return;
    this._gone = true;

    if (this._video) {
      this._video.stop();
      this._video.destroy();
    }

    const { width, height } = this.game.canvas;
    const nero = this.add.rectangle(0, 0, width, height, 0x000000, 0)
      .setOrigin(0).setDepth(10);

    this.tweens.add({
      targets: nero,
      fillAlpha: 1,
      duration: 800,
      ease: "Power2",
      onComplete: () => {
        this.scene.stop("IntroVideo");
        this.scene.start("Intro");
      },
    });
  }

  update() {}
}