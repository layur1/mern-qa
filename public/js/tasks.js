async function refresh() {
  const res = await fetch('/api/tasks');
  const data = await res.json();
  const ul = document.getElementById('tasks');
  ul.innerHTML = '';
  for (const t of data) {
    const li = document.createElement('li');
    li.textContent = t.name;
    ul.appendChild(li);
  }
}

document.getElementById('addBtn').addEventListener('click', async () => {
  const name = document.getElementById('taskInput').value;
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  if (res.ok) {
    document.getElementById('taskInput').value = '';
    refresh();
  } else {
    alert('Task name cannot be blank');
  }
});

// initial load
refresh();
