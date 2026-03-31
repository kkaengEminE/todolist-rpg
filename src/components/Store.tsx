import { Item } from '../types';

interface StoreProps {
  points: number;
  onBuy: (item: Item) => void;
}

const STORE_ITEMS: Item[] = [
  { id: 'sword1', name: '나무 검', type: 'weapon', price: 5, attackBonus: 5, level: 1 },
  { id: 'sword2', name: '철 검', type: 'weapon', price: 15, attackBonus: 12, level: 2 },
  { id: 'sword3', name: '강철 검', type: 'weapon', price: 30, attackBonus: 25, level: 3 },
  { id: 'armor1', name: '가죽 갑옷', type: 'armor', price: 5, defenseBonus: 3, level: 1 },
  { id: 'armor2', name: '철 갑옷', type: 'armor', price: 15, defenseBonus: 8, level: 2 },
  { id: 'armor3', name: '강철 갑옷', type: 'armor', price: 30, defenseBonus: 15, level: 3 },
  { id: 'potion1', name: '작은 포션', type: 'potion', price: 3, hpBonus: 30, level: 1 },
  { id: 'potion2', name: '중간 포션', type: 'potion', price: 8, hpBonus: 80, level: 2 },
  { id: 'potion3', name: '큰 포션', type: 'potion', price: 15, hpBonus: 150, level: 3 },
  { id: 'skill1', name: '빠른 공격', type: 'skill', price: 20, attackBonus: 8, level: 1 },
  { id: 'skill2', name: '연속 공격', type: 'skill', price: 40, attackBonus: 15, level: 2 },
];

export const Store: React.FC<StoreProps> = ({ points, onBuy }) => {
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'weapon': return '⚔️';
      case 'armor': return '🛡️';
      case 'potion': return '🧪';
      case 'skill': return '✨';
      default: return '📦';
    }
  };

  const getItemStats = (item: Item) => {
    const stats = [];
    if (item.attackBonus) stats.push(`공격+${item.attackBonus}`);
    if (item.defenseBonus) stats.push(`방어+${item.defenseBonus}`);
    if (item.hpBonus) stats.push(`HP+${item.hpBonus}`);
    return stats.join(', ');
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#16213e',
      borderRadius: '10px',
      color: '#fff'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h2 style={{ margin: 0 }}>상점</h2>
        <div style={{
          backgroundColor: '#ffd700',
          color: '#1a1a2e',
          padding: '5px 15px',
          borderRadius: '20px',
          fontWeight: 'bold'
        }}>
          💰 {points}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px',
        maxHeight: '500px',
        overflowY: 'auto'
      }}>
        {STORE_ITEMS.map(item => (
          <div
            key={item.id}
            style={{
              padding: '15px',
              backgroundColor: '#1a1a2e',
              borderRadius: '8px',
              border: '2px solid #0f3460',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ fontSize: '24px', textAlign: 'center' }}>
              {getItemIcon(item.type)}
            </div>
            <div style={{
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#4ecdc4'
            }}>
              {item.name}
            </div>
            <div style={{
              fontSize: '12px',
              textAlign: 'center',
              color: '#95e1d3'
            }}>
              {getItemStats(item)}
            </div>
            <button
              onClick={() => onBuy(item)}
              disabled={points < item.price}
              style={{
                padding: '8px',
                backgroundColor: points >= item.price ? '#ffd700' : '#666',
                border: 'none',
                borderRadius: '5px',
                color: '#1a1a2e',
                cursor: points >= item.price ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              {item.price} 포인트
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
