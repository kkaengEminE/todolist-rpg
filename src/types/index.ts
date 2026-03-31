export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
}

export interface Character {
  level: number;
  exp: number;
  maxExp: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  x: number;
  y: number;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'potion' | 'skill';
  price: number;
  attackBonus?: number;
  defenseBonus?: number;
  hpBonus?: number;
  level: number;
}

export interface Monster {
  id: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  attack: number;
  speed: number;
  exp: number;
}

export interface Bullet {
  id: string;
  x: number;
  y: number;
  direction: { x: number; y: number };
  speed: number;
}

export interface GameState {
  character: Character;
  points: number;
  inventory: Item[];
  todos: Todo[];
}
