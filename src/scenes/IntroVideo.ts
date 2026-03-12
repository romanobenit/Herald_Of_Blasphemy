export default class IntroVideo extends Phaser.Scene {

  private _video:    Phaser.GameObjects.Video;
  private _gone:     boolean = false;
  private _ended:    boolean = false;
  private _didSetup: boolean = false;

  constructor() {
    super({ key: "IntroVideo" });
  }

  preload() {}

  create() {
    this._gone     = false;
    this._ended    = false;
    this._didSetup = false;

    const W = this.scale.width;
    const H = this.scale.height;

    this.add.rectangle(0, 0, W, H, 0x000000)
      .setOrigin(0).setDepth(0);

    this._video = this.add
      .video(W / 2, H / 2, "introVideo")
      .setOrigin(0.5)
      .setDepth(1)
      .setLoop(false);

    const setupEl = () => {
      if (this._didSetup) return;
      this._didSetup = true;

      const el = (this._video as any).video as HTMLVideoElement | null;
      if (!el) return;

      el.loop   = false;
      el.volume = 0.4;
      el.muted  = false;

      // Scala applicata dentro "playing" — unico momento in cui
      // Phaser non sovrascrive più le dimensioni
      el.addEventListener("playing", () => {
        el.loop = false;
        const vidW  = el.videoWidth;
        const vidH  = el.videoHeight;
        const scale = Math.min(W / vidW, H / vidH);
        this._video.setDisplaySize(vidW, vidH);
        this._video.setScale(scale);
      }, { once: true });

      const onEnded = () => {
        el.removeEventListener("ended", onEnded);
        if (this._ended) return;
        this._ended = true;
        this._goToIntro();
      };
      el.addEventListener("ended", onEnded);
      this._video.once("complete", () => {
        if (this._ended) return;
        this._ended = true;
        this._goToIntro();
      });

      if (el.readyState >= 1) {
        this._video.play(false);
      } else {
        el.addEventListener("loadedmetadata", () => {
          this._video.play(false);
        }, { once: true });
      }
    };

    if ((this._video as any).video) {
      setupEl();
    } else {
      this._video.once("created", setupEl);
    }

    // Skip
    const skipText = this.add
      .text(W - 20, H - 60, "clicca per skippare", {
        fontFamily: "Underdog",
        fontSize: 18,
        color: "#aaaaaa",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(1, 1)
      .setDepth(2)
      .setAlpha(0);

    this.time.delayedCall(1500, () => {
      this.tweens.add({ targets: skipText, alpha: 1, duration: 500 });
      this.input.once("pointerdown", () => this._goToIntro());
    });
  }

  private _goToIntro(): void {
    if (this._gone) return;
    this._gone = true;

    try {
      const el = (this._video as any).video as HTMLVideoElement | null;
      if (el) {
        el.pause();
        el.removeAttribute("src");
        el.load();
      }
    } catch (_) {}

    this._video.stop();
    this._video.destroy();

    if (this.textures.exists("introVideo")) this.textures.remove("introVideo");
    if (this.cache.video.exists("introVideo")) this.cache.video.remove("introVideo");

    const W = this.scale.width;
    const H = this.scale.height;

    const nero = this.add
      .rectangle(0, 0, W, H, 0x000000, 0)
      .setOrigin(0)
      .setDepth(10);

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