const mongoose = require("mongoose")

const AlunoSchema = new mongoose.Schema(
    {
        nome: String,
        instrumentos: [String],
        fotoPerfil: String,
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Aluno", AlunoSchema)
