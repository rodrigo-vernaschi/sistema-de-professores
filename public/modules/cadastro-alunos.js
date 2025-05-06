import { createConfirmationModal } from "./modal.js"

// Função para adicionar a classe de destaque a uma linha da tabela
async function destacarNovoAluno(alunoId) {
    const linhaNovoAluno = document.getElementById(alunoId) // Busca o elemento da linha pelo ID
    if (linhaNovoAluno) {
        // Verifica se a linha foi encontrada
        linhaNovoAluno.classList.add("destaque") // Adiciona a classe CSS 'destaque'
    }
}

// Função assíncrona para carregar os últimos alunos cadastrados da API
async function carregarUltimosAlunos() {
    try {
        // Faz uma requisição GET para a rota '/api/alunos/recentes'
        const response = await fetch("/api/alunos/recentes")
        // Verifica se a resposta da API foi bem-sucedida (status code 2xx)
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`) // Lança um erro se a resposta não for OK
        }

        // Converte a resposta da API para um objeto JSON contendo a lista de alunos
        const alunos = await response.json()
        // Seleciona o corpo da tabela onde os últimos alunos serão exibidos
        const tbody = document.querySelector("#tabela-ultimos-alunos tbody")
        // Limpa o conteúdo do corpo da tabela antes de adicionar os alunos
        tbody.innerHTML = ""

        // Itera sobre cada aluno na lista de alunos recebida da API
        alunos.forEach((aluno) => {
            // Formata a data de nascimento para o padrão brasileiro (dd/mm/aaaa)
            let dataNascimento = "Data não informada"
            if (aluno.dataNascimento) {
                const data = new Date(aluno.dataNascimento)
                const dia = String(data.getUTCDate()).padStart(2, "0") // Obtém o dia UTC e formata com zero à esquerda
                const mes = String(data.getUTCMonth() + 1).padStart(2, "0") // Obtém o mês UTC (base 0) e formata
                const ano = data.getUTCFullYear() // Obtém o ano UTC
                dataNascimento = `${dia}/${mes}/${ano}` // Monta a string da data formatada
            }

            // Cria uma nova linha (`<tr>`) para cada aluno
            const tr = document.createElement("tr")
            // Define o ID da linha como o ID único do aluno (_id)
            tr.id = aluno._id

            // // Define o conteúdo HTML da linha com os dados do aluno
            // tr.innerHTML = `
            //     <td>${aluno.nome}</td>
            //     <td>${aluno.email}</td>
            //     <td>${dataNascimento}</td>
            //     <td>${(aluno.instrumentos || []).join(", ")}</td>
            //     <td>
            //         <button class="btn btn-danger btn-sm btn-excluir" data-id="${aluno._id}" data-nome="${aluno.nome}">Excluir</button>
            //     </td>
            // `

            // Define o conteúdo HTML da linha com os dados do aluno
            tr.innerHTML = `
                <td>${aluno.nome}</td>

                <td>${(aluno.instrumentos || []).join(", ")}</td>
                <td>
                    <button class="btn btn-danger btn-sm btn-excluir" data-id="${aluno._id}" data-nome="${aluno.nome}">Excluir</button>
                </td>
            `

            // Adiciona a linha preenchida ao corpo da tabela
            tbody.appendChild(tr)
        })

        // Seleciona todos os botões de exclusão na tabela
        document.querySelectorAll(".btn-excluir").forEach((btn) => {
            // Adiciona um listener de evento de clique para cada botão de exclusão
            btn.addEventListener("click", () => {
                // Obtém o ID do aluno a ser excluído do atributo 'data-id' do botão
                const id = btn.dataset.id
                // Obtém o nome do aluno para a mensagem de confirmação
                const nome = btn.dataset.nome

                // Chama a função para criar um modal de confirmação antes de excluir
                createConfirmationModal(`Deseja realmente excluir o aluno <strong>${nome}</strong>?`, async () => {
                    try {
                        // Faz uma requisição DELETE para a rota da API do aluno específico
                        const resp = await fetch(`/api/alunos/${id}`, {
                            method: "DELETE",
                        })

                        // Verifica se a resposta da API foi bem-sucedida
                        if (!resp.ok) {
                            let errorMsg = `Erro ${resp.status} ao tentar excluir.`
                            try {
                                // Tenta parsear a resposta JSON para obter uma mensagem de erro mais detalhada
                                const errorData = await resp.json()
                                errorMsg = errorData.message || errorMsg
                            } catch (e) {
                                // Ignora erros ao tentar parsear JSON de erro
                            }
                            console.error("Erro API:", errorMsg)
                            alert(errorMsg)
                            return
                        }

                        let result = { success: true }
                        try {
                            // Tenta parsear a resposta JSON para verificar o resultado da exclusão
                            const text = await resp.text()
                            if (text) {
                                result = JSON.parse(text)
                            }
                        } catch (e) {
                            console.warn("Não foi possível parsear JSON da resposta DELETE:", e)
                        }

                        // Se a exclusão foi bem-sucedida na API
                        if (result.success) {
                            console.log("Aluno excluído com sucesso, atualizando lista...")
                            carregarUltimosAlunos() // Recarrega a lista de alunos atualizada
                        } else {
                            const message = result.message || "A API indicou um erro ao excluir."
                            console.error("Erro Lógico API:", message)
                            alert(message)
                        }
                    } catch (err) {
                        console.error("Erro durante a exclusão (fetch/script):", err)
                        alert("Ocorreu um erro de rede ou script ao tentar excluir o aluno.")
                    }
                })
            })
        })
    } catch (error) {
        console.error("Erro ao carregar os últimos alunos:", error)
    }
}

