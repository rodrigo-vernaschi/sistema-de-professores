const mongoose = require("mongoose")

const AlunoSchema = new mongoose.Schema(
    {
        nome: String,
        email: String,
        dataNascimento: Date,
        instrumentos: [String],
        fotoPerfil: String, // <- novo campo
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Aluno", AlunoSchema)
