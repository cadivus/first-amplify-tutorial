import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const client = generateClient<Schema>();

function TodoApp({ signOut, user }: { signOut: () => void; user: any }) {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (
    <main>
      <style>{`
        .todo-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
        }
        .remove-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          color: #ff4444;
          padding: 4px;
        }
        .remove-btn:hover {
          color: #cc0000;
        }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My todos</h1>
        <div>
          <span>Hello {user?.username}!</span>
          <button onClick={signOut} style={{ marginLeft: '10px' }}>Sign out</button>
        </div>
      </div>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <span>{todo.content}</span>
            <button className="remove-btn" onClick={() => deleteTodo(todo.id)}>🗑️</button>
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <TodoApp signOut={signOut} user={user} />
      )}
    </Authenticator>
  );
}

export default App;
