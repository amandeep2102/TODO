async function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    
    if (text === '') {
        alert('Please enter a task!');
        return;
    }
    
    try {
        const response = await fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        });
        
        const todo = await response.json();
        const todoList = document.getElementById('todoList');
        const todoItem = createTodoElement(todo);
        todoList.insertBefore(todoItem, todoList.firstChild);
        input.value = '';

        updateTaskCount();

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add task');
    }
}


function createTodoElement(todo) {
    const div = document.createElement('div');
    div.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    div.dataset.id = todo.id;
    div.dataset.completed = todo.completed;
    
    div.innerHTML = `
        <div class="todo-content">
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo(${todo.id})"
            >
            <span class="todo-text" ondblclick="editTodo(${todo.id}, this)">${todo.text}</span>
            <input type="text" class="edit-input" style="display: none;">
        </div>
        <div class="todo-actions">
            <button class="edit-btn" onclick="startEdit(${todo.id}, this)" title="Edit">
                ✏️
            </button>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})" title="Delete">
                🗑️
            </button>
        </div>
    `;
    
    return div;
}

async function toggleTodo(id) {
    try {
        await fetch(`/toggle/${id}`, {
            method: 'POST'
        });
        
        const todoItem = document.querySelector(`[data-id="${id}"]`);
        todoItem.classList.toggle('completed');
        
        const completed = todoItem.classList.contains('completed');
        todoItem.dataset.completed = completed;
        
        updateTaskCount();
        applyCurrentFilter();
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deleteTodo(id) {
    try {
        await fetch(`/delete/${id}`, {
            method: 'DELETE'
        });
        
        const todoItem = document.querySelector(`[data-id="${id}"]`);
        todoItem.style.animation = 'fadeOut 0.3s ease';
        
        setTimeout(() => {
            todoItem.remove();
            updateTaskCount();
        }, 300);
    } catch (error) {
        console.error('Error:', error);
    }
}

function startEdit(id, btn) {
    const todoItem = btn.closest('.todo-item');
    const textSpan = todoItem.querySelector('.todo-text');
    const editInput = todoItem.querySelector('.edit-input');
    
    editInput.value = textSpan.textContent;
    textSpan.style.display = 'none';
    editInput.style.display = 'block';
    editInput.focus();
    
    editInput.onblur = () => saveEdit(id, editInput, textSpan);
    editInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
            saveEdit(id, editInput, textSpan);
        }
    };
}

async function saveEdit(id, input, textSpan) {
    const newText = input.value.trim();
    
    if (newText === '') {
        alert('Task cannot be empty!');
        input.focus();
        return;
    }
    
    try {
        await fetch(`/edit/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: newText })
        });
        
        textSpan.textContent = newText;
        input.style.display = 'none';
        textSpan.style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
    }
}

function editTodo(id, span) {
    const todoItem = span.closest('.todo-item');
    const editInput = todoItem.querySelector('.edit-input');
    
    editInput.value = span.textContent;
    span.style.display = 'none';
    editInput.style.display = 'block';
    editInput.focus();
    
    editInput.onblur = () => saveEdit(id, editInput, span);
    editInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
            saveEdit(id, editInput, span);
        }
    };
}

function updateTaskCount() {
    const todos = document.querySelectorAll('.todo-item:not(.hidden)');
    const activeTodos = Array.from(todos).filter(todo => todo.dataset.completed === 'false');
    document.getElementById('taskCount').textContent = `${activeTodos.length} task(s) remaining`;
}

let currentFilter = 'all';

function applyCurrentFilter() {
    const todos = document.querySelectorAll('.todo-item');
    
    todos.forEach(todo => {
        const isCompleted = todo.dataset.completed === 'true';
        
        if (currentFilter === 'all') {
            todo.classList.remove('hidden');
        } else if (currentFilter === 'active') {
            todo.classList.toggle('hidden', isCompleted);
        } else if (currentFilter === 'completed') {
            todo.classList.toggle('hidden', !isCompleted);
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('todoInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            applyCurrentFilter();
        });
    });
    
    updateTaskCount();
});


const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateX(20px);
        }
    }
`;
document.head.appendChild(style);