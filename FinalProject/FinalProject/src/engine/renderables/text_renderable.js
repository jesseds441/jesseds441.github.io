/*
 * File: text_renderable.js
 *
 * Supports the drawing an entire file texture mapped onto an entire Renderable
 * 
 */
"use strict"; // Operate in Strict mode such that variables must be declared before used!

import TextureRenderable from "./texture_renderable.js";
import * as text from "../utils/text.js";
import * as shaderResources from "../core/shader_resources.js";
import Transform from "../utils/transform.js";
import FontRenderable from "./font_renderable.js";
import * as defaultResources from "../resources/default_resources.js";
import * as font from "../resources/font.js";
import engine from "../index.js";
import { waitOnPromises } from "../core/resource_map.js";

class TextRenderable {
    constructor(background, text, xPos, yPos) {
        
        // background of text box
        this.mBackground = new TextureRenderable(background);

        this.mBackground.setTexture(background);

        this.mBackground.getXform().setSize(150, 50);

        this.mBackground.getXform().setPosition(xPos, yPos);
       
        this.mTextBoxXCor = xPos;
        this.mTextBoxYCor = yPos;

        // For associated image
        this.mAssociatedImage = new TextureRenderable(background);

        this.mAssociatedImage.getXform().setSize(50, 50);

            this.mAssociatedImage.getXform().setPosition(xPos + (this.mBackground.getXform().getWidth() / 2)
            + this.mAssociatedImage.getXform().getWidth() / 2 , yPos);

        // for text object
        this.mTextArray = text;
        this.mCurrentText = text[0];

        
        // For actual text display
        this.mTextDisplay = new FontRenderable(String(this.mCurrentText.getContent()));

        this.mTextDisplay.getXform().setPosition(this.mTextBoxXCor 
            - (this.mBackground.getXform().getWidth() * .90), 
            this.mTextBoxYCor + (this.mBackground.getXform().getHeight() * .45));


        // Track word
        this.mStringArray = String(this.mCurrentText.getContent()).split(" ");
        this.mCurrentString = this.mStringArray[0];


        // other display options
        this.mDefaultColor = null;
        this.mTextHeight = this.mTextDisplay.getXform().getHeight();

        this.mCurrentCounter = 0;

        this.mIsPaused = this.mCurrentText.getDoesPause();

        // flow control
        this.mIsFinished = false;
        this.mTextObjCount = 1;
        this.mCharCount = 0;

        // Text display coordinates
        this.mTextX = this.mTextBoxXCor - (this.mBackground.getXform().getWidth() * .46);
        this.mTextY = this.mTextBoxYCor + (this.mBackground.getXform().getHeight() * .35);
    }

    
    draw(camera) {

        // first, draw the textbox 
        this.mBackground.draw(camera);

        if (this.mAssociatedImage.getTexture() != this.mBackground.getTexture()) {
            
            this.mAssociatedImage.draw(camera);
        } 

        this.mTextDisplay.getXform().setPosition(this.mTextX, this.mTextY);

        this.mStringX = this.mTextDisplay.getXform().getXPos();
        this.mStringY = this.mTextDisplay.getXform().getYPos();

        let i = 0;
        let allTexts = [];

        // get all text objects for this display
        while (this.mTextArray.length > i
            && this.mTextArray[i].getCounter() == this.mCurrentCounter) {

            allTexts.push(this.mTextArray[i]);
            i++;
        }
       
        // for all text objects for this display box
        for (let num = 0; num < this.mTextObjCount; num++) {

            let numChars = 0;

            if (this.mTextObjCount - 1> num) {
                numChars = allTexts[num].getContent().length;
            }
            else {
                numChars = this.mCharCount;
            }

            // for each character in text object
            for (let i = 0; i < numChars; i++) {

                let text = allTexts[num].getContent();
                this.setAssociatedImage(allTexts[num].getSpeakerImage());
                //console.log("i " + i)
                this.mTextDisplay.setText(text[i]);
                this.setDefaultColor(allTexts[num].getColor());

                this.mTextDisplay.draw(camera);

    
                // Keep track of what word we're on for fitToSpace()
                if (text[i] == " ") {
                    this.mStringArray.shift();
                    this.mCurrentString = this.mStringArray[0];
    
                    this.mStringX = this.mTextDisplay.getXform().getXPos();
                    this.mStringY = this.mTextDisplay.getXform().getYPos();
                }
    
                // ensure text will fit to box
                this.fitToSpace();
    
            }
        }

        if (allTexts[this.mTextObjCount - 1].getContent().length > this.mCharCount ) {

            this.mCharCount++;
        }
        else if (allTexts.length > this.mTextObjCount) {

            this.mTextObjCount++;
            this.mCharCount = 0;
        }
        

        if (this.mTextArray.length - 1 > 0 && !this.mIsPaused) { 

            if (this.mTextArray.length != allTexts.length) {

                // pop off all used text objects
                while (this.mTextArray[0].getCounter() == this.mCurrentCounter) {
                
                    this.mTextArray.shift();
                }

                this.mCurrentText = this.mTextArray[0];
                
                if (this.mCurrentCounter == 0) {
                    this.mCurrentCounter = 1;
                }
                else {
                    this.mCurrentCounter = 0;
                }

                this.mCharCount = 0;
                this.mTextObjCount = 1;
            }

            // Track word
            this.mStringArray = String(this.mCurrentText.getContent()).split(" ");
            this.mCurrentString = this.mStringArray[0];

            this.mIsPaused = true;

        }
 
    }
    
    update() {

        if (engine.input.isButtonClicked(engine.input.eMouseButton.eLeft)) {
            this.mIsPaused = false;
        }
    }

    fitToSpace() {
        let x = this.mTextDisplay.getXform().getXPos();
        let y = this.mTextDisplay.getXform().getYPos();
        let h = this.mTextDisplay.getXform().getHeight(); 
        let w = this.mTextDisplay.getXform().getWidth(); 
        
        // check if the word will fit in the box
        if (this.mStringX + (w * String(this.mCurrentString).length + 1) > this.mTextBoxXCor
         + this.mBackground.getXform().getWidth() * .55) {
             // move down a line
            this.mTextDisplay.getXform().setPosition(this.mTextX, y - h *1.2);
            this.mStringX = this.mTextX;
        }
        else {
            this.mTextDisplay.getXform().setPosition(x + w * .75, y);
        }
    }

    setDefaultColor(color) {
        this.mDefaultColor = color;
        this.mTextDisplay.setColor(this.mDefaultColor);
    }

    setDefaultFont(font) {
        this.mTextDisplay.setFontName(font);
    }

    getXform() {
        return this.mXform;
    }

    setTextHeight(h) {
        this.mTextHeight = h;

        this.mTextDisplay.setTextHeight(h);
    }

    setDelayTime(time) {
        this.mDelayTime = time;
    }

    setAssociatedImage(image) {
        this.mAssociatedImage.setTexture(image);
    }

    setBackgroundImage(image) {
        this.mBackground.setTexture(image);
    }

    getText() {
        return this.mTextDisplay;
    }

    setText(text) {
        this.mTextArray.push(text);
    }

    clear() {
        this.mTextArray.splice(0, this.mTextArray.length);
    }

}

// function sleep(time) {
//     return new Promise(
//       resolve => setTimeout(resolve, time)
//     );
//   }
  

// async function writeChar(time, text, camera) {

//     await sleep(time);

//     text.draw(camera);
// }

export default TextRenderable;