import { useEffect, useRef } from 'react';
import { Character as CharacterType } from '../types';

interface CharacterProps {
  character: CharacterType;
}

export const Character: React.FC<CharacterProps> = ({ character }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pixel art character (simple 8x8 sprite)
    const scale = 4;
    const cx = canvas.width / 2 - (8 * scale) / 2;
    const cy = 80;

    // Character sprite (픽셀아트)
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(cx + 3 * scale, cy, scale, scale); // head top
    ctx.fillRect(cx + 2 * scale, cy + scale, scale * 4, scale); // head
    ctx.fillRect(cx + 3 * scale, cy + 2 * scale, scale * 2, scale); // eyes
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(cx + 2 * scale, cy + 3 * scale, scale * 4, scale * 2); // body
    ctx.fillStyle = '#4ecdc4';
    ctx.fillRect(cx + scale, cy + 5 * scale, scale * 2, scale * 2); // left arm
    ctx.fillRect(cx + 5 * scale, cy + 5 * scale, scale * 2, scale * 2); // right arm
    ctx.fillStyle = '#95e1d3';
    ctx.fillRect(cx + 2 * scale, cy + 5 * scale, scale, scale * 3); // left leg
    ctx.fillRect(cx + 5 * scale, cy + 5 * scale, scale, scale * 3); // right leg

  }, []);

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#16213e',
      borderRadius: '10px',
      color: '#fff'
    }}>
      <h2 style={{ margin: '0 0 10px 0' }}>캐릭터</h2>
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        style={{
          border: '2px solid #4ecdc4',
          borderRadius: '5px',
          imageRendering: 'pixelated'
        }}
      />
      <div style={{ marginTop: '15px' }}>
        <div>레벨: {character.level}</div>
        <div>
          EXP: {character.exp} / {character.maxExp}
          <div style={{
            width: '100%',
            height: '10px',
            backgroundColor: '#0f3460',
            borderRadius: '5px',
            marginTop: '5px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(character.exp / character.maxExp) * 100}%`,
              height: '100%',
              backgroundColor: '#4ecdc4',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>
        <div style={{ marginTop: '10px' }}>
          HP: {character.hp} / {character.maxHp}
          <div style={{
            width: '100%',
            height: '10px',
            backgroundColor: '#0f3460',
            borderRadius: '5px',
            marginTop: '5px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(character.hp / character.maxHp) * 100}%`,
              height: '100%',
              backgroundColor: '#ff6b6b',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>
        <div style={{ marginTop: '10px' }}>공격력: {character.attack}</div>
        <div>방어력: {character.defense}</div>
      </div>
    </div>
  );
};
