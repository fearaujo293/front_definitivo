const apiurlget = 'http://localhost:8080/mshub/get';  // URL da API para pegar os dados
const apiurlPut = 'http://localhost:8080/mshub/update';  // URL da API para pegar os dados
const apiurlDell = 'http://localhost:8080/mshub/delete';  // URL da API para pegar os dados
const apiurlimgPut = 'http://localhost:8080/image/updt';  // URL da API para pegar os dados
const apiurlimgDell = 'http://localhost:8080/image/del';  // URL da API para pegar os dados
const apiurlimgNew = 'http://localhost:8080/image/upload';  // URL da API para pegar os dados

// Função para carregar os dados assim que a página for carregada
window.onload = function() {
    main();
};

// Função principal que busca os dados da API e os exibe
async function main() {
    try {
        // Fetch para pegar os dados da API
        const response = await fetch(apiurlget);
        
        // Verifica se a resposta é bem-sucedida (status 200)
        if (!response.ok) {
            console.error('Erro ao buscar os dados:', response.status);
            return;
        }
        
        // Converte a resposta em JSON
        const dados = await response.json();

        // Verifica se os dados são válidos
        console.log(dados); // Verifique o que está sendo retornado pela API
        renderAlunos(dados);
    } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
    }
}

// Função que renderiza os dados dos alunos na tabela

function renderAlunos(dados) {
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = ''; // Limpa a tabela antes de inserir os dados
    
    // Loop para preencher cada linha da tabela com os dados dos alunos
    dados.forEach(aluno => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
            <button type="button" id="alunoModal" style="all: unset; cursor: pointer" onclick="abrirModal('${aluno.id}')">
                <img src="${aluno.imagURL || 'src/img/icon-default.png'}" alt="Foto" width="42" height="42" style="border-radius: 180px">
            </button>   
            </td>
            <td>
                <button type="button" class="bt" style="all: unset; cursor: pointer" onclick="abrirModal('${aluno.id}')">
                    ${aluno.nome}
                </button>
            </td>
            <td>${aluno.email}</td>
            <td>${aluno.telefone}</td>
            <td>${aluno.matricula}</td>
            <td>${aluno.responsavel}</td>
            <td>
                <button class="b1-EditStudent" onclick="editarAluno('${aluno.id}')" style="all: unset; cursor: pointer" type="button">
                <img src="src/img/editar.png" alt="editar"  >
                </button>
                <button onclick="deletarAluno('${aluno.id}')" style="all: unset; cursor: pointer" type="button" >
                 <img src="src/img/excluir.png" alt="excluir"  >
                </button>
            </td>`;
        
        tbody.appendChild(tr);
    });
}

// Função para abrir o modal e buscar os dados do aluno

async function abrirModal(id) {
    try {
        const modal = document.getElementById("alunoModalInfo");
        if (!(modal instanceof HTMLDialogElement)) {
            throw new Error("Elemento 'alunoModal' não é um <dialog> válido.");
        }

        const detalhesContainer = document.getElementById("alunoDetalhes");

        // Buscar os dados do aluno pela API
        const response = await fetch(`${apiurlget}/${id}`);
        if (!response.ok) {
            console.error('Erro ao buscar os dados do aluno:', response.status);
            return;
        }

        const aluno = await response.json();

        // Preencher os detalhes do aluno no modal
        detalhesContainer.innerHTML = `
        <div class="aluno-photo-container">
            <img 
                src="${aluno.imagURL || 'src/img/icon-default.png'}" 
                alt="Foto do aluno" 
                class="aluno-photo">
        </div>
        
        <div class="aluno-info">
            <p class="aluno-detalhe aluno-id">
                <strong class="aluno-label">ID:</strong> ${aluno.id}
            </p>
            <p class="aluno-detalhe aluno-nome">
                <strong class="aluno-label">Nome:</strong> ${aluno.nome}
            </p>
            <p class="aluno-detalhe aluno-email">
                <strong class="aluno-label">Email:</strong> ${aluno.email}
            </p>
            <p class="aluno-detalhe aluno-telefone">
                <strong class="aluno-label">Telefone:</strong> ${aluno.telefone}
            </p>
            <p class="aluno-detalhe aluno-matricula">
                <strong class="aluno-label">Matrícula:</strong> ${aluno.matricula}
            </p>
            <p class="aluno-detalhe aluno-responsavel">
                <strong class="aluno-label">Responsável:</strong> ${aluno.responsavel}
            </p>
        </div>
        
        <div class="aluno-actions">
            <button class="b1-EditStudent aluno-btn-edit" onclick="editarAluno('${aluno.id}')" type="button">
                <img src="src/img/Action 2.png" alt="editar" class="aluno-btn-icon">
            </button>
            <button class="b1-DeleteStudent aluno-btn-delete" onclick="deletarAluno('${aluno.id}')" type="button">
                <img src="src/img/Action 3.png" alt="excluir" class="aluno-btn-icon">
            </button>
        </div>
    `;
    

        // Mostrar o modal
        modal.showModal();

    } catch (error) {
        console.error('Erro ao fazer a requisição para o modal:', error);
    }
}


// Adicionar evento para fechar o modal
document.getElementById("closeModal").addEventListener("click", () => {
    const modal = document.getElementById("alunoModalInfo");
    modal.close();
});

    

async function editarAluno(id) {
    const modalEdit = document.getElementById("modal-Edit-Student");
    const modalConfirm = document.getElementById("modal-confirm");
    const closeModalButton = modalEdit.querySelector("#close-edit-modal");
    const editForm = document.getElementById("editForm");

    // Abre o modal de edição
    modalEdit.showModal();

    // Fecha o modal de edição ao clicar no "X"
    closeModalButton.addEventListener("click", () => {
        modalEdit.close();
    });

    // Evento de submit do formulário
    editForm.addEventListener("submit", (event) => {
        event.preventDefault();  // Impede o envio tradicional do formulário

        // Exibe o modal de confirmação
        modalConfirm.showModal();
    });

    // Ações para o modal de confirmação
    const confirmYes = document.getElementById("confirm-yes");
    const confirmNo = document.getElementById("confirm-no");

    // Ao clicar em "Sim", envia os dados para o servidor
    confirmYes.addEventListener("click", async () => {
        try {
            // Pega os dados do formulário
            const Inome = document.getElementById("edit-nome").value.trim();
            const Itelefone = document.getElementById("edit-telefone").value.trim();
            const Imatricula = document.getElementById("edit-rm").value.trim();
            const Iemail = document.getElementById("edit-email").value.trim();
            const Iresponsavel = document.getElementById("edit-responsavel").value.trim();

            const alunoData = {
                nome: Inome || undefined,
                telefone: Itelefone || undefined,
                matricula: Imatricula || undefined,
                email: Iemail || undefined,
                responsavel: Iresponsavel || undefined
            };

            // Primeiro fetch para enviar os dados em formato JSON (sem imagem)
            const responseJson = await fetch(`${apiurlPut}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(alunoData)
            });

            if (!responseJson.ok) {
                console.error("Erro ao atualizar os dados do aluno (JSON).");
                return;
            }

            // Espera 500ms antes de enviar a imagem
            setTimeout(async () => {
                
                const file = document.getElementById("edit-imagem").files[0];  // Arquivo de imagem
                if (file) {
                    const formData = new FormData();
                    formData.append("file", file);

                    const responseImage = await fetch(`${apiurlimgPut}/${id}`, {
                        method: 'PUT',
                        body: formData
                    });

                    if (responseImage.ok) {
                        console.log("Imagem atualizada com sucesso!");
                    } else {
                        console.error("Erro ao atualizar imagem.");
                    }
                }
            }, 1000); // Atraso de 1000ms para o segundo fetch
            modalConfirm.close();
            modalEdit.close();  // Fecha ambos os modais
            setTimeout(() => {
                window.location.reload();
            }, 1000); 
        } catch (error) {
            console.error("Erro ao enviar dados:", error);
            modalConfirm.close();
        }
    });

    // Caso o usuário clique em "Não", apenas fecha o modal de confirmação
    confirmNo.addEventListener("click", () => {
        modalConfirm.close();
        modalEdit.showModal();  // Reabre o modal de edição
    });
}




