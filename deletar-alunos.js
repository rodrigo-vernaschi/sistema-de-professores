// deletar-alunos.js
require("dotenv").config()
const mongoose = require("mongoose")
const Aluno = require("./src/models/Aluno")

async function deletarTodosAlunos() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        const resultado = await Aluno.deleteMany({})
        console.log(`${resultado.deletedCount} alunos deletados com sucesso.`)
    } catch (erro) {
        console.error("Erro ao deletar alunos:", erro)
    } finally {
        await mongoose.disconnect()
    }
}

deletarTodosAlunos()