// Adiciona um listener de evento para quando o DOM estiver completamente carregado
document.addEventListener("DOMContentLoaded", carregarUltimosAlunos)

// Seleciona o formulário de cadastro de alunos
const formCadastroAluno = document.querySelector("#form-cadastro-aluno")
// Adiciona um listener de evento de submit para o formulário
formCadastroAluno.addEventListener("submit", async (event) => {
    event.preventDefault() // Impede o comportamento padrão de submit do formulário

    // Obtém os valores dos campos do formulário
    const emailInput = document.getElementById("email")
    const nomeInput = document.getElementById("nome")
    const nascimentoInput = document.getElementById("nascimento")
    const instrumentosCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked')
    const mensagemDiv = document.getElementById("mensagem")

    const email = emailInput.value
    const nome = nomeInput.value
    const nascimento = nascimentoInput.value
    const instrumentos = Array.from(instrumentosCheckboxes).map((checkbox) => checkbox.value)

    // Validação básica dos campos obrigatórios
    if (!email || !nome || !nascimento || instrumentos.length === 0) {
        mensagemDiv.className = "mt-3 text-center text-danger"
        mensagemDiv.textContent = "Preencha todos os campos obrigatórios."
        return
    }

    try {
        // Faz uma requisição POST para a rota '/cadastro-aluno' para cadastrar o novo aluno
        const response = await fetch("/cadastro-aluno", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Indica que o corpo da requisição é JSON
            },
            body: JSON.stringify({ email, nome, nascimento, instrumentos }), // Converte os dados do formulário para JSON
        })

        // Converte a resposta da API para um objeto JSON
        const data = await response.json()

        // Se a resposta da API indicar sucesso no cadastro
        if (response.ok && data.success) {
            mensagemDiv.className = "mt-3 text-center text-success"
            mensagemDiv.textContent = "Aluno cadastrado com sucesso!"
            formCadastroAluno.reset() // Limpa o formulário
            // Recarrega a lista de alunos e, após a conclusão, destaca o primeiro aluno da tabela
            carregarUltimosAlunos().then(() => {
                const tabelaBody = document.querySelector("#tabela-ultimos-alunos tbody")
                if (tabelaBody && tabelaBody.firstElementChild) {
                    destacarNovoAluno(tabelaBody.firstElementChild.id)
                }
            })
        } else {
            mensagemDiv.className = "mt-3 text-center text-danger"
            mensagemDiv.textContent = data.message || "Erro ao cadastrar o aluno."
        }
    } catch (error) {
        console.error("Erro ao enviar dados do formulário:", error)
        mensagemDiv.className = "mt-3 text-center text-danger"
        mensagemDiv.textContent = "Ocorreu um erro ao enviar os dados."
    }
})
