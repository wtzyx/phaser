export default class HelpScene extends Phaser.Scene {
    constructor() {
        super('HelpScene');
    }

    preload() {
        this.load.image("helpBG", "assets/help_bg.png")
        this.load.image("backButton", "assets/back_button.png")
    }

    create() {
        this.add.image(640, 360, "helpBG")

        let howToPlayText = this.add.text(400, 50, "How To Play:", {fontSize: "48px", fill: "#ffff00"})
        howToPlayText.x = 640 - (howToPlayText.width / 2)
        howToPlayText.setAlign("center")

        let infoText = this.add.text(400, 60 + howToPlayText.height, "Collect All The Stars\nWatch Out For Bombs!", {fontSize: "32px", fill: "#ff0000"})
        infoText.x = 640 - (infoText.width / 2)
        infoText.setAlign("center")

        let keyboardMsg = "Keyboard:\n\n"
        keyboardMsg +=    "Right and Left\n"
        keyboardMsg +=    "Arrows to Move\n\n"
        keyboardMsg +=    "Shift to Boost\n\n"
        keyboardMsg +=    "Space to Jump"
        let keyboardText = this.add.text(200, 275, keyboardMsg, {fontSize: "24px", fill: "#00ff00"})
        keyboardText.x = 320 - (keyboardText.width / 2)
        keyboardText.y = 360 - (keyboardText.height / 2)
        keyboardText.setAlign("center")

        let touchMsg = "Touch or Mouse:\n\n"
        touchMsg +=    "Touch (click) to\n"
        touchMsg +=    "the side of Bouncy\n"
        touchMsg +=    "BoI that you want\n"
        touchMsg +=    "to move towards\n\n"
        touchMsg +=    "Hold to accelerate\n\n"
        touchMsg +=    "Tap (click) on\n"
        touchMsg +=    "power-up to use"
        let touchText = this.add.text(600, 210, touchMsg, {fontSize: "24px", fill: "#0000ff"})
        touchText.x = 960 - (touchText.width / 2)
        touchText.y = keyboardText.y - ((touchText.height - keyboardText.height) / 2)
        touchText.setAlign("center")

        let backButton = this.add.image(640, 580, "backButton").setInteractive().setScale(0.75)
        let backOutline = this.add.image(640, 580, "buttonOutline").setVisible(false).setScale(0.75)
        backButton.on("pointerup", () => this.scene.start("TitleScene"))
        backButton.on("pointerover", () => backOutline.setVisible(true))
        backButton.on("pointerout", () => backOutline.setVisible(false))

    }
}