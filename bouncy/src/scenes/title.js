export default class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }

    preload() {
        this.load.image("bg", "assets/title_screen.png")
        this.load.image("startButton", "assets/start_button.png")
        this.load.image("helpButton", "assets/help_button.png")
        this.load.image("buttonOutline", "assets/button_outline.png")
        this.load.image("buttonFullscreen", "assets/fullscreen_button.png")
    }

    create() {
        this.add.image(640, 360, "bg")
        
        let startButton = this.add.image(320, 540, "startButton").setInteractive()
        let startOutline = this.add.image(320, 540, "buttonOutline").setVisible(false)
        let helpButton = this.add.image(960, 540, "helpButton").setInteractive()
        let helpOutline = this.add.image(960, 540, "buttonOutline").setVisible(false)
        let fullscreenButton = this.add.image(640, 540, "buttonFullscreen").setInteractive()
        let fullscreenOutline = this.add.image(640, 540, "buttonOutline").setVisible(false)


        startButton.on("pointerup", () => this.scene.start("GameScene"))
        startButton.on("pointerover", () => startOutline.setVisible(true))
        startButton.on("pointerout", () => startOutline.setVisible(false))

        helpButton.on("pointerup", () => this.scene.start("HelpScene"))
        helpButton.on("pointerover", () => helpOutline.setVisible(true))
        helpButton.on("pointerout", () => helpOutline.setVisible(false))

        fullscreenButton.on("pointerup", () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen()
            }
            else {
                this.scale.startFullscreen()
            }
        })
        fullscreenButton.on("pointerover", () => fullscreenOutline.setVisible(true))
        fullscreenButton.on("pointerout", () => fullscreenOutline.setVisible(false))

    }
}