let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById('task-input');
  const dateInput = document.getElementById('date-input');
  const prioritySelect = document.getElementById('priority-select');

  if (!input.value.trim() || !dateInput.value) {
   alert("Por favor preencha todos os campos!");
  return;
 }

 const exists = tasks.some(task => task.text === input.value.trim());
  if (exists) {
    alert("Essa tarefa já existe!");
    return;
  }

  const task = {
    id: Date.now(),
    text: input.value,
    dueDate: dateInput.value,
    completed: false,
    priority: parseInt(prioritySelect.value)
  };

  tasks.push(task);
  saveTasks();
  input.value = '';
  dateInput.value = '';
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function editTask(id) {
  const newText = prompt("Editar tarefa:");
  if (newText !== null && newText.trim() !== '') {
    tasks = tasks.map(task =>
      task.id === id ? { ...task, text: newText } : task
    );
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function clearAll() {
  if (confirm("Confirma que gostaria de apagar tudo?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

function renderTasks() {
  const list = document.getElementById('task-list');
  const count = document.getElementById('task-count');
  const filter = document.getElementById('filterStatus').value;
  const sort = document.getElementById('sortOption').value;

  list.innerHTML = '';

  let filtered = [...tasks];

  if (filter === 'completed') {
    filtered = filtered.filter(t => t.completed);
  } else if (filter === 'pending') {
    filtered = filtered.filter(t => !t.completed);
  }

  if (sort === 'date') {
    filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else if (sort === 'priority') {
    filtered.sort((a, b) => a.priority - b.priority);
  }

  for (const task of filtered) {
    const li = document.createElement('li');
    li.className = 'task-item';

    if (task.completed) li.classList.add('completed');

    let priorityLabel = '';
    let priorityColor = '';

    switch (task.priority) {
      case 1:
        priorityLabel = 'Alta';
        priorityColor = 'red';
        break;
      case 2:
        priorityLabel = 'Média';
        priorityColor = 'orange';
        break;
      case 3:
        priorityLabel = 'Baixa';
        priorityColor = 'green';
        break;
      default:
        priorityLabel = '';
    }

    const text = `${task.text} ${task.dueDate ? `- 📅 ${task.dueDate}` : ''}`;

    li.innerHTML = `
      <span>${text}</span>
      <span style="color:${priorityColor}; font-weight:bold; margin-left:10px;">${priorityLabel}</span>
      <div class="actions">
        <button class="check-btn" onclick="toggleTask(${task.id})">${task.completed ? '✅' : '☑️'}</button>
        <button onclick="editTask(${task.id})">✏️</button>
        <button onclick="deleteTask(${task.id})">🗑️</button>
      </div>
    `;

    if (task.dueDate && new Date(task.dueDate) < new Date() && !task.completed) {
      li.style.backgroundColor = '#ffe0e0';
    }

    list.appendChild(li);
  }

  const pendingCount = filtered.length; 
  let tarefaLabel = '';

  if (filter === 'completed') {
  tarefaLabel = pendingCount === 1 ? 'tarefa concluída' : 'tarefas concluídas';
} else if (filter === 'pending') {
  tarefaLabel = pendingCount === 1 ? 'tarefa pendente' : 'tarefas pendentes';
} else {
  tarefaLabel = pendingCount === 1 ? 'tarefa' : 'tarefas';
}

count.textContent = `${pendingCount} ${tarefaLabel}`;

}

renderTasks();

document.getElementById('filterStatus').addEventListener('change', renderTasks);
document.getElementById('sortOption').addEventListener('change', renderTasks);