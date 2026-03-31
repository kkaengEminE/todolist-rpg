import { useEffect, useRef, useState } from 'react';
import { Character, Monster, Bullet } from '../types';

interface HuntingGroundProps {
  character: Character;
  onGainExp: (exp: number) => void;
  onTakeDamage: (damage: number) => void;
  onDeath: () => void;
}

export const HuntingGround: React.FC<HuntingGroundProps> = ({
  character,
  onGainExp,
  onTakeDamage,
  onDeath
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const gameStateRef = useRef({
    playerX: 400,
    playerY: 300,
    monsters: [] as Monster[],
    bullets: [] as Bullet[],
    lastShot: 0,
    wave: 1,
    kills: 0,
  });

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameState = gameStateRef.current;
    let animationId: number;
    let lastTime = Date.now();

    const spawnMonster = () => {
      const side = Math.floor(Math.random() * 4);
      let x = 0, y = 0;

      switch (side) {
        case 0: x = Math.random() * canvas.width; y = -20; break;
        case 1: x = canvas.width + 20; y = Math.random() * canvas.height; break;
        case 2: x = Math.random() * canvas.width; y = canvas.height + 20; break;
        case 3: x = -20; y = Math.random() * canvas.height; break;
      }

      const baseHp = 30 + gameState.wave * 10;
      const monster: Monster = {
        id: Date.now().toString() + Math.random(),
        x, y,
        hp: baseHp,
        maxHp: baseHp,
        attack: 5 + gameState.wave * 2,
        speed: 1 + gameState.wave * 0.2,
        exp: 20 + gameState.wave * 5,
      };

      gameState.monsters.push(monster);
    };

    const shoot = () => {
      const now = Date.now();
      if (now - gameState.lastShot < 300) return;

      gameState.lastShot = now;

      // Find nearest monster
      let nearest: Monster | null = null;
      let minDist = Infinity;

      for (const monster of gameState.monsters) {
        const dx = monster.x - gameState.playerX;
        const dy = monster.y - gameState.playerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
          minDist = dist;
          nearest = monster;
        }
      }

      if (nearest) {
        const dx = nearest.x - gameState.playerX;
        const dy = nearest.y - gameState.playerY;
        const len = Math.sqrt(dx * dx + dy * dy);

        const bullet: Bullet = {
          id: Date.now().toString() + Math.random(),
          x: gameState.playerX,
          y: gameState.playerY,
          direction: { x: dx / len, y: dy / len },
          speed: 8,
        };

        gameState.bullets.push(bullet);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        shoot();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const gameLoop = () => {
      const now = Date.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Spawn monsters
      if (gameState.monsters.length < 5 + gameState.wave) {
        if (Math.random() < 0.02) {
          spawnMonster();
        }
      }

      // Update bullets
      for (let i = gameState.bullets.length - 1; i >= 0; i--) {
        const bullet = gameState.bullets[i];
        bullet.x += bullet.direction.x * bullet.speed;
        bullet.y += bullet.direction.y * bullet.speed;

        // Remove if out of bounds
        if (bullet.x < 0 || bullet.x > canvas.width ||
            bullet.y < 0 || bullet.y > canvas.height) {
          gameState.bullets.splice(i, 1);
          continue;
        }

        // Check collision with monsters
        for (let j = gameState.monsters.length - 1; j >= 0; j--) {
          const monster = gameState.monsters[j];
          const dx = bullet.x - monster.x;
          const dy = bullet.y - monster.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 20) {
            monster.hp -= character.attack;
            gameState.bullets.splice(i, 1);

            if (monster.hp <= 0) {
              onGainExp(monster.exp);
              gameState.monsters.splice(j, 1);
              gameState.kills++;

              if (gameState.kills % 10 === 0) {
                gameState.wave++;
              }
            }
            break;
          }
        }
      }

      // Update monsters
      for (let i = gameState.monsters.length - 1; i >= 0; i--) {
        const monster = gameState.monsters[i];
        const dx = gameState.playerX - monster.x;
        const dy = gameState.playerY - monster.y;
        const len = Math.sqrt(dx * dx + dy * dy);

        if (len > 0) {
          monster.x += (dx / len) * monster.speed;
          monster.y += (dy / len) * monster.speed;
        }

        // Check collision with player
        if (len < 25) {
          onTakeDamage(monster.attack);
          gameState.monsters.splice(i, 1);

          if (character.hp - monster.attack <= 0) {
            setIsPlaying(false);
            onDeath();
            return;
          }
        }
      }

      // Draw
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw player
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(gameState.playerX - 8, gameState.playerY - 8, 16, 16);
      ctx.fillStyle = '#ff6b6b';
      ctx.fillRect(gameState.playerX - 6, gameState.playerY - 4, 12, 8);

      // Draw bullets
      ctx.fillStyle = '#4ecdc4';
      for (const bullet of gameState.bullets) {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw monsters
      for (const monster of gameState.monsters) {
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(monster.x - 10, monster.y - 10, 20, 20);
        ctx.fillStyle = '#cc0000';
        ctx.fillRect(monster.x - 8, monster.y - 6, 16, 12);

        // HP bar
        const hpRatio = monster.hp / monster.maxHp;
        ctx.fillStyle = '#333';
        ctx.fillRect(monster.x - 15, monster.y - 20, 30, 4);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(monster.x - 15, monster.y - 20, 30 * hpRatio, 4);
      }

      // Draw UI
      ctx.fillStyle = '#fff';
      ctx.font = '16px monospace';
      ctx.fillText(`Wave: ${gameState.wave}`, 10, 25);
      ctx.fillText(`Kills: ${gameState.kills}`, 10, 50);
      ctx.fillText(`[SPACE] 공격`, canvas.width - 120, 25);

      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, character, onGainExp, onTakeDamage, onDeath]);

  const startGame = () => {
    gameStateRef.current = {
      playerX: 400,
      playerY: 300,
      monsters: [],
      bullets: [],
      lastShot: 0,
      wave: 1,
      kills: 0,
    };
    setIsPlaying(true);
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#16213e',
      borderRadius: '10px',
      color: '#fff'
    }}>
      <h2 style={{ margin: '0 0 15px 0' }}>사냥터</h2>

      {!isPlaying ? (
        <div style={{
          width: '800px',
          height: '600px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0a0a0a',
          borderRadius: '5px',
          border: '2px solid #4ecdc4',
        }}>
          <h3 style={{ color: '#4ecdc4', marginBottom: '20px' }}>사냥을 시작하시겠습니까?</h3>
          <button
            onClick={startGame}
            style={{
              padding: '15px 40px',
              fontSize: '18px',
              backgroundColor: '#4ecdc4',
              border: 'none',
              borderRadius: '8px',
              color: '#1a1a2e',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            사냥 시작
          </button>
          <div style={{ marginTop: '20px', color: '#95e1d3', textAlign: 'center' }}>
            <p>스페이스바로 공격하세요!</p>
            <p>몬스터를 처치하면 경험치를 얻습니다</p>
          </div>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{
            border: '2px solid #4ecdc4',
            borderRadius: '5px',
            imageRendering: 'pixelated',
            display: 'block'
          }}
        />
      )}
    </div>
  );
};
