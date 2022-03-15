import nearley from "../../lib/nearley.js";
import grammar from "./revised_grammar.js";
import engine from "../index.js";

class Dialog {
    //pass in default color and image path here.
    constructor(input, default_color, default_image) {
        this.parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        this.parser.feed(input)
        this.body = this.parser.results[0]
        this.default_color = default_color;
        this.default_image = default_image;
        
        console.log("Constructed!")
        console.log(this.body);

        this.initial_chunk_id = this.body.start;
        this.current_chunk = this.body.chunks[this.initial_chunk_id];
        this.counter = 0;
        this.group_tracker = 0;
    }

    next() {
        var chunk = this.current_chunk[this.counter++];
        console.log(chunk);
        
        if(chunk.type == "string") {
            return new engine.Text(chunk.content, this.default_color, "text", true, this.default_image, this.group_tracker);
        }

        if(chunk.type == "custom_string") {
            var temp_arr_1 = chunk.content.split(" : ");
            var temp_arr_2 = temp_arr_1[1].replaceAll("[","").replaceAll("]","").split(",");
            return new engine.Text(temp_arr_1[0], 
                [parseFloat(temp_arr_2[0].trim()), parseFloat(temp_arr_2[1].trim()), parseFloat(temp_arr_2[2].trim()), parseFloat(temp_arr_2[3].trim())],
                'custom_string',
                true,
                temp_arr_2[5].replaceAll("}", ""),
                this.group_tracker)
        }

        if(chunk.type == "terminal") {
            this.group_tracker = this.group_tracker == 0 ? 1 : 0;
            return new engine.Text(chunk.content, this.default_color, "terminal", true, this.default_image, this.group_tracker);
        }

        if(chunk.type == "options_terminal") {
            this.group_tracker = this.group_tracker == 0 ? 1 : 0;
            return [chunk.content[1], new engine.Text(chunk.content[0], this.default_color, "options_terminal", true, this.default_image, this.group_tracker)];
        }
        
        
    }

    primeClear() {
        this.group_tracker = this.group_tracker == 0 ? 1 : 0;
    }

    spacer() {
        return new engine.Text(" ", this.default_color, "text", true, this.default_image, this.group_tracker);
    }

    passChoice(chunk_id) {
        this.current_chunk = this.body.chunks[chunk_id];
        this.counter = 0;
    }
}

export default Dialog;