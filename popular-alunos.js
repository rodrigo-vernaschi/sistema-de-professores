// popular-alunos.js
require("dotenv").config()
const mongoose = require("mongoose")
const Aluno = require("./src/models/Aluno")

const NOMES = ["João", "Maria", "Carlos", "Ana", "Lucas", "Beatriz", "Mateus", "Juliana", "Rafael", "Fernanda"]
const SOBRENOMES = ["Silva", "Souza", "Oliveira", "Lima", "Almeida", "Costa", "Pereira", "Ramos"]
const INSTRUMENTOS = ["violino", "viola", "violoncelo"]

function nomeAleatorio() {
    const nome = NOMES[Math.floor(Math.random() * NOMES.length)]
    const sobrenome = SOBRENOMES[Math.floor(Math.random() * SOBRENOMES.length)]
    return `${nome} ${sobrenome}`
}

function emailAleatorio(nome) {
    const prefixo = nome.toLowerCase().replace(/\s/g, ".")
    const numero = Math.floor(Math.random() * 1000)
    return `${prefixo}${numero}@exemplo.com`
}

function dataNascimentoAleatoria() {
    const inicio = new Date(1990, 0, 1)
    const fim = new Date(2015, 0, 1)
    return new Date(inicio.getTime() + Math.random() * (fim.getTime() - inicio.getTime()))
}

function instrumentosAleatorios() {
    const quantidade = Math.ceil(Math.random() * 2) // 1 ou 2 instrumentos
    const selecionados = new Set()
    while (selecionados.size < quantidade) {
        const instrumento = INSTRUMENTOS[Math.floor(Math.random() * INSTRUMENTOS.length)]
        selecionados.add(instrumento)
    }
    return Array.from(selecionados)
}

async function popular(qtd = 5) {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log(`Conectado ao MongoDB`)

    const alunos = []

    for (let i = 0; i < qtd; i++) {
        const nome = nomeAleatorio()
        alunos.push({
            nome,
            email: emailAleatorio(nome),
            dataNascimento: dataNascimentoAleatoria(),
            instrumentos: instrumentosAleatorios(),
        })
    }

    await Aluno.insertMany(alunos)
    console.log(`${qtd} alunos inseridos com sucesso.`)

    mongoose.disconnect()
}

popular().catch((err) => {
    console.error("Erro ao popular banco:", err)
    mongoose.disconnect()
})
