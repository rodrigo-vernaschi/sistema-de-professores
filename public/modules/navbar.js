import { createConfirmationModal } from "./modal.js"

document.addEventListener("DOMContentLoaded", function () {
    loadNavbar()
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

function showLogoutConfirmation() {
    createConfirmationModal("Você tem certeza que deseja sair?", logout)
}

function logout() {
    // Remover o token JWT e informações do usuário do localStorage
    localStorage.removeItem("authToken")
    localStorage.removeItem("userInfo")

    // Redirecionar para a página de login
    window.location.href = "index.html" // Ou outra página de login
}

export { showLogoutConfirmation }
