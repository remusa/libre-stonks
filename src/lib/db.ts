import Database from '@tauri-apps/plugin-sql'

export const db = await Database.load('sqlite:data.db')

export async function selectUsers() {
	const data = await db.select('SELECT * FROM users')
	return data
}

async function insert(todos = []) {
	const result = await db.execute('INSERT into todos (id, title, status) VALUES ($1, $2, $3)', [
		todos.id,
		todos.title,
		todos.status,
	])
}

async function updateTodos(todos = []) {
	const result = await db.execute('UPDATE todos SET title = $1, completed = $2 WHERE id = $3', [
		todos.title,
		todos.status,
		todos.id,
	])
}
