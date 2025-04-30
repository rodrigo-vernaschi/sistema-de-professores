const mongoose = require("mongoose")

// Definir o schema para os emails autorizados
const autorizadoSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
})

// Criar o modelo baseado no schema
const Autorizado = mongoose.model("Autorizado", autorizadoSchema)

module.exports = Autorizado
