const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")
const { OAuth2Client } = require("google-auth-library")
const Aluno = require("./models/Aluno")
const Professor = require("./models/Professor")
const Autorizado = require("./models/Autorizado")

dotenv.config()

const app = express()
const port = 3000

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

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

    // Verificar se o email já está autorizado
    try {
        const emailExistente = await Autorizado.findOne({ email })

        if (emailExistente) {
            return res.status(400).json({ success: false, message: "Este email já está cadastrado." })
        }

        // Criar um novo registro de email autorizado
        const novoEmail = new Autorizado({ email })
        await novoEmail.save()

        return res.status(200).json({ success: true, message: "Email cadastrado com sucesso." })
    } catch (error) {
        console.error("Erro ao cadastrar email:", error)
        return res.status(500).json({
            success: false,
            message: "Erro interno ao cadastrar o email.",
        })
    }
})

// Rota para listar todos os emails autorizados
app.get("/emails-autorizados", async (req, res) => {
    try {
        const emails = await Autorizado.find() // Buscar todos os emails na coleção
        return res.status(200).json(emails)
    } catch (error) {
        console.log("Erro ao buscar emails: ", error)
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar emails cadastrados.",
        })
    }
})

// Rota para excluir aluno pelo ID
app.delete("/api/alunos/:id", async (req, res) => {
    const { id } = req.params

    try {
        const alunoDeletado = await Aluno.findByIdAndDelete(id)

        if (!alunoDeletado) {
            return res.status(404).json({ success: false, message: "Aluno não encontrado." })
        }

        return res.status(200).json({ success: true, message: "Aluno excluído com sucesso." })
    } catch (error) {
        console.error("Erro ao excluir aluno:", error)
        return res.status(500).json({ success: false, message: "Erro ao excluir aluno." })
    }
})

// Rota para cadastro de alunos
app.post("/cadastro-aluno", async (req, res) => {
    const { email, nome, nascimento, instrumentos } = req.body

    if (!email || !nome || !nascimento || !instrumentos || instrumentos.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Preencha todos os campos obrigatórios.",
        })
    }

    try {
        const alunoExistente = await Aluno.findOne({ email })
        if (alunoExistente) {
            return res.status(400).json({ success: false, message: "Este aluno já está cadastrado." })
        }

        const novoAluno = new Aluno({
            email,
            nome,
            dataNascimento: nascimento, // Mapeia o valor recebido para o campo correto
            instrumentos,
        })

        await novoAluno.save()

        return res.status(201).json({ success: true })
    } catch (erro) {
        console.error("Erro ao cadastrar aluno:", erro)
        return res.status(500).json({
            success: false,
            message: "Erro interno ao cadastrar o aluno.",
        })
    }
})

// Serve arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, "../public")))

// Rota principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"))
})

// Rota para buscar os últimos 3 alunos cadastrados
app.get("/api/alunos/recentes", async (req, res) => {
    try {
        const ultimosAlunos = await Aluno.find().sort({ createdAt: -1 }).limit(3)
        res.json(ultimosAlunos)
    } catch (err) {
        console.error("Erro ao buscar alunos:", err)
        res.status(500).json({ erro: "Erro ao buscar alunos" })
    }
})

app.get("/api/alunos/search", async (req, res) => {
    const { nome, page = 1, limit = 10 } = req.query
    const nomeMaiusculo = nome.toUpperCase()

    try {
        // Usei um índice para otimizar a busca por nome
        const alunos = await Aluno.find({
            nome: { $regex: nomeMaiusculo, $options: "i" },
        })
            .sort({ createdAt: -1 }) // Ordena do mais recente para o mais antigo
            .skip((page - 1) * limit)
            .limit(Number(limit))

        const totalAlunos = await Aluno.countDocuments({
            nome: { $regex: nomeMaiusculo, $options: "i" },
        })

        res.json({
            alunos,
            totalAlunos,
        })
    } catch (error) {
        console.error("Erro ao buscar alunos por nome:", error)
        res.status(500).json({ erro: "Erro ao buscar alunos" })
    }
})

// Rota para buscar alunos paginados
app.get("/api/alunos", async (req, res) => {
    const { page = 1, limit = 10 } = req.query

    try {
        const alunos = await Aluno.find()
            .sort({ createdAt: -1 }) // Ordena do mais recente para o mais antigo
            .skip((page - 1) * limit) // Pular os alunos já exibidos nas páginas anteriores
            .limit(Number(limit)) // Limitar a quantidade de alunos por página

        const totalAlunos = await Aluno.countDocuments() // Contar o total de alunos cadastrados

        res.json({
            alunos,
            totalAlunos,
        })
    } catch (err) {
        console.error("Erro ao buscar alunos:", err)
        res.status(500).json({ erro: "Erro ao buscar alunos" })
    }
})

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})
