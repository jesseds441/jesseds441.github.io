
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import TextureRenderable from "../engine/renderables/texture_renderable_main.js";
import SpriteRenderable from "../engine/renderables/sprite_renderable.js";
import TextRenderable from "../engine/renderables/text_renderable.js";
import FontRenderable from "../engine/renderables/font_renderable.js";
import Dialog from "../engine/components/dialog.js";
import SceneTwo from "./scene_two.js";


class MyGame extends engine.Scene {
    constructor() {
        super();

        //assets 
        this.kDyePackSprite = "assets/dye_pack.png";
        this.kBg = "assets/bg.png";
        this.kREBG = "assets/REbg.png";
        this.kHero = "assets/dye.png";
        this.kSpriteSheet = "assets/SpriteSheet.png";
        this.kLeon = "assets/leon.png";
        this.kTextBox = "assets/textbox.png";
        this.kHunnigan = "assets/hunnigan.png"
        this.kSceneTwo = "assets/text/scene_two.txt";
        this.kFWalk = "assets/f_walk.png";

        // The camera to view the scene
        this.mCamera = null;

        this.mTextArray = [];
        this.mTextArray2 = [];

        this.mBg = null;
        this.mBg2 = null;

        this.mTest = null;
        this.mSceneTwo = null;

        this.mFont = null;

        this.dialog_two = null
        this.promptBoolean = false;
        this.advanceBoolean = false;
        this.current_choices = null;
        this.end_boolean = false;

    }

    load() {
        //engine.texture.load(this.kDyePackSprite);
        engine.text.load(this.kSceneTwo);
        engine.texture.load(this.kFWalk);
        engine.texture.load(this.kREBG);
        engine.texture.load(this.kBg);
        engine.texture.load(this.kHero);
        engine.texture.load(this.kSpriteSheet);
        engine.texture.load(this.kLeon);
        engine.texture.load(this.kTextBox);
        engine.texture.load(this.kHunnigan);

    }

    unload() {
        //engine.texture.unload(this.kDyePackSprite);
        engine.text.unload(this.kSceneTwo);
        engine.texture.unload(this.kFWalk);
        engine.texture.unload(this.kREBG);
        engine.texture.unload(this.kBg);
        engine.texture.unload(this.kHero);
        engine.texture.unload(this.kSpriteSheet);
        engine.texture.unload(this.kTextBox);
        engine.texture.unload(this.kHunnigan);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(30, 27.5), // position of the camera
            200,                       // width of camera
            [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

        this.mCamera.setWCCenter(100, 100);


        //this.mTextArray2.push(new engine.Text("TEST TEXT", [.1, .3, .8, 1], "text", true, this.kLeon, 0));

        this.mBg2 = new TextureRenderable(this.kREBG);
        this.mBg2.getXform().setSize(200, 110);
        this.mBg2.getXform().setPosition(30, 55);

        this.dialog_two = new Dialog(engine.text.get(this.kSceneTwo), [0.5, 0.5, 0.5, 1.0], this.kLeon);
        this.mTextArray2.push(this.dialog_two.next());
        this.mTextArray2.push(this.dialog_two.spacer());

        this.mSceneTwo = new TextRenderable(this.kTextBox, this.mTextArray2, 5, -22.5)
        this.mSceneTwo.setTextHeight(6);

    }
    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        this.mCamera.setViewAndCameraMatrix();

        //        this.mBg.draw(this.mCamera);
        //        this.mTest.draw(this.mCamera);

        this.mBg2.draw(this.mCamera);
        this.mSceneTwo.draw(this.mCamera);


    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        //this.mTest.update();

        this.mSceneTwo.update();

        if (engine.input.isButtonClicked(engine.input.eMouseButton.eLeft)) {
            this.advanceBoolean = true;
        }

        if (!this.promptBoolean && !this.end_boolean) {
            if (this.advanceBoolean) {
                var next_opt = this.dialog_two.next();
                console.log(next_opt);

                if (Array.isArray(next_opt)) {
                    this.mTextArray2.push(next_opt[1])
                    this.current_choices = next_opt[0];
                    this.promptBoolean = true;
                    this.advanceBoolean = false;
                } else {

                    if (next_opt.getType() == "text") {
                        this.mTextArray2.push(next_opt);
                        this.mTextArray2.push(this.dialog_two.spacer())
                        this.advanceBoolean = false;
                    }

                    if (next_opt.getType() == "custom_string") {
                        //console.log(next_opt)
                        this.mTextArray2.push(next_opt);
                        this.mTextArray2.push(this.dialog_two.spacer())
                        this.advanceBoolean = false;
                    }

                    if (next_opt.getType() == "terminal") {
                        if (next_opt.getContent()[1] == "END") { this.end_boolean = true } else {
                            this.dialog_two.passChoice(next_opt.getContent()[1]);
                        }
                        this.advanceBoolean = true;
                    }
                }

            }

        }
        else if (!this.end_boolean) {

            if (engine.input.isKeyClicked(engine.input.keys.One)) {

                this.dialog_two.passChoice(this.current_choices[0]);
                this.dialog_two.primeClear()
                this.current_choices = null;
                this.promptBoolean = false;
                this.advanceBoolean = true;
            } else if (engine.input.isKeyClicked(engine.input.keys.Two)) {

                this.dialog_two.passChoice(this.current_choices[1]);
                this.dialog_two.primeClear()
                this.current_choices = null;
                this.promptBoolean = false;
                this.advanceBoolean = true;
            } else if (engine.input.isKeyClicked(engine.input.keys.Three)) {

                this.dialog_two.passChoice(this.current_choices[2]);
                this.dialog_two.primeClear()
                this.current_choices = null;
                this.promptBoolean = false;
                this.advanceBoolean = true;
            }
        }

        if (engine.input.isKeyClicked(engine.input.keys.Space))
            this.next();  // Switch the scene
    }

    next() {
        super.next();
        let nextLevel = new SceneTwo();  // load the next level
        nextLevel.start();
    }


}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}

export default MyGame;
