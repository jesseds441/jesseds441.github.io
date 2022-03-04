"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import Lerp from "../../engine/utils/lerp.js";
import Oscillate from "../../engine/utils/oscillate.js";
import BoundingBox from "../../engine/utils/bounding_box.js";

class Hero extends engine.GameObject{
    constructor(spriteTexture, atX, atY) {
        super(null);
        this.kDelta = 0.3;
        
        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setElementPixelPositions(0, 1024, 0, 512);
        this.mRenderComponent.setElementUVCoordinate(0, 0.125, 0, 0.361);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setSize(9, 12);
        this.mRenderComponent.getXform().setPosition(atX, atY);

        this.mXPos = new Lerp(atX, 120, 0.05);
        this.mYPos = new Lerp(atY, 120, 0.05);

        // Hit events
        this.mOscillate = new Oscillate(4.5, 4, 60); 
        this.mYOscillate = new Oscillate(6, 4, 60);   
        this.mIsHit = false;
    }

    getPosition() {
        return this.mRenderComponent.getXform().getPosition();
    }

    getBBox() {
        return new BoundingBox(
            this.mRenderComponent.getXform().getPosition(), 
            this.mRenderComponent.getXform().getWidth(),
            this.mRenderComponent.getXform().getHeight()
        );
    }

    update(targetX, targetY) {


        this.mXPos.setFinal(targetX);
        this.mYPos.setFinal(targetY);

        let xform = this.mRenderComponent.getXform();
        
        // lerp updates
        this.mXPos.update();
        this.mYPos.update(); 

        xform.setPosition(this.mXPos.get(), this.mYPos.get());

        if (this.mIsHit) {
            let x = this.mOscillate.getNext();
            let y = this.mYOscillate.getNext();
            this.mRenderComponent.getXform().incSizeBy(x, y);
        }
        if (this.mOscillate.done()) {
            this.mRenderComponent.getXform().setSize(9, 12);
            this.mIsHit = false;
        }

    }

    startOscillate() {
        if (!this.mIsHit) {
            this.mOscillate.reStart();
            this.mYOscillate.reStart();
            this.mIsHit = true;
        }
    }
    
    draw(aCamera) {
        this.mRenderComponent.draw(aCamera);
    }
}

export default Hero;