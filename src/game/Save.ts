// ============================================
// СИСТЕМА СОХРАНЕНИЯ: localStorage
// ============================================

import { Component, Peripheral, Order } from './Data';

export interface SaveData {
  money: number;
  reputation: number;
  inventory: string[]; // ID купленных комплектующих
  peripheralInventory: string[]; // ID периферии
  installedComponents: Record<string, string>; // слот -> ID
  currentOrder: Order | null;
  completedOrders: number;
  totalEarnings: number;
  lightOn: boolean;
  pcAssembled: boolean;
  pcRunning: boolean;
  osInstalled: string | null;
  installedApps: string[];
  overclocking: boolean;
  xmpEnabled: boolean;
  gameTime: number;
}

const SAVE_KEY = 'pc_builder_save';

export const DEFAULT_SAVE: SaveData = {
  money: 5000,
  reputation: 0,
  inventory: [],
  peripheralInventory: [],
  installedComponents: {},
  currentOrder: null,
  completedOrders: 0,
  totalEarnings: 0,
  lightOn: true,
  pcAssembled: false,
  pcRunning: false,
  osInstalled: null,
  installedApps: [],
  overclocking: false,
  xmpEnabled: false,
  gameTime: 0,
};

export function saveGame(data: SaveData): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Ошибка сохранения:', e);
  }
}

export function loadGame(): SaveData {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      return { ...DEFAULT_SAVE, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Ошибка загрузки:', e);
  }
  return { ...DEFAULT_SAVE };
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

export function hasSave(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}