async function deletarAluno(id) {
    const modalConfirm = document.getElementById("modal-confirm-delete");
    const confirmYes = document.getElementById("confirm-yes-delete");
    const confirmNo = document.getElementById("confirm-no-delete");

    // Exibe o modal de confirmação
    modalConfirm.showModal();

    // Caso o usuário clique em "Sim"
    confirmYes.addEventListener("click", async () => {
        try {
            // Primeiro fetch: Deleta a imagem do aluno
            const responseImg = await fetch(`${apiurlimgDell}/${id}`, {
                method: 'DELETE',
            });

            if (!responseImg.ok) {
                console.error("Erro ao deletar a imagem do aluno.");
                modalConfirm.close();
                return;
            }

            console.log("Imagem deletada com sucesso!");

            // Espera 500ms antes de fazer o segundo fetch
            setTimeout(async () => {
                // Segundo fetch: Deleta os dados do aluno
                const responseAluno = await fetch(`${apiurlDell}/${id}`, {
                    method: 'DELETE',
                });

                if (responseAluno.ok) {
                    console.log("Aluno deletado com sucesso!");
                } else {
                    console.error("Erro ao deletar o aluno.");
                }
            }, 500); // Atraso de 500ms
        } catch (error) {
            console.error("Erro ao deletar o aluno ou imagem:", error);
        } finally {
            modalConfirm.close(); // Fecha o modal de confirmação
            setTimeout(() => {
                window.location.reload();
            }, 500); //
        }
    });

    // Caso o usuário clique em "Não"
    confirmNo.addEventListener("click", () => {
        modalConfirm.close(); // Apenas fecha o modal de confirmação
    });
}
