import { showLogoutConfirmation } from "./navbar.js"

document.addEventListener("DOMContentLoaded", function () {
    carregarAlunos()
})

function loadNavbar() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))

    if (!userInfo || !userInfo.name || !userInfo.photo) {
        console.error("Informações do usuário não encontradas ou incompletas.")
        return
    }

    createNavbar(userInfo)
}

function createNavbar(userInfo) {
    const navbarHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <!-- Lado esquerdo: Foto e nome do professor -->
                <a class="navbar-brand d-flex align-items-center" href="http://localhost:3000/painel.html">
                    <img id="user-photo" src="${userInfo.photo}" alt="Foto do Professor" class="rounded-circle" width="40" height="40" />
                    <span id="user-name" class="ms-2">${userInfo.name}</span>
                </a>

                <!-- Lado direito: Botão de Logout -->
                <button id="logout-btn" class="btn btn-danger ms-auto">Sair</button>
            </div>
        </nav>
    `

    // Inserir a navbar no início do body da página
    document.body.insertAdjacentHTML("afterbegin", navbarHTML)

    // Adicionar o evento de clique no botão de logout
    const logoutButton = document.getElementById("logout-btn")
    if (logoutButton) {
        logoutButton.addEventListener("click", showLogoutConfirmation)
    }
}

function carregarAlunos() {
    fetch("/api/alunos/recentes")
        .then((response) => response.json())
        .then((alunos) => {
            const tabela = document.getElementById("tabela-alunos")

            if (alunos.length === 0) {
                const mensagem = document.createElement("tr")
                mensagem.innerHTML = "<td colspan='5' class='text-center'>Nenhum aluno cadastrado.</td>"
                tabela.appendChild(mensagem)
                return
            }

            alunos.forEach((aluno) => {
                const linha = document.createElement("tr")

                // Adicionando o evento de clique diretamente na linha
                linha.addEventListener("click", function () {
                    window.location.href = `/perfil.html?id=${aluno._id}`
                })

                linha.innerHTML = `
                    <td>${aluno.nome}</td>
                    <td>${aluno.email}</td>
                    <td>${new Date(aluno.dataNascimento).toLocaleDateString()}</td>
                    <td>${aluno.instrumentos.join(", ")}</td>
                    <td>
                        <button class="btn btn-info btn-sm">Detalhes</button>
                        <button class="btn btn-danger btn-sm">Excluir</button>
                    </td>
                `
                tabela.appendChild(linha)
            })
        })
        .catch((error) => {
            console.error("Erro ao carregar os alunos:", error)
        })
}
