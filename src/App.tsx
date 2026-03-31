import { useState } from 'react';
import { Character } from './components/Character';
import { TodoList } from './components/TodoList';
import { Store } from './components/Store';
import { HuntingGround } from './components/HuntingGround';
import { useGameState } from './hooks/useGameState';
import './App.css';

type View = 'main' | 'store' | 'hunting';

function App() {
  const {
    gameState,
    addTodo,
    completeTodo,
    deleteTodo,
    buyItem,
    gainExp,
    takeDamage,
    resetHp,
  } = useGameState();

  const [currentView, setCurrentView] = useState<View>('main');

  const handleDeath = () => {
    resetHp();
    setCurrentView('main');
  };

  return (
    <div className="app">
      <div className="layout">
        {/* Left side */}
        <div className="left-panel">
          {/* Top left - Character */}
          <div className="section">
            <Character character={gameState.character} />
            {currentView === 'main' && (
              <TodoList
                todos={gameState.todos}
                points={gameState.points}
                onAdd={addTodo}
                onComplete={completeTodo}
                onDelete={deleteTodo}
              />
            )}
          </div>

          {/* Bottom left - Store */}
          <div className="section">
            <button
              onClick={() => setCurrentView(currentView === 'store' ? 'main' : 'store')}
              className="nav-button"
              style={{
                backgroundColor: currentView === 'store' ? '#ffd700' : '#4ecdc4'
              }}
            >
              {currentView === 'store' ? '← 메인으로' : '🏪 상점 가기'}
            </button>
            {currentView === 'store' && (
              <div style={{ marginTop: '20px' }}>
                <Store points={gameState.points} onBuy={buyItem} />
              </div>
            )}
          </div>
        </div>

        {/* Right side - Hunting Ground */}
        <div className="right-panel">
          <button
            onClick={() => setCurrentView(currentView === 'hunting' ? 'main' : 'hunting')}
            className="nav-button"
            style={{
              backgroundColor: currentView === 'hunting' ? '#ff6b6b' : '#4ecdc4',
              marginBottom: '20px'
            }}
          >
            {currentView === 'hunting' ? '← 메인으로' : '⚔️ 사냥터 가기'}
          </button>

          {currentView === 'hunting' && (
            <HuntingGround
              character={gameState.character}
              onGainExp={gainExp}
              onTakeDamage={takeDamage}
              onDeath={handleDeath}
            />
          )}

          {currentView === 'main' && (
            <div style={{
              padding: '40px',
              backgroundColor: '#16213e',
              borderRadius: '10px',
              color: '#fff',
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <h1 style={{ color: '#4ecdc4', marginBottom: '20px' }}>
                Todo RPG
              </h1>
              <p style={{ color: '#95e1d3', fontSize: '18px', lineHeight: '1.6' }}>
                할 일을 완료하면 경험치를 얻고,<br />
                하루 안에 완료하면 포인트도 획득!<br />
                <br />
                포인트로 상점에서 아이템을 구매하고,<br />
                사냥터에서 몬스터와 싸워보세요!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
