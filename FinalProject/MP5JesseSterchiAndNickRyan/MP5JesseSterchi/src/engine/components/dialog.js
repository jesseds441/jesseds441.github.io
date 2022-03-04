import nearley from "../../lib/nearley.js";
import grammar from "./revised_grammar.js";
import engine from "../index.js";

class Dialog {
    constructor(input) {
        this.parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        this.parser.feed(input)
        this.body = this.parser.results[0]
        this.default = this.body.default;
        
        console.log("Constructed!")

        this.initial_chunk_id = this.body.start;
        this.current_chunk = this.body.chunks[this.initial_chunk_id];
        this.counter = 0;
    }

    log() {
        console.log(this.body);
        console.log("start = " + this.initial_chunk_id)
        console.log("current_chunk = " + JSON.stringify(this.current_chunk))
    }

    next() {
        var chunk = this.current_chunk[this.counter++];
        if(chunk.type == "custom_string") {
            var temp_arr_1 = chunk.content.split(" : ");
            var temp_arr_2 = temp_arr_1[1].replaceAll("[","").replaceAll("]","").split(",");
            return new engine.Text(temp_arr_1[0], 
                [parseFloat(temp_arr_2[0].trim()), parseFloat(temp_arr_2[1].trim()), parseFloat(temp_arr_2[2].trim()), parseFloat(temp_arr_2[3].trim())],
                'custom_string',
                true,
                temp_arr_2[5].replaceAll("}", ""))
        }
        return new engine.Text(chunk.content, this.default.color, chunk.type, true, this.default.image);
    }

    passChoice(chunk_id) {
        this.current_chunk = this.body.chunks[chunk_id];
        this.counter = 0;
    }
}

export default Dialog;