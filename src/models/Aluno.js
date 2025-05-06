const mongoose = require("mongoose")

const alunoSchema = new mongoose.Schema(
    {
        email: { type: String, required: false },
        nome: { type: String, required: true },
        dataNascimento: { type: Date, required: false },
        instrumentos: [{ type: String, enum: ["violino", "viola", "violoncelo"], required: true }],
    },
    { timestamps: true }
)

const Aluno = mongoose.model("Aluno", alunoSchema)

module.exports = Aluno
