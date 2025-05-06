require("dotenv").config() // Carrega as variáveis de ambiente do arquivo .env (configurações de conexão, etc.)
const mongoose = require("mongoose") // Importa a biblioteca Mongoose para modelagem de dados e conexão com o MongoDB
const Aluno = require("./src/models/Aluno") // Importa o modelo de Aluno (schema) definido em um arquivo separado

const qtdCadastros = 150 // Define a quantidade de alunos a serem cadastrados no banco de dados

// Define arrays de nomes e sobrenomes para gerar nomes completos aleatórios
const NOMES = ["João", "Maria", "Carlos", "Ana", "Lucas", "Beatriz", "Mateus", "Juliana", "Rafael", "Fernanda", "Pedro", "Sofia", "Gabriel", "Isabela", "Enzo", "Valentina", "Guilherme", "Manuela", "Gustavo", "Laura", "Felipe", "Alice", "Bruno", "Giovanna", "Thiago", "Camila", "Eduardo", "Larissa", "Marcelo", "Carolina", "Vinicius", "Letícia", "Samuel", "Emanuelle", "Diego", "Yasmin", "Rodrigo", "Bruna", "Renan", "Luana", "Ricardo", "Vitória", "Otávio", "Natália", "Henrique", "Amanda", "Davi", "Rebeca", "Daniel", "Gabriela", "André", "Sara", "Vitor", "Raquel", "Leonardo", "Nicole", "Fábio", "Patrícia", "Alexandre", "Clara", "Sérgio", "Juliana", "Roberto", "Bárbara", "Júlio", "Érica", "Fernando", "Cláudia", "Erick", "Bianca", "César", "Vanessa", "Paulo", "Mariana", "Murilo", "Débora", "Márcio", "Silvia", "Luiz", "Rosa", "Jorge", "Carla", "Igor", "Aline", "Hugo", "Sabrina", "Heitor", "Noemi", "Osvaldo", "Sônia", "Nelson", "Ruth", "Mário", "Regina", "Mauro", "Júlia", "Marcos", "Andreia", "Leandro", "Simone", "Kleber", "Adriana", "José", "Cristina", "Jonas", "Ângela", "Jerônimo", "Sandra", "Jaime", "Rose", "Humberto", "Tereza", "Haroldo", "Rosa", "Guido", "Inês", "Gilberto", "Helena", "Geraldo", "Fabiana", "Frederico", "Estela", "Francisco", "Elisa", "Edson", "Daniela", "Douglas", "Carina", "Cláudio", "Beatriz", "Caio", "Aurora", "Artur", "Anita", "Antônio", "Alice", "Alberto", "Agatha", "Adilson", "Ágata", "Abel", "Zélia", "Zacarias", "Yara", "Xavier", "Wanda", "Valdemar", "Ursula", "Tiago", "Thalita", "Sílvio", "Sheila", "Samuel", "Sabrina", "Ronaldo", "Roberta", "Raul", "Ramona", "Pedro", "Patrícia", "Paulo", "Paula", "Otávio", "Olívia", "Nestor", "Norma", "Nilton", "Nilda"]
const SOBRENOMES = ["Silva", "Souza", "Oliveira", "Lima", "Almeida", "Costa", "Pereira", "Ramos", "Santos", "Ferreira", "Gomes", "Martins", "Rocha", "Carvalho", "Andrade", "Barbosa", "Ribeiro", "Pinto", "Mendes", "Nunes", "Correia", "Cavalcanti", "Dias", "Freitas", "Castro", "Campos", "Araújo", "Santana", "Moreira", "Morais", "Melo", "Machado", "Leal", "Guedes", "Galvão", "Fontes", "Esteves", "Dantas", "Cunha", "Coelho", "Cardoso", "Borges", "Barros", "Batista", "Assunção", "Azevedo", "Arruda", "Alves", "Aguiar", "Sales", "Sampaio", "Peixoto", "Paiva", "Padilha", "Otero", "Neto", "Nascimento", "Miranda", "Medeiros", "Matos", "Marinho", "Maia", "Lopes", "Lisboa", "Leite", "Lacerda", "Justo", "Jesus", "Henriques", "Guerra", "Gonçalves", "Godoi", "Girão", "Garcia", "Furtado", "Fraga", "Fonseca", "Flores", "Figueiredo", "Feitosa", "Farias", "Fagundes", "Evangelista", "Elias", "Dourado", "Domingues", "Diniz", "Delgado", "Deodato", "Delfino", "Coutinho", "Cruz", "Crisóstomo", "Crepaldi", "Crespo", "Cordeiro", "Correa", "Copello", "Conceição", "Colombo", "Cavalcante", "Castanho", "Casado", "Carneiro", "Campelo", "Caldeira", "Caldas", "Cabrera", "Bustamante", "Buarque", "Brandão", "Brasil", "Braga", "Bocage", "Bobadilha", "Bittencourt", "Bivar", "Bezerra", "Bernardes", "Belchior", "Barroso", "Barcelos", "Baltazar", "Ayala", "Athayde", "Arraes", "Argolo", "Aragão", "Aquino", "Andrade", "Anjos", "Amorim", "Alencar", "Acioli"]

