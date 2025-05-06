// modal.js

function createConfirmationModal(message, onConfirm) {
    // HTML do modal
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

    // Adicionar evento de confirmação
    const confirmButton = document.getElementById("btnConfirmar")
    confirmButton.addEventListener("click", () => {
        onConfirm() // Executa a função fornecida como callback
        closeModal()
    })

    // Exibir o modal
    const modal = new bootstrap.Modal(document.getElementById("modalConfirmacao"))
    modal.show()
}

// Função para fechar o modal
function closeModal() {
    const modalElement = document.getElementById("modalConfirmacao")
    if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement)
        modal.hide()
        modalElement.remove() // Remove o modal da página após fechado
    }
}

export { createConfirmationModal }
