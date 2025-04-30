const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")
const { OAuth2Client } = require("google-auth-library")

dotenv.config()

const app = express()
const port = 3000

// Cabeçalhos de segurança para COOP e COEP
// app.use((req, res, next) => {
//     res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
//     res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
//     next()
// })

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const Professor = require("./models/Professor")
const Autorizado = require("./models/Autorizado")

// Conectar ao MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Conectado ao MongoDB"))
    .catch((err) => console.log("Erro ao conectar ao MongoDB"))

// Middleware para verificar o corpo da requisição como JSON
app.use(express.json())

// Rota de autenticação com o Google
app.post("/login", async (req, res) => {
    const token = req.body.token // token JWT enviado pelo Google

    try {
        // Verificação do token do Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        })

        // Recuperar as informações do usuário do token do Google
        const payload = ticket.getPayload()
        const email = payload.email
        const name = payload.name
        const photo = payload.picture // URL da foto do usuário

        // Verificar se o email está autorizado
        const professorAutorizado = await Autorizado.findOne({ email })
        if (!professorAutorizado) {
            return res.status(403).json("Email não autorizado a acessar o sistema.")
        }

        // Verificar se o professor já está registrado no MongoDB
        const professor = await Professor.findOne({ email: payload.email })
        if (!professor) {
            const newProfessor = new Professor({
                email: payload.email,
                nome: payload.name,
            })
            await newProfessor.save()
        }

        // Gerar o JWT do sistema para o professor autenticado
        const jwtToken = jwt.sign({ email: payload.email, nome: payload.name }, process.env.JWT_SECRET, { expiresIn: "1h" })

        // Retornar o JWT para o frontend, junto com as informações do usuário
        res.status(200).json({
            token: jwtToken,
            name: name,
            photo: photo, // Passando a URL da foto
        })
    } catch (err) {
        res.status(400).json("Erro de autenticação")
    }
})

app.post("/verificar-token", (req, res) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) return res.json({ valido: false })

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.json({ valido: false })

        res.json({ valido: true, usuario: user })
    })
})

// Rota para cadastrar emails autorizados
app.post("/novo-professor", async (req, res) => {
    const { email } = req.body

    // criar um novo registro de email autorizado
    const novoEmail = new Autorizado({ email })

    try {
        const emailExistente = await Autorizado.findOne({ email })

        if (emailExistente) {
            return res.status(400).json({ success: false, message: "Este email já está cadastrado." })
        }

        const novoEmail = new Autorizado({ email })
        await novoEmail.save()

        return res.status(200).json({ success: true, message: "Email cadastrado com sucesso." })
    } catch (error) {
        console.error("Erro ao cadastrar email:", error)
        return res.status(500).json({ success: false, message: "Erro interno ao cadastrar o email." })
    }
})

// Rota para listar todos os emails autorizados
app.get("/emails-autorizados", async (req, res) => {
    try {
        const emails = await Autorizado.find() // Buscar todos os emails na coleção
        return res.status(200).json(emails)
    } catch (error) {
        console.log("Erro ao buscar emails: ", error)
        return res.status(500).json({ success: false, message: "Erro ao buscar emails cadastrados." })
    }
})

app.delete("/email/:id", async (req, res) => {
    try {
        const { id } = req.params
        console.log("Tentando deletar o email com id:", id) // Adicionando um log para verificar

        const resultado = await Autorizado.findByIdAndDelete(id)

        if (!resultado) {
            console.log("Email não encontrado para o id:", id) // Log se não encontrar o email
            return res.status(404).json({ success: false, message: "Email não encontrado." })
        }

        console.log("Email deletado com sucesso:", resultado) // Log do email deletado
        return res.status(200).json({ success: true, message: "Email removido com sucesso." })
    } catch (error) {
        console.log("Erro ao deletar email: ", error)
        return res.status(500).json({ success: false, message: "Erro ao remover o email." })
    }
})

// Serve arquivos estátcos da pasta public
app.use(express.static(path.join(__dirname, "../public")))

// Rota principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"))
})

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})
