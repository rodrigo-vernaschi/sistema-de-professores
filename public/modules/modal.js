// // modal.js

// function createConfirmationModal(message, onConfirm) {
//     // HTML do modal
//     const modalHTML = `
//         <div class="modal fade" id="modalConfirmacao" tabindex="-1" aria-labelledby="modalConfirmacaoLabel" aria-hidden="true">
//             <div class="modal-dialog">
//                 <div class="modal-content">
//                     <div class="modal-header">
//                         <h5 class="modal-title" id="modalConfirmacaoLabel">Confirmar Ação</h5>
//                         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
//                     </div>
//                     <div class="modal-body">${message}</div>
//                     <div class="modal-footer">
//                         <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
//                         <button type="button" id="btnConfirmar" class="btn btn-danger">Confirmar</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     `

//     // Inserir o modal no corpo da página
//     document.body.insertAdjacentHTML("beforeend", modalHTML)

//     // Adicionar evento de confirmação
//     const confirmButton = document.getElementById("btnConfirmar")
//     confirmButton.addEventListener("click", () => {
//         onConfirm() // Executa a função fornecida como callback
//         closeModal()
//     })

//     // Exibir o modal
//     const modal = new bootstrap.Modal(document.getElementById("modalConfirmacao"))
//     modal.show()
// }

// // Função para fechar o modal
// function closeModal() {
//     const modalElement = document.getElementById("modalConfirmacao")
//     if (modalElement) {
//         const modal = bootstrap.Modal.getInstance(modalElement)
//         modal.hide()
//         modalElement.remove() // Remove o modal da página após fechado
//     }
// }

// export { createConfirmationModal }

// modal.js

function createConfirmationModal(message, onConfirm) {
    // 1. Remove qualquer modal existente para evitar conflitos de ID
    const existingModalElement = document.getElementById("modalConfirmacao")
    if (existingModalElement) {
        const existingModalInstance = bootstrap.Modal.getInstance(existingModalElement)
        if (existingModalInstance) {
            // Ouve o evento hidden para remover APÓS fechar
            existingModalElement.addEventListener(
                "hidden.bs.modal",
                () => {
                    if (document.body.contains(existingModalElement)) {
                        // Verifica se ainda existe
                        existingModalElement.remove()
                    }
                },
                { once: true }
            )
            existingModalInstance.hide()
        } else {
            // Se não há instância, apenas remove o elemento
            if (document.body.contains(existingModalElement)) {
                existingModalElement.remove()
            }
        }
    }

    // HTML do modal (sem alterações aqui)
    const modalHTML = `
        <div class="modal fade" id="modalConfirmacao" tabindex="-1" aria-labelledby="modalConfirmacaoLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalConfirmacaoLabel">Confirmar Ação</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                    </div>
                    <div class="modal-body">${message}</div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" id="btnConfirmar" class="btn btn-danger">Confirmar</button>
                    </div>
                </div>
            </div>
        </div>
    `

    // Inserir o modal no corpo da página
    document.body.insertAdjacentHTML("beforeend", modalHTML)

    const modalElement = document.getElementById("modalConfirmacao")
    const modal = new bootstrap.Modal(modalElement)
    const confirmButton = document.getElementById("btnConfirmar")

    // Variável para garantir que onConfirm seja chamado apenas uma vez
    let confirmed = false

    const confirmClickListener = () => {
        if (confirmed) return // Previne múltiplos cliques
        confirmed = true
        onConfirm() // Executa a função fornecida como callback
        modal.hide() // Esconde o modal (Bootstrap vai disparar 'hidden.bs.modal')
    }

    // Remove listener anterior se existir (precaução) e adiciona o novo
    confirmButton.removeEventListener("click", confirmClickListener)
    confirmButton.addEventListener("click", confirmClickListener)

    // 3. Adiciona listener para remover o modal do DOM APÓS ser escondido
    modalElement.addEventListener(
        "hidden.bs.modal",
        () => {
            if (document.body.contains(modalElement)) {
                // Verifica antes de remover
                modalElement.remove()
            }
        },
        { once: true }
    ) // { once: true } remove o listener após a primeira execução

    // Exibir o modal
    modal.show()
}

// Não precisamos mais da função closeModal separada

export { createConfirmationModal }
