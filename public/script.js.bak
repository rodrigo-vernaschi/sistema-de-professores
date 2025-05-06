console.log("Sistema de Controle para Professores")

// LOGIN DO GOOGLE
function handleGoogleLogin(response) {
    const token = response.credential

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.token) {
                localStorage.setItem("authToken", data.token)
                window.location.href = "painel.html" // redireciona
            } else {
                alert("Falha na autenticação")
            }
        })
        .catch((err) => {
            console.log("Erro ao autenticar: ", err)
        })
}

// CADASTRO DE NOVOS PROFESSORES (ENVIO DO FORMULÁRIO)
document.getElementById("formCadastro").addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value

    const resposta = await fetch("/autorizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    })

    const data = await resposta.json()
    const msg = document.getElementById("mensagem")
    msg.textContent = data.mensagem || "Erro ao cadastrar"
    msg.className = resposta.ok ? "text-success" : "text-danger"
})

// EXIBIR TABELA DE EMAILS JÁ CADASTRADOS
async function carregarEmails() {
    try {
        const res = await fetch("/emails-autorizados")
        const emails = await res.json()

        const tabela = document.getElementById("tabelaEmails")
        const semEmails = document.getElementById("semEmails")

        tabela.innerHTML = ""

        if (emails.length === 0) {
            semEmails.style.display = "block"
        } else {
            semEmails.style.display = "none"
            emails.forEach(({ email }) => {
                const linha = document.createElement("tr")
                linha.innerHTML = `<td>${email}</td>`
                tabela.appendChild(linha)
            })
        }
    } catch (err) {
        console.log("Erro ao carregar emails: ", err)
    }
}

if (document.getElementById("tabelaEmails")) {
    document.addEventListener("DOMContentLoaded", carregarEmails)
}
