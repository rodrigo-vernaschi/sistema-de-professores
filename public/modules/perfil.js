import { verificarLoginOuRedirecionar } from "./auth.js"

verificarLoginOuRedirecionar()

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const alunoId = urlParams.get("id")

    if (!alunoId) {
        alert("Aluno não encontrado.")
        window.location.href = "painel.html"
        return
    }

    try {
        const res = await fetch(`/api/alunos/${alunoId}`)
        if (!res.ok) throw new Error("Erro ao buscar aluno")

        const aluno = await res.json()

        document.getElementById("nome-aluno").textContent = aluno.nome
        document.getElementById("foto-perfil").src = aluno.fotoPerfil || "https://via.placeholder.com/150"
        document.getElementById("instrumentos-aluno").textContent = (aluno.instrumentos || []).join(", ")
    } catch (err) {
        console.error(err)
        alert("Erro ao carregar perfil.")
        window.location.href = "painel.html"
    }
})
