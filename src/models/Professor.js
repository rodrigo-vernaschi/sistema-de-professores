const mongoose = require("mongoose")

const professorSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
})

const Professor = mongoose.model("Professor", professorSchema)

module.exports = Professor
