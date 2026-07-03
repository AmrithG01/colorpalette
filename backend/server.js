import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import {Palette} from "./database/Palette.js";


const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/colorpalette")
.then(() => console.log("Database connected"))
.catch(()=> console.log("Server not connected"));

app.get("/api/palettes", async (req,res) => {
    try{
        const newpalette = await Palette.find();
        res.status(200).json(newpalette);

    }catch(err){ res.status(500).json({message : err.message})}
})

app.post("/api/palettes", async (req,res) => {
    try{
        const {name, colors} = req.body;
        const newpalette = new Palette({name, colors});
        await newpalette.save();
        res.status(201).json(newpalette);
    }catch(err){
        res.status(400).json({message : err.message})
    }
})

app.delete("/api/palettes/:id", async (req,res)=> {
    try{
        const deletedpalette = await Palette.findByIdAndDelete(req.params.id);
        if(!deletedpalette){
            return res.status(404).json({message: "Palette not found"});
        }
        res.status(200).json({message : "Deleted the Palette"})
    }catch(err){
        res.status(500).json({message : err.message})
    }
})


app.listen(5000 , () => console.log("server in port 5000"));