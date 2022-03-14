
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import TextureRenderable from "../engine/renderables/texture_renderable_main.js";
import SpriteRenderable from "../engine/renderables/sprite_renderable.js";
import TextRenderable from "../engine/renderables/text_renderable.js";
import FontRenderable from "../engine/renderables/font_renderable.js";


class MyGame extends engine.Scene {
    constructor() {
        super();

        //assets 
        this.kDyePackSprite = "assets/dye_pack.png";
        this.kBg = "assets/bg.png";
        this.kHero = "assets/dye.png";
        this.kSpriteSheet = "assets/SpriteSheet.png";
        this.kLeon = "assets/leon.png";
        this.kTextBox = "assets/textbox.png";
        this.kHunnigan = "assets/hunnigan.png"

        // The camera to view the scene
        this.mCamera = null;

        this.mTextArray = [];

        this.mBg = null;

        this.mTest = null;

        this.mFont = null;
    
    }

    load() {
        //engine.texture.load(this.kDyePackSprite);
        engine.texture.load(this.kBg);
        engine.texture.load(this.kHero);
        engine.texture.load(this.kSpriteSheet);
        engine.texture.load(this.kLeon);
        engine.texture.load(this.kTextBox);
        engine.texture.load(this.kHunnigan);
        
    }

    unload() {
        //engine.texture.unload(this.kDyePackSprite);
        engine.texture.unload(this.kBg);
        engine.texture.unload(this.kHero);
        engine.texture.unload(this.kSpriteSheet);
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

        // Can push text manually
        // Parameters: the raw string content to be displayed, the color (as a color array), what type of text, 
        // whether or not to be paused, the speaker image, and the set number 
        this.mTextArray.push(new engine.Text("HUNNIGAN:", [.6, .2, .9, 1], "text", true, this.kHunnigan, 0));

        this.mTextArray.push(new engine.Text(" Leon. It's been 6 hours since our last transmission. "
        + "I was starting to get worried.", [.3, .3, .3, 1], "text", true, this.kHunnigan, 0));


        this.mTextArray.push(new engine.Text("LEON:", [.1, .3, .8, 1], "text", true, this.kLeon, 1));

        this.mTextArray.push(new engine.Text(" Don't you mean lonely? Anyway, I started to feel dizzy. "
        + "And then I guess I must have lost consciousness.", [.3, .3, .3, 1], "text", true, this.kLeon, 1));  

        this.mTextArray.push(new engine.Text("HUNNIGAN:", [.6, .2, .9, 1], "text", true, this.kHunnigan, 0));

        this.mTextArray.push(new engine.Text(" Lost consciousness? Maybe it has some connection " +
        "to what the village chief was talking about...?", [.3, .3, .3, 1], "text", true, this.kHunnigan, 0));


        this.mTextArray.push(new engine.Text("LEON:", [.1, .3, .8, 1], "text", true, this.kLeon, 1));

        this.mTextArray.push(new engine.Text( " Can't say. But I'm all right now. I'm gonna continue my mission.", 
        [.3, .3, .3, 1], "text", true, this.kLeon, 1));

        this.mBg = new TextureRenderable(this.kBg);
        this.mBg.getXform().setSize(200, 110);
        this.mBg.getXform().setPosition(30, 55);


        // set up text renderable
        this.mTest = new TextRenderable(this.kTextBox, this.mTextArray, 5, -22.5);
        this.mTest.setTextHeight(6);
 
    }
    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
        this.mCamera.setViewAndCameraMatrix();

        this.mBg.draw(this.mCamera);

        this.mTest.draw(this.mCamera);

    }
    
    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update () {
        this.mTest.update();
    }


}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}
