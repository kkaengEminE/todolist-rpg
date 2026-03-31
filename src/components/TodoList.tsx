import { useState } from 'react';
import { Todo } from '../types';

interface TodoListProps {
  todos: Todo[];
  points: number;
  onAdd: (text: string) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  points,
  onAdd,
  onComplete,
  onDelete
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAdd(input.trim());
      setInput('');
    }
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#16213e',
      borderRadius: '10px',
      color: '#fff',
      marginTop: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h2 style={{ margin: 0 }}>할 일 목록</h2>
        <div style={{
          backgroundColor: '#ffd700',
          color: '#1a1a2e',
          padding: '5px 15px',
          borderRadius: '20px',
          fontWeight: 'bold'
        }}>
          💰 {points} 포인트
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '15px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="새로운 할 일을 입력하세요..."
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#0f3460',
            border: '2px solid #4ecdc4',
            borderRadius: '5px',
            color: '#fff',
            fontSize: '14px'
          }}
        />
      </form>

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {todos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#95e1d3' }}>
            할 일을 추가해보세요!
          </div>
        ) : (
          todos.map(todo => (
            <div
              key={todo.id}
              style={{
                padding: '10px',
                marginBottom: '8px',
                backgroundColor: todo.completed ? '#0f3460' : '#1a1a2e',
                borderRadius: '5px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                opacity: todo.completed ? 0.6 : 1
              }}
            >
              <div style={{
                flex: 1,
                textDecoration: todo.completed ? 'line-through' : 'none'
              }}>
                {todo.text}
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                {!todo.completed && (
                  <button
                    onClick={() => onComplete(todo.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#4ecdc4',
                      border: 'none',
                      borderRadius: '3px',
                      color: '#1a1a2e',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    ✓
                  </button>
                )}
                <button
                  onClick={() => onDelete(todo.id)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#ff6b6b',
                    border: 'none',
                    borderRadius: '3px',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
