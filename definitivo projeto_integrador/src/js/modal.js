// Elementos do DOM
const b1Register = document.querySelector("#b1-newStudent");
const modalRegister = document.querySelector("#modal-register");
const closeModalButton = modalRegister.querySelector("#close-register-modal");

// Abrir o modal ao clicar no botão "+ Novo Aluno"
b1Register.addEventListener("click", () => {
    modalRegister.showModal();
});

// Fechar o modal ao clicar no botão "X"
closeModalButton.addEventListener("click", () => {
    modalRegister.close();
});

// Fechar o modal ao clicar fora do conteúdo
modalRegister.addEventListener("click", (event) => {
    if (event.target === modalRegister) {
        modalRegister.close();
    }


});