// Define o array de instrumentos musicais permitidos
const INSTRUMENTOS = ["violino", "viola", "violoncelo"]

/**
 * Gera um nome completo aleatório a partir das listas de nomes e sobrenomes.
 * @returns {string} O nome completo gerado.
 */
function nomeAleatorio() {
    // Seleciona um nome aleatório do array NOMES
    const nome = NOMES[Math.floor(Math.random() * NOMES.length)]
    // Seleciona um sobrenome aleatório do array SOBRENOMES
    const sobrenome = SOBRENOMES[Math.floor(Math.random() * SOBRENOMES.length)]
    // Retorna o nome completo concatenado
    return `${nome} ${sobrenome}`
}

/**
 * Gera um endereço de email aleatório a partir de um nome.
 * @param {string} nome O nome da pessoa para gerar o email.
 * @returns {string} O endereço de email gerado.
 */
function emailAleatorio(nome) {
    // Converte o nome para minúsculo e substitui espaços por pontos para criar o prefixo do email
    const prefixo = nome.toLowerCase().replace(/\s/g, ".")
    // Gera um número aleatório para adicionar ao email (aumentei o intervalo para evitar repetição)
    const numero = Math.floor(Math.random() * 10000)
    // Retorna o endereço de email completo
    return `${prefixo}${numero}@exemplo.com`
}

/**
 * Gera uma data de nascimento aleatória entre 1990 e 2015.
 * @returns {Date} A data de nascimento gerada.
 */
function dataNascimentoAleatoria() {
    // Define a data de início do intervalo (1 de janeiro de 1990)
    const inicio = new Date(1990, 0, 1)
    // Define a data de fim do intervalo (1 de janeiro de 2015)
    const fim = new Date(2015, 0, 1)
    // Calcula um timestamp aleatório entre o início e o fim e cria um novo objeto Date
    return new Date(inicio.getTime() + Math.random() * (fim.getTime() - inicio.getTime()))
}

/**
 * Gera um array aleatório de instrumentos musicais a partir da lista INSTRUMENTOS.
 * @returns {string[]} O array de instrumentos gerado.
 */
function instrumentosAleatorios() {
    // Define a quantidade de instrumentos a serem selecionados (entre 1 e 3)
    const quantidade = Math.ceil(Math.random() * 3)
    // Cria um Set para armazenar os instrumentos selecionados (evita repetição)
    const selecionados = new Set()
    // Loop para selecionar instrumentos aleatórios até atingir a quantidade desejada
    while (selecionados.size < quantidade) {
        // Seleciona um instrumento aleatório da lista INSTRUMENTOS
        const instrumento = INSTRUMENTOS[Math.floor(Math.random() * INSTRUMENTOS.length)]
        // Adiciona o instrumento ao Set
        selecionados.add(instrumento)
    }
    // Converte o Set para um array e o retorna
    return Array.from(selecionados)
}

/**
 * Popula o banco de dados com alunos aleatórios.
 * @param {number} qtd A quantidade de alunos a serem inseridos (o padrão é o valor de qtdCadastros).
 * @returns {Promise<void>} Uma Promise que resolve quando os alunos são inseridos com sucesso.
 */
async function popular(qtd = qtdCadastros) {
    try {
        // Conecta ao banco de dados MongoDB usando a URI definida nas variáveis de ambiente
        await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Conectado ao MongoDB`)

        // Array para armazenar os objetos de aluno a serem inseridos no banco de dados
        const alunos = []

        // Loop para gerar os dados de cada aluno
        for (let i = 0; i < qtd; i++) {
            const nome = nomeAleatorio()
            alunos.push({
                nome: nome, // Nome completo do aluno
                email: emailAleatorio(nome), // Email gerado para o aluno
                dataNascimento: dataNascimentoAleatoria(), // Data de nascimento aleatória
                instrumentos: instrumentosAleatorios(), // Array de instrumentos musicais aleatórios
            })
        }

        // Insere os alunos no banco de dados usando o método insertMany do Mongoose
        await Aluno.insertMany(alunos)
        console.log(`${qtd} alunos inseridos com sucesso.`)
    } catch (err) {
        // Captura e imprime erros que ocorrerem durante o processo
        console.error("Erro ao popular banco:", err)
    } finally {
        // Desconecta do banco de dados após a conclusão (com sucesso ou erro)
        mongoose.disconnect()
    }
}

// Executa a função popular e trata erros globais
popular().catch((err) => {
    console.error("Erro ao popular banco:", err)
})
