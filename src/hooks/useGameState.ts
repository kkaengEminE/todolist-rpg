import { useState, useEffect } from 'react';
import { GameState, Todo, Item } from '../types';
import { saveGame, loadGame, getInitialState } from '../utils/storage';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    return loadGame() || getInitialState();
  });

  useEffect(() => {
    saveGame(gameState);
  }, [gameState]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setGameState(prev => ({
      ...prev,
      todos: [...prev.todos, newTodo],
    }));
  };

  const completeTodo = (id: string) => {
    const todo = gameState.todos.find(t => t.id === id);
    if (!todo || todo.completed) return;

    const completedAt = Date.now();
    const isOnTime = (completedAt - todo.createdAt) < 24 * 60 * 60 * 1000;

    setGameState(prev => {
      const newExp = prev.character.exp + 50;
      const leveledUp = newExp >= prev.character.maxExp;

      return {
        ...prev,
        character: leveledUp ? {
          ...prev.character,
          level: prev.character.level + 1,
          exp: newExp - prev.character.maxExp,
          maxExp: Math.floor(prev.character.maxExp * 1.5),
          maxHp: prev.character.maxHp + 20,
          hp: prev.character.maxHp + 20,
          attack: prev.character.attack + 2,
          defense: prev.character.defense + 1,
        } : {
          ...prev.character,
          exp: newExp,
        },
        points: isOnTime ? prev.points + 1 : prev.points,
        todos: prev.todos.map(t =>
          t.id === id ? { ...t, completed: true, completedAt } : t
        ),
      };
    });
  };

  const deleteTodo = (id: string) => {
    setGameState(prev => ({
      ...prev,
      todos: prev.todos.filter(t => t.id !== id),
    }));
  };

  const buyItem = (item: Item) => {
    if (gameState.points < item.price) return false;

    setGameState(prev => ({
      ...prev,
      points: prev.points - item.price,
      inventory: [...prev.inventory, item],
      character: {
        ...prev.character,
        attack: prev.character.attack + (item.attackBonus || 0),
        defense: prev.character.defense + (item.defenseBonus || 0),
        maxHp: prev.character.maxHp + (item.hpBonus || 0),
        hp: prev.character.hp + (item.hpBonus || 0),
      },
    }));
    return true;
  };

  const gainExp = (exp: number) => {
    setGameState(prev => {
      const newExp = prev.character.exp + exp;
      const leveledUp = newExp >= prev.character.maxExp;

      return {
        ...prev,
        character: leveledUp ? {
          ...prev.character,
          level: prev.character.level + 1,
          exp: newExp - prev.character.maxExp,
          maxExp: Math.floor(prev.character.maxExp * 1.5),
          maxHp: prev.character.maxHp + 20,
          hp: prev.character.maxHp + 20,
          attack: prev.character.attack + 2,
          defense: prev.character.defense + 1,
        } : {
          ...prev.character,
          exp: newExp,
        },
      };
    });
  };

  const takeDamage = (damage: number) => {
    setGameState(prev => ({
      ...prev,
      character: {
        ...prev.character,
        hp: Math.max(0, prev.character.hp - damage),
      },
    }));
  };

  const resetHp = () => {
    setGameState(prev => ({
      ...prev,
      character: {
        ...prev.character,
        hp: prev.character.maxHp,
      },
    }));
  };

  return {
    gameState,
    addTodo,
    completeTodo,
    deleteTodo,
    buyItem,
    gainExp,
    takeDamage,
    resetHp,
  };
};
