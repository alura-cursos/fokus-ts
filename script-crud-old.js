const formTask = document.querySelector('form.app__form-add-task')
const toggleFormTaskBtn = document.querySelector('.app__button--add-task')
const cancelFormTaskBtn = document.querySelector('.app__form-footer__button--cancel')
const taskListContainer = document.querySelector('.app__section-task-list')
const taskAtiveDescription = document.querySelector('.app__section-active-task-description')
const textarea = document.querySelector('.app__form-textarea')
const btnCancelar = document.querySelector('.app__form-footer__button--cancel')
const btnDeletar = document.querySelector('.app__form-footer__button--delete')

const btnDeletarConcluidas = document.querySelector('#btn-remover-concluidas')
const btnDeletarTodas = document.querySelector('#btn-remover-todas')

const formLabel = document.querySelector('.app__form-label')


let tarefas = [

]

const taskIconSvg = `
<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF" />
    <path
        d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
        fill="#01080E" />
</svg>
`

let tarefaSelecionada = null
let itemTarefaSelecionada = null

let tarefaEmEdicao = null
let paragraphEmEdicao = null


const removerTarefas = (somenteConcluidas) => {
    const seletor = somenteConcluidas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach((element) => {
        element.remove();
    });

    tarefas = somenteConcluidas ? tarefas.filter(t => !t.concluida) : []
}

const selecionaTarefa = (tarefa, elemento) => {

    if (tarefa.concluida) {
        return
    }
    document.querySelectorAll('.app__section-task-list-item-active').forEach(function (button) {
        button.classList.remove('app__section-task-list-item-active');
    });

    if (tarefaSelecionada == tarefa) {
        taskAtiveDescription.textContent = null
        itemTarefaSelecionada = null
        tarefaSelecionada = null
        return
    }

    tarefaSelecionada = tarefa
    itemTarefaSelecionada = elemento
    taskAtiveDescription.textContent = tarefa.descricao
    elemento.classList.add('app__section-task-list-item-active')
}

const limparForm = () => {
    tarefaEmEdicao = null
    paragraphEmEdicao = null
    textarea.value = ''
    formTask.classList.add('hidden')
}

const selecionaTarefaParaEditar = (tarefa, elemento) => {
    if (tarefa.concluida) {
        return
    }

    if (tarefaEmEdicao == tarefa) {
        limparForm()
        return
    }
    formLabel.textContent = 'Editando tarefa'
    tarefaEmEdicao = tarefa
    paragraphEmEdicao = elemento
    textarea.value = tarefa.descricao
    formTask.classList.remove('hidden')
}

function createTask(tarefa) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svgIcon = document.createElement('svg')
    svgIcon.innerHTML = taskIconSvg

    const paragraph = document.createElement('p')
    paragraph.classList.add('app__section-task-list-item-description')
    paragraph.textContent = tarefa.descricao

    const button = document.createElement('button')
    button.classList.add('app_button-edit')

    const editIcon = document.createElement('img')
    editIcon.setAttribute('src', '/imagens/edit.png')

    button.appendChild(editIcon)

    button.addEventListener('click', (event) => {
        event.stopPropagation()
        selecionaTarefaParaEditar(tarefa, paragraph)
    })

    svgIcon.addEventListener('click', (event) => {
        event.stopPropagation()
        li.classList.add('app__section-task-list-item-complete')
        button.setAttribute('disabled', true)
    })

    li.onclick = () => {
        selecionaTarefa(tarefa, li)
    }

    if (tarefa.concluida) {
        button.setAttribute('disabled', true)
        li.classList.add('app__section-task-list-item-complete')
    }

    li.appendChild(svgIcon)
    li.appendChild(paragraph)
    li.appendChild(button)

    return li;
}

tarefas.forEach(task => {
    const taskItem = createTask(task)
    taskListContainer.appendChild(taskItem)
})


cancelFormTaskBtn.addEventListener('click', () => {
    formTask.classList.add('hidden')
})

toggleFormTaskBtn.addEventListener('click', () => {
    formLabel.textContent = 'Adicionando tarefa'
    formTask.classList.toggle('hidden')
})

btnCancelar.addEventListener('click', limparForm)

btnDeletar.addEventListener('click', () => {
    if (tarefaSelecionada) {
        itemTarefaSelecionada.remove()
        tarefas.filter(t => t != tarefaSelecionada) 
        itemTarefaSelecionada = null
        tarefaSelecionada = null
    }
    limparForm()
})

formTask.addEventListener('submit', (evento) => {
    evento.preventDefault()
    if (tarefaEmEdicao) {
        tarefaEmEdicao.descricao = textarea.value
        paragraphEmEdicao.textContent = textarea.value
    } else {
        const task = {
            descricao: textarea.value,
            concluida: false
        }
        tarefas.push(task)
        const taskItem = createTask(task)
        taskListContainer.appendChild(taskItem)
    }
    limparForm()
})

btnDeletarConcluidas.addEventListener('click', () => removerTarefas(true))
btnDeletarTodas.addEventListener('click', () => removerTarefas(false))



document.addEventListener("TarefaFinalizada", function (e) {
    if (tarefaSelecionada) {
        tarefaSelecionada.concluida = true
        itemTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        itemTarefaSelecionada.querySelector('button').setAttribute('disabled', true)
    }
});

