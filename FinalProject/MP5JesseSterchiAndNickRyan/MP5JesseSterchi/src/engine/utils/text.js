/*
 * File: text.js
 *
 * Contains all necessary text information for dialog boxes
 * 
 */
class Text {
    constructor(content, color, type, doesPause, speakerImage, counter) {

        // The raw string content to be displayed
        this.mContent = content;
        // The color of the string to display
        this.mColor = color;
        // The associated type of dialog ("text", "next", or "options")
        this.mType = type;
        // should this pause the dialog?
        this.mDoesPause = doesPause;
        // speaker image
        this.mSpeakerImage = speakerImage;
        //tracks when to switch to next textbox
        this.mCounter = counter;
    }

    // getters 

    getCounter() {
        return this.mCounter;
    }

    getContent() {
        return this.mContent;
    }

    getType() {
        return this.mType;
    }

    getSpeakerImage() {
        return this.mSpeakerImage;
    }

    setSpeakerImage(image) {
        this.mSpeakerImage = image;
    }

    getColor() {
        return this.mColor;
    }

    getDoesPause() {
        return this.mDoesPause;
    }

    // setters
    setContent(content) {
        this.mContent = content;
    }

    setCounter(counter) {
        this.mCounter = counter;
    }

    setType(type) {
        // must be one of the predefined tags
        if (type == "text" || type == "next" || type == "options")
        {
            this.mType = type;
        }
    }

    setColor(color) {
        this.mColor = color;
    }

    setDoesPause(doesPause) {
        this.mDoesPause = doesPause;
    }

}

export default Text;