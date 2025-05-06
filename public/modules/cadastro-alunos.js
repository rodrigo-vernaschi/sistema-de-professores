document.getElementById("form-cadastro-aluno").addEventListener("submit", async (e) => {
    e.preventDefault() // Impede o comportamento padrão de atualização da página

    const email = document.getElementById("email").value
    const nome = document.getElementById("nome").value
    const nascimento = document.getElementById("nascimento").value
    const instrumentos = Array.from(document.querySelectorAll("input[type='checkbox']:checked")).map((input) => input.value)

    const alunoData = {
        email,
        nome,
        dataNascimento: nascimento,
        instrumentos,
    }

    try {
        const response = await fetch("/api/cadastro-aluno", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(alunoData),
        })

        const data = await response.json()
        if (data.success) {
            // Se o aluno foi cadastrado com sucesso, exiba uma mensagem ou redirecione
            alert("Aluno cadastrado com sucesso!")
            // Você pode resetar o formulário ou redirecionar o usuário para outro lugar
            document.getElementById("form-cadastro-aluno").reset()
        } else {
            // Se houve algum erro, exiba a mensagem de erro
            alert(data.message || "Erro ao cadastrar aluno.")
        }
    } catch (error) {
        console.error("Erro ao cadastrar aluno:", error)
        alert("Erro ao cadastrar aluno.")
    }
})
