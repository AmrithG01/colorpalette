import mongoose from "mongoose";

const paletteSchema = mongoose.Schema({
    name: {type: String, required: true},
    colors:{type: [String], default: []},
})

export const Palette = mongoose.model("Palette", paletteSchema);