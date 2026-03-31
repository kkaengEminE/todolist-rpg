import { GameState } from '../types';

const STORAGE_KEY = 'todo-rpg-save';

export const saveGame = (state: GameState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game:', error);
  }
};

export const loadGame = (): GameState | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
};

export const getInitialState = (): GameState => {
  return {
    character: {
      level: 1,
      exp: 0,
      maxExp: 100,
      hp: 100,
      maxHp: 100,
      attack: 10,
      defense: 5,
      x: 400,
      y: 300,
    },
    points: 0,
    inventory: [],
    todos: [],
  };
};
