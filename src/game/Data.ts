// ============================================
// ДАННЫЕ ИГРЫ: комплектующие, периферия, заказы
// ============================================

// Типы комплектующих
export enum ComponentType {
  CPU = 'cpu',
  GPU = 'gpu',
  RAM = 'ram',
  PSU = 'psu',
  STORAGE = 'storage',
  CASE = 'case',
  COOLER = 'cooler',
  MOTHERBOARD = 'motherboard',
  SOUND_CARD = 'sound_card',
  NETWORK_CARD = 'network_card',
  CD_ROM = 'cd_rom',
  THERMAL_PASTE = 'thermal_paste',
}

// Типы периферии
export enum PeripheralType {
  MOUSE = 'mouse',
  KEYBOARD = 'keyboard',
  MONITOR = 'monitor',
  HEADPHONES = 'headphones',
  MOUSEPAD = 'mousepad',
  MICROPHONE = 'microphone',
  SPEAKERS = 'speakers',
}

// Тип заказа
export enum OrderType {
  GAMING = 'gaming',
  WORK = 'work',
  STREAMING = 'streaming',
  EDITING = 'editing',
  OFFICE = 'office',
  SERVER_DB = 'server_db',
  SERVER_WEB = 'server_web',
  SERVER_RENDER = 'server_render',
  SERVER_CLOUD = 'server_cloud',
}

// Интерфейс комплектующей
export interface Component {
  id: string;
  name: string;
  type: ComponentType;
  price: number;
  performance: number; // 1-100
  power: number; // Ватт
  isRetro: boolean;
  color: number; // цвет для 3D модели
  size: [number, number, number]; // размеры для 3D
  description: string;
  socket?: string; // для CPU
  memoryType?: string; // для RAM
  formFactor?: string; // для PSU, motherboard
}

// Интерфейс периферии
export interface Peripheral {
  id: string;
  name: string;
  type: PeripheralType;
  price: number;
  quality: number; // 1-100
  isRetro: boolean;
  color: number;
  size: [number, number, number];
  description: string;
}

// Интерфейс заказа
export interface Order {
  id: string;
  type: OrderType;
  title: string;
  description: string;
  budget: number;
  deadline: number; // в минутах игрового времени
  requirements: {
    minPerformance: number;
    neededComponents: ComponentType[];
    overclocking: boolean;
    apps: string[];
    os?: string;
  };
  bonus: number; // процент бонуса за качество
  penalty: number; // процент штрафа за просрочку
  isServer: boolean;
  reputationReward: number;
}

// ============================================
// ПРОЦЕССОРЫ (12 штук)
// ============================================
export const CPUs: Component[] = [
  {
    id: 'cpu_i9_14900k', name: 'Intel Core i9-14900K', type: ComponentType.CPU,
    price: 589, performance: 98, power: 253, isRetro: false, color: 0x0071c5,
    size: [0.04, 0.005, 0.04], description: 'Топовый процессор Intel 14 поколения', socket: 'LGA1700'
  },
  {
    id: 'cpu_i7_14700k', name: 'Intel Core i7-14700K', type: ComponentType.CPU,
    price: 409, performance: 88, power: 253, isRetro: false, color: 0x0071c5,
    size: [0.04, 0.005, 0.04], description: 'Мощный процессор для игр и работы', socket: 'LGA1700'
  },
  {
    id: 'cpu_i5_14600k', name: 'Intel Core i5-14600K', type: ComponentType.CPU,
    price: 319, performance: 78, power: 181, isRetro: false, color: 0x0071c5,
    size: [0.04, 0.005, 0.04], description: 'Отличный баланс цены и производительности', socket: 'LGA1700'
  },
  {
    id: 'cpu_i3_14100f', name: 'Intel Core i3-14100F', type: ComponentType.CPU,
    price: 139, performance: 52, power: 110, isRetro: false, color: 0x0071c5,
    size: [0.04, 0.005, 0.04], description: 'Бюджетный процессор для офиса', socket: 'LGA1700'
  },
  {
    id: 'cpu_i9_13900k', name: 'Intel Core i9-13900K', type: ComponentType.CPU,
    price: 499, performance: 95, power: 253, isRetro: false, color: 0x0071c5,
    size: [0.04, 0.005, 0.04], description: 'Прошлогодний флагман Intel', socket: 'LGA1700'
  },
  {
    id: 'cpu_i7_13700k', name: 'Intel Core i7-13700K', type: ComponentType.CPU,
    price: 349, performance: 85, power: 253, isRetro: false, color: 0x0071c5,
    size: [0.04, 0.005, 0.04], description: 'Мощный процессор 13 поколения', socket: 'LGA1700'
  },
  {
    id: 'cpu_r9_7950x', name: 'AMD Ryzen 9 7950X', type: ComponentType.CPU,
    price: 549, performance: 96, power: 170, isRetro: false, color: 0xed1c24,
    size: [0.04, 0.005, 0.04], description: 'Топовый AMD для многопоточных задач', socket: 'AM5'
  },
  {
    id: 'cpu_r7_7800x3d', name: 'AMD Ryzen 7 7800X3D', type: ComponentType.CPU,
    price: 449, performance: 92, power: 120, isRetro: false, color: 0xed1c24,
    size: [0.04, 0.005, 0.04], description: 'Лучший игровой процессор AMD', socket: 'AM5'
  },
  {
    id: 'cpu_r5_7600x', name: 'AMD Ryzen 5 7600X', type: ComponentType.CPU,
    price: 249, performance: 72, power: 105, isRetro: false, color: 0xed1c24,
    size: [0.04, 0.005, 0.04], description: 'Отличный игровой процессор', socket: 'AM5'
  },
  {
    id: 'cpu_r9_5950x', name: 'AMD Ryzen 9 5950X', type: ComponentType.CPU,
    price: 399, performance: 82, power: 105, isRetro: false, color: 0xed1c24,
    size: [0.04, 0.005, 0.04], description: 'Мощный процессор предыдущего поколения', socket: 'AM4'
  },
  {
    id: 'cpu_pentium_p54ks', name: 'Intel Pentium P54KS', type: ComponentType.CPU,
    price: 5, performance: 2, power: 15, isRetro: true, color: 0x888888,
    size: [0.05, 0.008, 0.05], description: 'Ретро процессор 1996 года', socket: 'Socket 5/7'
  },
  {
    id: 'cpu_amd_k5', name: 'AMD K5', type: ComponentType.CPU,
    price: 3, performance: 1, power: 12, isRetro: true, color: 0x666666,
    size: [0.05, 0.008, 0.05], description: 'Первый процессор AMD для ПК', socket: 'Socket 5/7'
  },
];

// ============================================
// ВИДЕОКАРТЫ (12 штук)
// ============================================
export const GPUs: Component[] = [
  {
    id: 'gpu_rtx4090', name: 'NVIDIA RTX 4090', type: ComponentType.GPU,
    price: 1599, performance: 100, power: 450, isRetro: false, color: 0x76b900,
    size: [0.3, 0.06, 0.14], description: 'Самая мощная видеокарта в мире'
  },
  {
    id: 'gpu_rtx4080', name: 'NVIDIA RTX 4080', type: ComponentType.GPU,
    price: 1199, performance: 88, power: 320, isRetro: false, color: 0x76b900,
    size: [0.28, 0.06, 0.13], description: 'Мощная видеокарта для 4K гейминга'
  },
  {
    id: 'gpu_rtx4070ti', name: 'NVIDIA RTX 4070 Ti', type: ComponentType.GPU,
    price: 799, performance: 78, power: 285, isRetro: false, color: 0x76b900,
    size: [0.26, 0.05, 0.12], description: 'Отличная карта для 1440p'
  },
  {
    id: 'gpu_rtx4060', name: 'NVIDIA RTX 4060', type: ComponentType.GPU,
    price: 299, performance: 55, power: 115, isRetro: false, color: 0x76b900,
    size: [0.22, 0.04, 0.11], description: 'Бюджетная карта нового поколения'
  },
  {
    id: 'gpu_rx7900xtx', name: 'AMD RX 7900 XTX', type: ComponentType.GPU,
    price: 999, performance: 90, power: 355, isRetro: false, color: 0xed1c24,
    size: [0.28, 0.06, 0.13], description: 'Флагман AMD для 4K'
  },
  {
    id: 'gpu_rx7800xt', name: 'AMD RX 7800 XT', type: ComponentType.GPU,
    price: 499, performance: 72, power: 263, isRetro: false, color: 0xed1c24,
    size: [0.26, 0.05, 0.12], description: 'Отличная карта для 1440p'
  },
  {
    id: 'gpu_rx7600', name: 'AMD RX 7600', type: ComponentType.GPU,
    price: 269, performance: 50, power: 165, isRetro: false, color: 0xed1c24,
    size: [0.22, 0.04, 0.11], description: 'Бюджетная карта AMD'
  },
  {
    id: 'gpu_arc_a770', name: 'Intel Arc A770', type: ComponentType.GPU,
    price: 349, performance: 48, power: 225, isRetro: false, color: 0x0071c5,
    size: [0.26, 0.05, 0.12], description: 'Первая мощная карта Intel'
  },
  {
    id: 'gpu_arc_a750', name: 'Intel Arc A750', type: ComponentType.GPU,
    price: 249, performance: 42, power: 225, isRetro: false, color: 0x0071c5,
    size: [0.24, 0.04, 0.11], description: 'Средняя карта Intel'
  },
  {
    id: 'gpu_rtx3090', name: 'NVIDIA RTX 3090', type: ComponentType.GPU,
    price: 899, performance: 75, power: 350, isRetro: false, color: 0x76b900,
    size: [0.28, 0.06, 0.13], description: 'Прошлогодний флагман NVIDIA'
  },
  {
    id: 'gpu_nv1', name: 'Nvidia NV-1', type: ComponentType.GPU,
    price: 2, performance: 1, power: 5, isRetro: true, color: 0x444444,
    size: [0.12, 0.02, 0.08], description: 'Первая видеокарта Nvidia 1995'
  },
  {
    id: 'gpu_3drage', name: 'ATI 3D Rage', type: ComponentType.GPU,
    price: 3, performance: 1, power: 6, isRetro: true, color: 0x333333,
    size: [0.12, 0.02, 0.08], description: 'Первая 3D карта ATI 1996'
  },
];

// ============================================
// ОПЕРАТИВНАЯ ПАМЯТЬ (12 штук)
// ============================================
export const RAMs: Component[] = [
  {
    id: 'ram_dominator_ddr5', name: 'Corsair Dominator DDR5-6000 32GB', type: ComponentType.RAM,
    price: 289, performance: 95, power: 10, isRetro: false, color: 0x1a1a1a,
    size: [0.13, 0.04, 0.008], description: 'Топовая DDR5 память', memoryType: 'DDR5'
  },
  {
    id: 'ram_trident_ddr5', name: 'G.Skill Trident Z5 DDR5-6400 32GB', type: ComponentType.RAM,
    price: 319, performance: 98, power: 10, isRetro: false, color: 0x2a2a2a,
    size: [0.13, 0.045, 0.008], description: 'Самая быстрая DDR5', memoryType: 'DDR5'
  },
  {
    id: 'ram_fury_ddr5', name: 'Kingston Fury DDR5-5600 16GB', type: ComponentType.RAM,
    price: 129, performance: 75, power: 8, isRetro: false, color: 0x1a1a1a,
    size: [0.13, 0.035, 0.008], description: 'Надёжная DDR5 память', memoryType: 'DDR5'
  },
  {
    id: 'ram_crucial_ddr4', name: 'Crucial Pro DDR4-3200 16GB', type: ComponentType.RAM,
    price: 59, performance: 55, power: 6, isRetro: false, color: 0x006600,
    size: [0.13, 0.03, 0.008], description: 'Хорошая DDR4 память', memoryType: 'DDR4'
  },
  {
    id: 'ram_samsung_ddr4', name: 'Samsung DDR4-2666 8GB', type: ComponentType.RAM,
    price: 35, performance: 38, power: 5, isRetro: false, color: 0x003366,
    size: [0.13, 0.03, 0.008], description: 'Базовая DDR4 память', memoryType: 'DDR4'
  },
  {
    id: 'ram_hyperx_ddr4', name: 'HyperX Fury DDR4-3600 16GB', type: ComponentType.RAM,
    price: 79, performance: 62, power: 6, isRetro: false, color: 0x1a1a1a,
    size: [0.13, 0.035, 0.008], description: 'Игровая DDR4 память', memoryType: 'DDR4'
  },
  {
    id: 'ram_viper_ddr4', name: 'Patriot Viper DDR4-3000 8GB', type: ComponentType.RAM,
    price: 42, performance: 45, power: 5, isRetro: false, color: 0x330066,
    size: [0.13, 0.03, 0.008], description: 'Бюджетная игровая память', memoryType: 'DDR4'
  },
  {
    id: 'ram_xpg_ddr5', name: 'ADATA XPG DDR5-5200 16GB', type: ComponentType.RAM,
    price: 99, performance: 68, power: 8, isRetro: false, color: 0x1a1a1a,
    size: [0.13, 0.035, 0.008], description: 'Доступная DDR5 память', memoryType: 'DDR5'
  },
  {
    id: 'ram_tforce_ddr5', name: 'TeamGroup T-Force DDR5-6000 32GB', type: ComponentType.RAM,
    price: 249, performance: 90, power: 10, isRetro: false, color: 0x003366,
    size: [0.13, 0.04, 0.008], description: 'Быстрая DDR5 для геймеров', memoryType: 'DDR5'
  },
  {
    id: 'ram_sp_ddr4', name: 'Silicon Power DDR4-3200 8GB', type: ComponentType.RAM,
    price: 39, performance: 42, power: 5, isRetro: false, color: 0x660000,
    size: [0.13, 0.03, 0.008], description: 'Бюджетная DDR4', memoryType: 'DDR4'
  },
  {
    id: 'ram_edo_samsung', name: 'Samsung KM48S2020CT-GH EDO', type: ComponentType.RAM,
    price: 1, performance: 1, power: 3, isRetro: true, color: 0x006600,
    size: [0.1, 0.025, 0.006], description: 'Ретро EDO память 1995', memoryType: 'EDO'
  },
  {
    id: 'ram_edo_micron', name: 'Micron EDO 8MB', type: ComponentType.RAM,
    price: 1, performance: 1, power: 3, isRetro: true, color: 0x333333,
    size: [0.1, 0.025, 0.006], description: 'Ретро EDO память', memoryType: 'EDO'
  },
];

// ============================================
// БЛОКИ ПИТАНИЯ (12 штук)
// ============================================
export const PSUs: Component[] = [
  {
    id: 'psu_rm1000x', name: 'Corsair RM1000x', type: ComponentType.PSU,
    price: 219, performance: 95, power: 1000, isRetro: false, color: 0x1a1a1a,
    size: [0.15, 0.086, 0.16], description: 'Мощный блок питания 1000W', formFactor: 'ATX'
  },
  {
    id: 'psu_focus_gx850', name: 'Seasonic Focus GX-850', type: ComponentType.PSU,
    price: 149, performance: 88, power: 850, isRetro: false, color: 0x1a1a1a,
    size: [0.15, 0.086, 0.16], description: 'Надёжный БП 850W', formFactor: 'ATX'
  },
  {
    id: 'psu_straight11_750', name: 'be quiet! Straight Power 11 750W', type: ComponentType.PSU,
    price: 139, performance: 85, power: 750, isRetro: false, color: 0x1a1a1a,
    size: [0.15, 0.086, 0.16], description: 'Тихий БП 750W', formFactor: 'ATX'
  },
  {
    id: 'psu_supernova_650', name: 'EVGA SuperNOVA 650W', type: ComponentType.PSU,
    price: 99, performance: 72, power: 650, isRetro: false, color: 0x1a1a1a,
    size: [0.15, 0.086, 0.16], description: 'Хороший БП 650W', formFactor: 'ATX'
  },
  {
    id: 'psu_mwe_550', name: 'Cooler Master MWE 550W', type: ComponentType.PSU,
    price: 69, performance: 58, power: 550, isRetro: false, color: 0x1a1a1a,
    size: [0.15, 0.086, 0.16], description: 'Бюджетный БП 550W', formFactor: 'ATX'
  },
  {
    id: 'psu_smart_500', name: 'Thermaltake Smart 500W', type: ComponentType.PSU,
    price: 49, performance: 45, power: 500, isRetro: false, color: 0x1a1a1a,
    size: [0.15, 0.086, 0.16], description: 'Простой БП 500W', formFactor: 'ATX'
  },
  {
    id: 'psu_msi_650', name: 'MSI MPG 650W', type: ComponentType.PSU,
    price: 89, performance: 65, power: 650, isRetro: false, color: 0x1a1a1a,
    size: [0.15, 0.086, 0.16], description: 'Игровой БП 650W', formFactor: 'ATX'
  },
  {
    id: 'psu_p750gm', name: 'Gigabyte P750GM', type: ComponentType.PSU,
    price: 79, performance: 62, power: 750, isRetro: false, color: 0x1a1a1a,
    size: [0.15, 0.086, 0.16], description: 'БП 750W модульный', formFactor: 'ATX'
  },
  {
    id: 'psu_pq600m', name: 'DeepCool PQ600M', type: ComponentType.PSU,
    price: 69, performance: 58, power: 600, isRetro: false, color: 0x1a1a1a,
    size: [0.15, 0.086, 0.16], description: 'Компактный БП 600W', formFactor: 'ATX'
  },
  {
    id: 'psu_zalman_500', name: 'Zalman Wattbit 500W', type: ComponentType.PSU,
    price: 39, performance: 38, power: 500, isRetro: false, color: 0x1a1a1a,
    size: [0.15, 0.086, 0.16], description: 'Бюджетный БП 500W', formFactor: 'ATX'
  },
  {
    id: 'psu_antec_300', name: 'Antec PP-303X 300W', type: ComponentType.PSU,
    price: 5, performance: 5, power: 300, isRetro: true, color: 0x444444,
    size: [0.14, 0.08, 0.15], description: 'Ретро БП 300W', formFactor: 'AT'
  },
  {
    id: 'psu_retro_generic', name: 'Generic AT 250W', type: ComponentType.PSU,
    price: 3, performance: 3, power: 250, isRetro: true, color: 0x555555,
    size: [0.14, 0.08, 0.15], description: 'Стандартный ретро БП', formFactor: 'AT'
  },
];

// ============================================
// НАКОПИТЕЛИ (12 штук)
// ============================================
export const Storages: Component[] = [
  {
    id: 'ssd_990pro', name: 'Samsung 990 PRO 2TB NVMe', type: ComponentType.STORAGE,
    price: 229, performance: 98, power: 7, isRetro: false, color: 0x003366,
    size: [0.08, 0.003, 0.022], description: 'Топовый NVMe SSD'
  },
  {
    id: 'ssd_sn850x', name: 'WD Black SN850X 1TB', type: ComponentType.STORAGE,
    price: 109, performance: 88, power: 6, isRetro: false, color: 0x1a1a1a,
    size: [0.08, 0.003, 0.022], description: 'Быстрый NVMe SSD'
  },
  {
    id: 'ssd_p3plus', name: 'Crucial P3 Plus 1TB', type: ComponentType.STORAGE,
    price: 69, performance: 72, power: 5, isRetro: false, color: 0x006600,
    size: [0.08, 0.003, 0.022], description: 'Доступный NVMe SSD'
  },
  {
    id: 'ssd_nv2', name: 'Kingston NV2 500GB', type: ComponentType.STORAGE,
    price: 39, performance: 55, power: 4, isRetro: false, color: 0x003366,
    size: [0.08, 0.003, 0.022], description: 'Бюджетный NVMe SSD'
  },
  {
    id: 'hdd_barracuda', name: 'Seagate Barracuda 2TB HDD', type: ComponentType.STORAGE,
    price: 59, performance: 35, power: 8, isRetro: false, color: 0x336633,
    size: [0.1, 0.026, 0.07], description: 'Надёжный HDD 2TB'
  },
  {
    id: 'hdd_wd_blue', name: 'WD Blue 1TB HDD', type: ComponentType.STORAGE,
    price: 45, performance: 30, power: 7, isRetro: false, color: 0x003366,
    size: [0.1, 0.026, 0.07], description: 'Стандартный HDD 1TB'
  },
  {
    id: 'ssd_870evo', name: 'Samsung 870 EVO 1TB', type: ComponentType.STORAGE,
    price: 89, performance: 65, power: 4, isRetro: false, color: 0x003366,
    size: [0.07, 0.007, 0.1], description: 'SATA SSD 1TB'
  },
  {
    id: 'ssd_a400', name: 'Kingston A400 480GB', type: ComponentType.STORAGE,
    price: 35, performance: 42, power: 3, isRetro: false, color: 0x003366,
    size: [0.07, 0.007, 0.1], description: 'Бюджетный SATA SSD'
  },
  {
    id: 'ssd_mx500', name: 'Crucial MX500 1TB', type: ComponentType.STORAGE,
    price: 79, performance: 60, power: 4, isRetro: false, color: 0x006600,
    size: [0.07, 0.007, 0.1], description: 'Надёжный SATA SSD'
  },
  {
    id: 'ssd_green', name: 'WD Green 240GB', type: ComponentType.STORAGE,
    price: 29, performance: 32, power: 2, isRetro: false, color: 0x006600,
    size: [0.07, 0.007, 0.1], description: 'Базовый SATA SSD'
  },
  {
    id: 'hdd_caviar', name: 'WD Caviar 2540 540MB', type: ComponentType.STORAGE,
    price: 1, performance: 1, power: 10, isRetro: true, color: 0x336633,
    size: [0.1, 0.03, 0.07], description: 'Ретро HDD 540MB'
  },
  {
    id: 'hdd_ibm', name: 'IBM Deskstar 4GB', type: ComponentType.STORAGE,
    price: 2, performance: 1, power: 12, isRetro: true, color: 0x333333,
    size: [0.1, 0.03, 0.07], description: 'Ретро HDD 4GB'
  },
];

// ============================================
// КОРПУСА (12 штук)
// ============================================
export const Cases: Component[] = [
  {
    id: 'case_5000d', name: 'Corsair 5000D Airflow', type: ComponentType.CASE,
    price: 179, performance: 85, power: 0, isRetro: false, color: 0x1a1a1a,
    size: [0.46, 0.52, 0.24], description: 'Просторный корпус с отличным airflow'
  },
  {
    id: 'case_o11', name: 'Lian Li PC-O11 Dynamic', type: ComponentType.CASE,
    price: 159, performance: 82, power: 0, isRetro: false, color: 0xcccccc,
    size: [0.44, 0.50, 0.23], description: 'Стильный корпус со стеклом'
  },
  {
    id: 'case_h510', name: 'NZXT H510', type: ComponentType.CASE,
    price: 89, performance: 65, power: 0, isRetro: false, color: 0x1a1a1a,
    size: [0.42, 0.47, 0.21], description: 'Компактный и стильный'
  },
  {
    id: 'case_meshify', name: 'Fractal Meshify C', type: ComponentType.CASE,
    price: 109, performance: 72, power: 0, isRetro: false, color: 0x333333,
    size: [0.42, 0.45, 0.22], description: 'Отличный airflow'
  },
  {
    id: 'case_td500', name: 'Cooler Master TD500', type: ComponentType.CASE,
    price: 99, performance: 68, power: 0, isRetro: false, color: 0x1a1a1a,
    size: [0.44, 0.48, 0.22], description: 'Красивый корпус с RGB'
  },
  {
    id: 'case_matrexx50', name: 'DeepCool MATREXX 50', type: ComponentType.CASE,
    price: 69, performance: 58, power: 0, isRetro: false, color: 0x1a1a1a,
    size: [0.42, 0.46, 0.21], description: 'Бюджетный корпус'
  },
  {
    id: 'case_500dx', name: 'be quiet! 500DX', type: ComponentType.CASE,
    price: 119, performance: 75, power: 0, isRetro: false, color: 0x1a1a1a,
    size: [0.44, 0.48, 0.23], description: 'Тихий корпус с RGB'
  },
  {
    id: 'case_p400a', name: 'Phanteks P400A', type: ComponentType.CASE,
    price: 89, performance: 68, power: 0, isRetro: false, color: 0x1a1a1a,
    size: [0.42, 0.47, 0.21], description: 'Хороший airflow за свои деньги'
  },
  {
    id: 'case_versa', name: 'Thermaltake Versa', type: ComponentType.CASE,
    price: 49, performance: 42, power: 0, isRetro: false, color: 0x333333,
    size: [0.40, 0.44, 0.20], description: 'Бюджетный корпус'
  },
  {
    id: 'case_i3', name: 'Zalman i3', type: ComponentType.CASE,
    price: 39, performance: 35, power: 0, isRetro: false, color: 0x1a1a1a,
    size: [0.40, 0.43, 0.19], description: 'Самый бюджетный корпус'
  },
  {
    id: 'case_inwin_a500', name: 'In Win A500', type: ComponentType.CASE,
    price: 8, performance: 8, power: 0, isRetro: true, color: 0x888888,
    size: [0.44, 0.45, 0.20], description: 'Ретро корпус из 90-х'
  },
  {
    id: 'case_retro_tower', name: 'Generic Beige Tower', type: ComponentType.CASE,
    price: 5, performance: 5, power: 0, isRetro: true, color: 0xccbb88,
    size: [0.42, 0.46, 0.20], description: 'Классический бежевый корпус'
  },
];

// ============================================
// КУЛЕРЫ (12 штук)
// ============================================
export const Coolers: Component[] = [
  {
    id: 'cool_nhd15', name: 'Noctua NH-D15', type: ComponentType.COOLER,
    price: 109, performance: 95, power: 4, isRetro: false, color: 0xccaa44,
    size: [0.15, 0.16, 0.13], description: 'Лучший воздушный кулер'
  },
  {
    id: 'cool_darkrock4', name: 'be quiet! Dark Rock Pro 4', type: ComponentType.COOLER,
    price: 89, performance: 88, power: 4, isRetro: false, color: 0x1a1a1a,
    size: [0.14, 0.15, 0.12], description: 'Тихий и мощный кулер'
  },
  {
    id: 'cool_ak620', name: 'DeepCool AK620', type: ComponentType.COOLER,
    price: 65, performance: 78, power: 4, isRetro: false, color: 0x1a1a1a,
    size: [0.13, 0.14, 0.11], description: 'Отличное охлаждение за свои деньги'
  },
  {
    id: 'cool_hyper212', name: 'Cooler Master Hyper 212', type: ComponentType.COOLER,
    price: 45, performance: 58, power: 3, isRetro: false, color: 0xcccccc,
    size: [0.12, 0.13, 0.10], description: 'Классический бюджетный кулер'
  },
  {
    id: 'cool_kraken_x63', name: 'NZXT Kraken X63', type: ComponentType.COOLER,
    price: 159, performance: 92, power: 8, isRetro: false, color: 0x1a1a1a,
    size: [0.28, 0.12, 0.03], description: 'СЖО 280мм с RGB'
  },
  {
    id: 'cool_h150i', name: 'Corsair H150i', type: ComponentType.COOLER,
    price: 189, performance: 96, power: 10, isRetro: false, color: 0x1a1a1a,
    size: [0.36, 0.12, 0.03], description: 'СЖО 360мм топовая'
  },
  {
    id: 'cool_freezer34', name: 'Arctic Freezer 34', type: ComponentType.COOLER,
    price: 35, performance: 48, power: 3, isRetro: false, color: 0xcccccc,
    size: [0.12, 0.12, 0.09], description: 'Компактный кулер'
  },
  {
    id: 'cool_mugen5', name: 'Scythe Mugen 5', type: ComponentType.COOLER,
    price: 49, performance: 62, power: 3, isRetro: false, color: 0xcccccc,
    size: [0.13, 0.14, 0.11], description: 'Тихий башенный кулер'
  },
  {
    id: 'cool_peerless', name: 'Thermalright Peerless Assassin', type: ComponentType.COOLER,
    price: 42, performance: 72, power: 4, isRetro: false, color: 0xcccccc,
    size: [0.13, 0.14, 0.11], description: 'Топ за свою цену'
  },
  {
    id: 'cool_se224', name: 'ID-Cooling SE-224', type: ComponentType.COOLER,
    price: 25, performance: 42, power: 3, isRetro: false, color: 0x1a1a1a,
    size: [0.11, 0.12, 0.08], description: 'Бюджетный кулер'
  },
  {
    id: 'cool_socket7', name: 'Стандартный кулер Socket 7', type: ComponentType.COOLER,
    price: 2, performance: 3, power: 2, isRetro: true, color: 0x888888,
    size: [0.06, 0.04, 0.06], description: 'Маленький ретро кулер'
  },
  {
    id: 'cool_retro_fan', name: 'Вентилятор 80мм', type: ComponentType.COOLER,
    price: 1, performance: 2, power: 2, isRetro: true, color: 0x666666,
    size: [0.08, 0.025, 0.08], description: 'Простой вентилятор'
  },
];

// ============================================
// МАТЕРИНСКИЕ ПЛАТЫ
// ============================================
export const Motherboards: Component[] = [
  {
    id: 'mb_z790_hero', name: 'ASUS ROG Maximus Z790 Hero', type: ComponentType.MOTHERBOARD,
    price: 629, performance: 95, power: 0, isRetro: false, color: 0x1a1a1a,
    size: [0.305, 0.02, 0.272], description: 'Топовая плата LGA1700', socket: 'LGA1700'
  },
  {
    id: 'mb_b650e', name: 'MSI MPG B650E Carbon', type: ComponentType.MOTHERBOARD,
    price: 349, performance: 82, power: 0, isRetro: false, color: 0x1a1a1a,
    size: [0.305, 0.02, 0.244], description: 'Отличная плата AM5', socket: 'AM5'
  },
  {
    id: 'mb_b660', name: 'Gigabyte B660 Aorus Elite', type: ComponentType.MOTHERBOARD,
    price: 179, performance: 65, power: 0, isRetro: false, color: 0x1a1a1a,
    size: [0.305, 0.02, 0.244], description: 'Хорошая плата LGA1700', socket: 'LGA1700'
  },
  {
    id: 'mb_b550', name: 'ASUS TUF B550-Plus', type: ComponentType.MOTHERBOARD,
    price: 149, performance: 58, power: 0, isRetro: false, color: 0x1a1a1a,
    size: [0.305, 0.02, 0.244], description: 'Надёжная плата AM4', socket: 'AM4'
  },
  {
    id: 'mb_h610', name: 'ASUS Prime H610M-K', type: ComponentType.MOTHERBOARD,
    price: 99, performance: 42, power: 0, isRetro: false, color: 0x1a1a1a,
    size: [0.244, 0.02, 0.218], description: 'Бюджетная mATX плата', socket: 'LGA1700'
  },
  {
    id: 'mb_a520', name: 'Gigabyte A520M S2H', type: ComponentType.MOTHERBOARD,
    price: 79, performance: 35, power: 0, isRetro: false, color: 0x1a1a1a,
    size: [0.244, 0.02, 0.218], description: 'Самая бюджетная AM4', socket: 'AM4'
  },
  {
    id: 'mb_socket7', name: 'Socket 7 Motherboard', type: ComponentType.MOTHERBOARD,
    price: 5, performance: 3, power: 0, isRetro: true, color: 0x006600,
    size: [0.28, 0.02, 0.22], description: 'Ретро плата Socket 7', socket: 'Socket 7'
  },
];

// ============================================
// ДОПОЛНИТЕЛЬНЫЕ КОМПЛЕКТУЮЩИЕ
// ============================================
export const SoundCards: Component[] = [
  { id: 'sc_sb', name: 'Creative Sound Blaster Z', type: ComponentType.SOUND_CARD, price: 99, performance: 85, power: 5, isRetro: false, color: 0x333333, size: [0.17, 0.02, 0.11], description: 'Игровая звуковая карта' },
  { id: 'sc_xonar', name: 'ASUS Xonar DG', type: ComponentType.SOUND_CARD, price: 39, performance: 55, power: 4, isRetro: false, color: 0x1a1a1a, size: [0.17, 0.02, 0.11], description: 'Бюджетная звуковая карта' },
  { id: 'sc_evga', name: 'EVGA Nu Audio', type: ComponentType.SOUND_CARD, price: 199, performance: 92, power: 5, isRetro: false, color: 0x1a1a1a, size: [0.17, 0.02, 0.11], description: 'Премиальная звуковая карта' },
  { id: 'sc_terratec', name: 'Terratec Aureon', type: ComponentType.SOUND_CARD, price: 59, performance: 62, power: 4, isRetro: false, color: 0x333333, size: [0.17, 0.02, 0.11], description: 'Немецкая звуковая карта' },
  { id: 'sc_genius', name: 'Genius SoundMaker', type: ComponentType.SOUND_CARD, price: 15, performance: 25, power: 3, isRetro: true, color: 0x888888, size: [0.15, 0.02, 0.10], description: 'Ретро звуковая карта' },
];

export const NetworkCards: Component[] = [
  { id: 'nc_intel', name: 'Intel I225-V 2.5G', type: ComponentType.NETWORK_CARD, price: 29, performance: 80, power: 3, isRetro: false, color: 0x0071c5, size: [0.17, 0.02, 0.08], description: 'Быстрая сетевая карта 2.5G' },
  { id: 'nc_tp_link', name: 'TP-Link TG-3468', type: ComponentType.NETWORK_CARD, price: 15, performance: 55, power: 3, isRetro: false, color: 0x006600, size: [0.17, 0.02, 0.08], description: 'Гигабитная сетевая карта' },
  { id: 'nc_dlink', name: 'D-Link DGE-528T', type: ComponentType.NETWORK_CARD, price: 12, performance: 48, power: 3, isRetro: false, color: 0x006600, size: [0.17, 0.02, 0.08], description: 'Бюджетная сетевая карта' },
  { id: 'nc_realtek', name: 'Realtek RTL8125', type: ComponentType.NETWORK_CARD, price: 19, performance: 65, power: 3, isRetro: false, color: 0x333333, size: [0.17, 0.02, 0.08], description: '2.5G сетевая карта' },
  { id: 'nc_killer', name: 'Killer E3100', type: ComponentType.NETWORK_CARD, price: 49, performance: 88, power: 4, isRetro: false, color: 0x660000, size: [0.17, 0.02, 0.08], description: 'Игровая сетевая карта' },
];

export const CDRoms: Component[] = [
  { id: 'cd_lg', name: 'LG GH24NSD1', type: ComponentType.CD_ROM, price: 25, performance: 50, power: 5, isRetro: false, color: 0xcccccc, size: [0.146, 0.042, 0.17], description: 'DVD-RW привод' },
  { id: 'cd_asus', name: 'ASUS DRW-24D5MT', type: ComponentType.CD_ROM, price: 22, performance: 48, power: 5, isRetro: false, color: 0x1a1a1a, size: [0.146, 0.042, 0.17], description: 'DVD-RW привод' },
  { id: 'cd_plextor', name: 'Plextor PX-891SA', type: ComponentType.CD_ROM, price: 45, performance: 70, power: 5, isRetro: false, color: 0x1a1a1a, size: [0.146, 0.042, 0.17], description: 'Премиальный DVD привод' },
  { id: 'cd_sony', name: 'Sony NEC Optiarc', type: ComponentType.CD_ROM, price: 18, performance: 42, power: 5, isRetro: false, color: 0x1a1a1a, size: [0.146, 0.042, 0.17], description: 'Надёжный DVD привод' },
  { id: 'cd_nec', name: 'NEC CD-ROM 52x', type: ComponentType.CD_ROM, price: 3, performance: 10, power: 8, isRetro: true, color: 0xccbb88, size: [0.146, 0.042, 0.17], description: 'Ретро CD-ROM' },
];

export const ThermalPastes: Component[] = [
  { id: 'tp_mx4', name: 'Arctic MX-4', type: ComponentType.THERMAL_PASTE, price: 8, performance: 75, power: 0, isRetro: false, color: 0x888888, size: [0.03, 0.06, 0.015], description: 'Популярная термопаста' },
  { id: 'tp_nth1', name: 'Noctua NT-H1', type: ComponentType.THERMAL_PASTE, price: 12, performance: 82, power: 0, isRetro: false, color: 0xccaa44, size: [0.03, 0.06, 0.015], description: 'Премиальная термопаста' },
  { id: 'tp_kryonaut', name: 'Thermal Grizzly Kryonaut', type: ComponentType.THERMAL_PASTE, price: 15, performance: 92, power: 0, isRetro: false, color: 0xcccccc, size: [0.03, 0.04, 0.015], description: 'Лучшая термопаста' },
  { id: 'tp_cm', name: 'Cooler Master MasterGel', type: ComponentType.THERMAL_PASTE, price: 7, performance: 60, power: 0, isRetro: false, color: 0x333333, size: [0.03, 0.06, 0.015], description: 'Хорошая термопаста' },
  { id: 'tp_dc', name: 'DeepCool EX750', type: ComponentType.THERMAL_PASTE, price: 6, performance: 55, power: 0, isRetro: false, color: 0x1a1a1a, size: [0.03, 0.06, 0.015], description: 'Бюджетная термопаста' },
  { id: 'tp_gd900', name: 'GD900', type: ComponentType.THERMAL_PASTE, price: 2, performance: 30, power: 0, isRetro: false, color: 0xcccccc, size: [0.03, 0.08, 0.015], description: 'Самая дешёвая термопаста' },
];

// ============================================
// ПЕРИФЕРИЯ
// ============================================
export const Mice: Peripheral[] = [
  { id: 'mouse_gpx', name: 'Logitech G Pro X Superlight', type: PeripheralType.MOUSE, price: 149, quality: 95, isRetro: false, color: 0x1a1a1a, size: [0.065, 0.04, 0.125], description: 'Легчайшая игровая мышь' },
  { id: 'mouse_viper', name: 'Razer Viper Ultimate', type: PeripheralType.MOUSE, price: 129, quality: 90, isRetro: false, color: 0x1a1a1a, size: [0.065, 0.038, 0.127], description: 'Беспроводная игровая мышь' },
  { id: 'mouse_rival3', name: 'SteelSeries Rival 3', type: PeripheralType.MOUSE, price: 29, quality: 55, isRetro: false, color: 0x1a1a1a, size: [0.06, 0.035, 0.118], description: 'Бюджетная игровая мышь' },
  { id: 'mouse_pulsefire', name: 'HyperX Pulsefire Haste', type: PeripheralType.MOUSE, price: 49, quality: 68, isRetro: false, color: 0x1a1a1a, size: [0.066, 0.038, 0.124], description: 'Лёгкая мышь с сотами' },
  { id: 'mouse_harpoon', name: 'Corsair Harpoon RGB', type: PeripheralType.MOUSE, price: 39, quality: 58, isRetro: false, color: 0x1a1a1a, size: [0.068, 0.042, 0.124], description: 'Простая игровая мышь' },
  { id: 'mouse_g102', name: 'Logitech G102', type: PeripheralType.MOUSE, price: 29, quality: 52, isRetro: false, color: 0x1a1a1a, size: [0.062, 0.035, 0.116], description: 'Популярная бюджетная мышь' },
  { id: 'mouse_deathadder', name: 'Razer DeathAdder V2', type: PeripheralType.MOUSE, price: 69, quality: 78, isRetro: false, color: 0x1a1a1a, size: [0.068, 0.043, 0.127], description: 'Эргономичная мышь' },
  { id: 'mouse_ec2', name: 'Zowie EC2-C', type: PeripheralType.MOUSE, price: 79, quality: 82, isRetro: false, color: 0x1a1a1a, size: [0.064, 0.04, 0.128], description: 'Киберспортивная мышь' },
  { id: 'mouse_modelo', name: 'Glorious Model O', type: PeripheralType.MOUSE, price: 49, quality: 70, isRetro: false, color: 0xffffff, size: [0.066, 0.038, 0.128], description: 'Мышь с сотами' },
  { id: 'mouse_kone', name: 'Roccat Kone XP', type: PeripheralType.MOUSE, price: 99, quality: 75, isRetro: false, color: 0x1a1a1a, size: [0.07, 0.043, 0.13], description: 'Мышь с RGB' },
  { id: 'mouse_genius', name: 'Genius NetScroll+', type: PeripheralType.MOUSE, price: 5, quality: 10, isRetro: true, color: 0xcccccc, size: [0.055, 0.03, 0.1], description: 'Ретро мышь' },
  { id: 'mouse_mitsumi', name: 'Mitsumi Mouse', type: PeripheralType.MOUSE, price: 3, quality: 5, isRetro: true, color: 0xccbb88, size: [0.05, 0.028, 0.09], description: 'Очень ретро мышь' },
];

export const Keyboards: Peripheral[] = [
  { id: 'kb_k70', name: 'Corsair K70 RGB MK.2', type: PeripheralType.KEYBOARD, price: 159, quality: 90, isRetro: false, color: 0x1a1a1a, size: [0.44, 0.035, 0.17], description: 'Механическая клавиатура' },
  { id: 'kb_gpx', name: 'Logitech G Pro X', type: PeripheralType.KEYBOARD, price: 129, quality: 85, isRetro: false, color: 0x1a1a1a, size: [0.36, 0.035, 0.14], description: 'TKL механика' },
  { id: 'kb_huntsman', name: 'Razer Huntsman V2', type: PeripheralType.KEYBOARD, price: 149, quality: 88, isRetro: false, color: 0x1a1a1a, size: [0.44, 0.035, 0.17], description: 'Оптическая механика' },
  { id: 'kb_alloy', name: 'HyperX Alloy Origins', type: PeripheralType.KEYBOARD, price: 99, quality: 78, isRetro: false, color: 0x1a1a1a, size: [0.44, 0.035, 0.17], description: 'Алюминиевая механика' },
  { id: 'kb_apex', name: 'SteelSeries Apex Pro', type: PeripheralType.KEYBOARD, price: 189, quality: 92, isRetro: false, color: 0x1a1a1a, size: [0.44, 0.04, 0.17], description: 'Регулируемая механика' },
  { id: 'kb_ducky', name: 'Ducky One 3', type: PeripheralType.KEYBOARD, price: 119, quality: 82, isRetro: false, color: 0xffffff, size: [0.36, 0.035, 0.14], description: 'Кастомная TKL' },
  { id: 'kb_k8', name: 'Keychron K8', type: PeripheralType.KEYBOARD, price: 89, quality: 75, isRetro: false, color: 0x333333, size: [0.36, 0.04, 0.14], description: 'Беспроводная TKL' },
  { id: 'kb_annepro', name: 'Anne Pro 2', type: PeripheralType.KEYBOARD, price: 79, quality: 70, isRetro: false, color: 0x1a1a1a, size: [0.30, 0.03, 0.11], description: 'Компактная 60%' },
  { id: 'kb_rk61', name: 'Royal Kludge RK61', type: PeripheralType.KEYBOARD, price: 49, quality: 58, isRetro: false, color: 0xffffff, size: [0.30, 0.035, 0.11], description: 'Бюджетная 60%' },
  { id: 'kb_f75', name: 'AULA F75', type: PeripheralType.KEYBOARD, price: 59, quality: 62, isRetro: false, color: 0x1a1a1a, size: [0.36, 0.035, 0.14], description: 'Хорошая 75% клавиатура' },
  { id: 'kb_genius', name: 'Genius KB-120', type: PeripheralType.KEYBOARD, price: 5, quality: 8, isRetro: true, color: 0xccbb88, size: [0.44, 0.025, 0.15], description: 'Ретро мембранная клавиатура' },
  { id: 'kb_modelm', name: 'IBM Model M', type: PeripheralType.KEYBOARD, price: 15, quality: 25, isRetro: true, color: 0xccbb88, size: [0.47, 0.04, 0.20], description: 'Легендарная механика 1986' },
];

export const Monitors: Peripheral[] = [
  { id: 'mon_pg279', name: 'ASUS PG279QM', type: PeripheralType.MONITOR, price: 699, quality: 95, isRetro: false, color: 0x1a1a1a, size: [0.62, 0.45, 0.22], description: '27" 240Hz IPS' },
  { id: 'mon_odyssey', name: 'Samsung Odyssey G7', type: PeripheralType.MONITOR, price: 499, quality: 88, isRetro: false, color: 0x1a1a1a, size: [0.60, 0.48, 0.25], description: '32" 240Hz изогнутый' },
  { id: 'mon_27gp850', name: 'LG 27GP850-B', type: PeripheralType.MONITOR, price: 449, quality: 85, isRetro: false, color: 0x1a1a1a, size: [0.62, 0.44, 0.22], description: '27" 180Hz Nano IPS' },
  { id: 'mon_s2721', name: 'Dell S2721DGF', type: PeripheralType.MONITOR, price: 299, quality: 72, isRetro: false, color: 0x1a1a1a, size: [0.62, 0.44, 0.20], description: '27" 165Hz IPS' },
  { id: 'mon_24g2', name: 'AOC 24G2', type: PeripheralType.MONITOR, price: 179, quality: 62, isRetro: false, color: 0x1a1a1a, size: [0.55, 0.40, 0.18], description: '24" 144Hz IPS' },
  { id: 'mon_xl2546', name: 'BenQ XL2546K', type: PeripheralType.MONITOR, price: 479, quality: 86, isRetro: false, color: 0x1a1a1a, size: [0.58, 0.42, 0.22], description: '24.5" 240Hz TN' },
  { id: 'mon_optix', name: 'MSI Optix G27CQ4', type: PeripheralType.MONITOR, price: 279, quality: 68, isRetro: false, color: 0x1a1a1a, size: [0.62, 0.45, 0.22], description: '27" 165Hz VA' },
  { id: 'mon_m27q', name: 'Gigabyte M27Q', type: PeripheralType.MONITOR, price: 329, quality: 75, isRetro: false, color: 0x1a1a1a, size: [0.62, 0.44, 0.20], description: '27" 170Hz IPS' },
  { id: 'mon_nitro', name: 'Acer Nitro XV272U', type: PeripheralType.MONITOR, price: 249, quality: 65, isRetro: false, color: 0x1a1a1a, size: [0.62, 0.44, 0.20], description: '27" 170Hz IPS' },
  { id: 'mon_242m8', name: 'Philips 242M8', type: PeripheralType.MONITOR, price: 159, quality: 55, isRetro: false, color: 0x1a1a1a, size: [0.55, 0.40, 0.18], description: '24" 144Hz VA' },
  { id: 'mon_crt15', name: 'CRT 15"', type: PeripheralType.MONITOR, price: 5, quality: 8, isRetro: true, color: 0xccbb88, size: [0.40, 0.38, 0.40], description: 'Ретро CRT монитор' },
  { id: 'mon_philips75', name: 'Philips 75Hz', type: PeripheralType.MONITOR, price: 3, quality: 5, isRetro: true, color: 0xccbb88, size: [0.36, 0.34, 0.36], description: 'Очень ретро монитор' },
];

export const Headphones: Peripheral[] = [
  { id: 'hp_cloud2', name: 'HyperX Cloud II', type: PeripheralType.HEADPHONES, price: 99, quality: 82, isRetro: false, color: 0x660000, size: [0.20, 0.20, 0.10], description: 'Популярная игровая гарнитура' },
  { id: 'hp_arctis', name: 'SteelSeries Arctis Nova Pro', type: PeripheralType.HEADPHONES, price: 349, quality: 96, isRetro: false, color: 0x1a1a1a, size: [0.20, 0.20, 0.10], description: 'Премиальная гарнитура' },
  { id: 'hp_gpx', name: 'Logitech G Pro X', type: PeripheralType.HEADPHONES, price: 129, quality: 80, isRetro: false, color: 0x1a1a1a, size: [0.20, 0.20, 0.10], description: 'Киберспортивная гарнитура' },
  { id: 'hp_blackshark', name: 'Razer BlackShark V2', type: PeripheralType.HEADPHONES, price: 89, quality: 75, isRetro: false, color: 0x1a1a1a, size: [0.20, 0.20, 0.10], description: 'Лёгкая игровая гарнитура' },
  { id: 'hp_virtuoso', name: 'Corsair Virtuoso RGB', type: PeripheralType.HEADPHONES, price: 199, quality: 88, isRetro: false, color: 0x1a1a1a, size: [0.20, 0.20, 0.10], description: 'Беспроводная премиум' },
  { id: 'hp_hd599', name: 'Sennheiser HD 599', type: PeripheralType.HEADPHONES, price: 149, quality: 85, isRetro: false, color: 0x663300, size: [0.20, 0.20, 0.10], description: 'Аудиофильские наушники' },
  { id: 'hp_dt990', name: 'Beyerdynamic DT 990', type: PeripheralType.HEADPHONES, price: 159, quality: 87, isRetro: false, color: 0x333333, size: [0.20, 0.20, 0.10], description: 'Студийные наушники' },
  { id: 'hp_m50x', name: 'Audio-Technica ATH-M50x', type: PeripheralType.HEADPHONES, price: 149, quality: 86, isRetro: false, color: 0x1a1a1a, size: [0.20, 0.20, 0.10], description: 'Мониторные наушники' },
  { id: 'hp_shp9500', name: 'Philips SHP9500', type: PeripheralType.HEADPHONES, price: 79, quality: 68, isRetro: false, color: 0x1a1a1a, size: [0.20, 0.20, 0.10], description: 'Бюджетные аудиофильские' },
  { id: 'hp_hd681', name: 'Superlux HD 681', type: PeripheralType.HEADPHONES, price: 35, quality: 48, isRetro: false, color: 0x1a1a1a, size: [0.20, 0.20, 0.10], description: 'Самые дешёвые аудиофильские' },
  { id: 'hp_genius', name: 'Genius HS-02', type: PeripheralType.HEADPHONES, price: 8, quality: 12, isRetro: true, color: 0x333333, size: [0.18, 0.18, 0.08], description: 'Ретро гарнитура' },
  { id: 'hp_retro_mic', name: 'Наушники с микрофоном', type: PeripheralType.HEADPHONES, price: 5, quality: 8, isRetro: true, color: 0x666666, size: [0.18, 0.18, 0.08], description: 'Простые наушники' },
];

export const Mousepads: Peripheral[] = [
  { id: 'pad_goliathus', name: 'Razer Goliathus Extended', type: PeripheralType.MOUSEPAD, price: 39, quality: 80, isRetro: false, color: 0x00cc00, size: [0.9, 0.003, 0.4], description: 'Большой игровой коврик' },
  { id: 'pad_qck', name: 'SteelSeries QcK Prism', type: PeripheralType.MOUSEPAD, price: 35, quality: 75, isRetro: false, color: 0x1a1a1a, size: [0.45, 0.003, 0.4], description: 'Коврик с RGB' },
  { id: 'pad_g640', name: 'Logitech G640', type: PeripheralType.MOUSEPAD, price: 29, quality: 70, isRetro: false, color: 0x0071c5, size: [0.46, 0.003, 0.4], description: 'Тканевый коврик' },
  { id: 'pad_furys', name: 'HyperX Fury S Pro', type: PeripheralType.MOUSEPAD, price: 25, quality: 65, isRetro: false, color: 0x660000, size: [0.45, 0.003, 0.4], description: 'Гладкий коврик' },
  { id: 'pad_mm300', name: 'Corsair MM300', type: PeripheralType.MOUSEPAD, price: 22, quality: 60, isRetro: false, color: 0x1a1a1a, size: [0.46, 0.003, 0.4], description: 'Тканевый коврик' },
  { id: 'pad_gsr', name: 'Zowie G-SR', type: PeripheralType.MOUSEPAD, price: 29, quality: 72, isRetro: false, color: 0x1a1a1a, size: [0.47, 0.003, 0.36], description: 'Контрольный коврик' },
  { id: 'pad_xxl', name: 'Glorious XXL', type: PeripheralType.MOUSEPAD, price: 35, quality: 75, isRetro: false, color: 0x1a1a1a, size: [0.94, 0.003, 0.46], description: 'Огромный коврик' },
  { id: 'pad_mp510', name: 'Cooler Master MP510', type: PeripheralType.MOUSEPAD, price: 25, quality: 62, isRetro: false, color: 0x333333, size: [0.45, 0.003, 0.4], description: 'Коврик с RGB' },
  { id: 'pad_kanga', name: 'Roccat Kanga', type: PeripheralType.MOUSEPAD, price: 19, quality: 52, isRetro: false, color: 0x1a1a1a, size: [0.40, 0.003, 0.35], description: 'Скоростной коврик' },
  { id: 'pad_aukey', name: 'Aukey XXL', type: PeripheralType.MOUSEPAD, price: 19, quality: 48, isRetro: false, color: 0x1a1a1a, size: [0.8, 0.003, 0.3], description: 'Бюджетный большой коврик' },
  { id: 'pad_basic', name: 'Обычный коврик', type: PeripheralType.MOUSEPAD, price: 3, quality: 15, isRetro: true, color: 0x336633, size: [0.25, 0.002, 0.22], description: 'Простой коврик' },
  { id: 'pad_no', name: 'Без коврика', type: PeripheralType.MOUSEPAD, price: 0, quality: 5, isRetro: true, color: 0x888888, size: [0.2, 0.001, 0.2], description: 'По столу' },
];

export const Microphones: Peripheral[] = [
  { id: 'mic_quadcast', name: 'HyperX QuadCast S', type: PeripheralType.MICROPHONE, price: 159, quality: 90, isRetro: false, color: 0x1a1a1a, size: [0.08, 0.26, 0.08], description: 'USB микрофон с RGB' },
  { id: 'mic_yeti', name: 'Blue Yeti', type: PeripheralType.MICROPHONE, price: 129, quality: 85, isRetro: false, color: 0xcccccc, size: [0.12, 0.30, 0.12], description: 'Легендарный USB микрофон' },
  { id: 'mic_seiren', name: 'Razer Seiren V2', type: PeripheralType.MICROPHONE, price: 99, quality: 78, isRetro: false, color: 0x1a1a1a, size: [0.07, 0.25, 0.07], description: 'Стриминговый микрофон' },
  { id: 'mic_at2020', name: 'Audio-Technica AT2020', type: PeripheralType.MICROPHONE, price: 99, quality: 80, isRetro: false, color: 0x333333, size: [0.05, 0.18, 0.05], description: 'Студийный конденсаторный' },
  { id: 'mic_q2u', name: 'Samson Q2U', type: PeripheralType.MICROPHONE, price: 69, quality: 68, isRetro: false, color: 0x333333, size: [0.05, 0.20, 0.05], description: 'USB/XLR микрофон' },
  { id: 'mic_ntusb', name: 'Rode NT-USB', type: PeripheralType.MICROPHONE, price: 149, quality: 88, isRetro: false, color: 0x333333, size: [0.06, 0.22, 0.06], description: 'Премиальный USB микрофон' },
  { id: 'mic_k669', name: 'Fifine K669', type: PeripheralType.MICROPHONE, price: 29, quality: 52, isRetro: false, color: 0x333333, size: [0.05, 0.18, 0.05], description: 'Бюджетный микрофон' },
  { id: 'mic_au100', name: 'Maono AU-100', type: PeripheralType.MICROPHONE, price: 39, quality: 55, isRetro: false, color: 0x333333, size: [0.05, 0.20, 0.05], description: 'Доступный микрофон' },
  { id: 'mic_tc777', name: 'Tonor TC-777', type: PeripheralType.MICROPHONE, price: 49, quality: 58, isRetro: false, color: 0x1a1a1a, size: [0.05, 0.22, 0.05], description: 'USB микрофон' },
  { id: 'mic_amic', name: 'AMIC 11', type: PeripheralType.MICROPHONE, price: 19, quality: 35, isRetro: false, color: 0x333333, size: [0.04, 0.15, 0.04], description: 'Простой микрофон' },
  { id: 'mic_genius', name: 'Genius HS-02 mic', type: PeripheralType.MICROPHONE, price: 2, quality: 8, isRetro: true, color: 0x666666, size: [0.03, 0.10, 0.03], description: 'Микрофон от гарнитуры' },
  { id: 'mic_headset', name: 'Микрофон от наушников', type: PeripheralType.MICROPHONE, price: 1, quality: 5, isRetro: true, color: 0x888888, size: [0.02, 0.08, 0.02], description: 'Встроенный микрофон' },
];

export const Speakers: Peripheral[] = [
  { id: 'sp_z623', name: 'Logitech Z623', type: PeripheralType.SPEAKERS, price: 149, quality: 82, isRetro: false, color: 0x1a1a1a, size: [0.35, 0.30, 0.22], description: '2.1 система с сабвуфером' },
  { id: 'sp_pebble', name: 'Creative Pebble V3', type: PeripheralType.SPEAKERS, price: 35, quality: 52, isRetro: false, color: 0x1a1a1a, size: [0.22, 0.12, 0.12], description: 'Компактные колонки' },
  { id: 'sp_r1280', name: 'Edifier R1280T', type: PeripheralType.SPEAKERS, price: 99, quality: 72, isRetro: false, color: 0x4a3020, size: [0.35, 0.24, 0.18], description: 'Книжные колонки' },
  { id: 'sp_quantum', name: 'JBL Quantum Duo', type: PeripheralType.SPEAKERS, price: 79, quality: 65, isRetro: false, color: 0x1a1a1a, size: [0.22, 0.20, 0.15], description: 'Игровые колонки' },
  { id: 'sp_nommo', name: 'Razer Nommo Chroma', type: PeripheralType.SPEAKERS, price: 149, quality: 75, isRetro: false, color: 0x00cc00, size: [0.30, 0.22, 0.15], description: 'Игровые колонки RGB' },
  { id: 'sp_comp2', name: 'Bose Companion 2', type: PeripheralType.SPEAKERS, price: 79, quality: 62, isRetro: false, color: 0x1a1a1a, size: [0.20, 0.22, 0.15], description: 'Компактные колонки' },
  { id: 'sp_a2', name: 'Audioengine A2+', type: PeripheralType.SPEAKERS, price: 269, quality: 90, isRetro: false, color: 0x1a1a1a, size: [0.25, 0.18, 0.14], description: 'Премиальные колонки' },
  { id: 'sp_cr3', name: 'Mackie CR3', type: PeripheralType.SPEAKERS, price: 99, quality: 70, isRetro: false, color: 0x1a1a1a, size: [0.28, 0.20, 0.16], description: 'Мониторные колонки' },
  { id: 'sp_eris', name: 'Presonus Eris 3.5', type: PeripheralType.SPEAKERS, price: 89, quality: 65, isRetro: false, color: 0x333333, size: [0.25, 0.18, 0.15], description: 'Студийные мониторы' },
  { id: 'sp_sphf', name: 'Genius SP-HF', type: PeripheralType.SPEAKERS, price: 25, quality: 35, isRetro: false, color: 0x1a1a1a, size: [0.20, 0.18, 0.12], description: 'Бюджетные колонки' },
  { id: 'sp_sps110', name: 'Genius SP-S110', type: PeripheralType.SPEAKERS, price: 5, quality: 10, isRetro: true, color: 0xccbb88, size: [0.15, 0.12, 0.10], description: 'Ретро колонки' },
  { id: 'sp_retro', name: 'Пищалка PC Speaker', type: PeripheralType.SPEAKERS, price: 1, quality: 3, isRetro: true, color: 0x333333, size: [0.05, 0.05, 0.03], description: 'Внутренний спикер' },
];

// ============================================
// ВСЕ КОМПЛЕКТУЮЩИЕ И ПЕРИФЕРИЯ
// ============================================
export const ALL_COMPONENTS: Component[] = [
  ...CPUs, ...GPUs, ...RAMs, ...PSUs, ...Storages, ...Cases, ...Coolers,
  ...Motherboards, ...SoundCards, ...NetworkCards, ...CDRoms, ...ThermalPastes
];

export const ALL_PERIPHERALS: Peripheral[] = [
  ...Mice, ...Keyboards, ...Monitors, ...Headphones, ...Mousepads, ...Microphones, ...Speakers
];

// ============================================
// ШАБЛОНЫ ЗАКАЗОВ
// ============================================
export const ORDER_TEMPLATES = [
  // Обычные заказы
  { type: OrderType.GAMING, title: 'ПК для CS2', budget: 1500, minPerf: 70, apps: ['Steam', 'CS2'], overclocking: false, isServer: false },
  { type: OrderType.GAMING, title: 'ПК для Cyberpunk 2077', budget: 2500, minPerf: 90, apps: ['Steam', 'Cyberpunk 2077'], overclocking: true, isServer: false },
  { type: OrderType.GAMING, title: 'ПК для Fortnite', budget: 1000, minPerf: 55, apps: ['Epic Games', 'Fortnite'], overclocking: false, isServer: false },
  { type: OrderType.GAMING, title: 'ПК для Minecraft', budget: 800, minPerf: 45, apps: ['Minecraft Launcher'], overclocking: false, isServer: false },
  { type: OrderType.WORK, title: 'ПК для программирования', budget: 1800, minPerf: 65, apps: ['VS Code', 'Chrome'], overclocking: false, isServer: false },
  { type: OrderType.STREAMING, title: 'ПК для стримов на Twitch', budget: 2200, minPerf: 80, apps: ['OBS', 'Chrome', 'Discord'], overclocking: true, isServer: false },
  { type: OrderType.EDITING, title: 'ПК для видеомонтажа', budget: 3000, minPerf: 85, apps: ['Adobe Premiere Pro', 'Blender'], overclocking: false, isServer: false },
  { type: OrderType.EDITING, title: 'ПК для 3D рендера', budget: 3500, minPerf: 92, apps: ['Blender', '3ds Max'], overclocking: true, isServer: false },
  { type: OrderType.OFFICE, title: 'Офисный ПК', budget: 500, minPerf: 25, apps: ['Chrome', 'Office'], overclocking: false, isServer: false },
  { type: OrderType.OFFICE, title: 'ПК для учёбы', budget: 600, minPerf: 30, apps: ['Chrome', 'VS Code'], overclocking: false, isServer: false },
  // Серверные заказы
  { type: OrderType.SERVER_DB, title: 'Сервер базы данных', budget: 4000, minPerf: 80, apps: ['PostgreSQL', 'Linux'], overclocking: false, isServer: true },
  { type: OrderType.SERVER_WEB, title: 'Веб-сервер', budget: 2500, minPerf: 60, apps: ['Nginx', 'Linux', 'Docker'], overclocking: false, isServer: true },
  { type: OrderType.SERVER_RENDER, title: 'Сервер рендеринга', budget: 5000, minPerf: 95, apps: ['Blender', 'Linux'], overclocking: true, isServer: true },
  { type: OrderType.SERVER_CLOUD, title: 'Облачный сервер', budget: 3500, minPerf: 75, apps: ['Linux', 'Docker', 'Kubernetes'], overclocking: false, isServer: true },
];

// Генерация заказа
export function generateOrder(): Order {
  const template = ORDER_TEMPLATES[Math.floor(Math.random() * ORDER_TEMPLATES.length)];
  const budgetVariation = Math.floor(template.budget * (0.8 + Math.random() * 0.4));
  const neededComponents: ComponentType[] = [
    ComponentType.CPU, ComponentType.GPU, ComponentType.RAM,
    ComponentType.PSU, ComponentType.STORAGE, ComponentType.CASE,
    ComponentType.COOLER, ComponentType.MOTHERBOARD
  ];
  
  return {
    id: 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    type: template.type,
    title: template.title,
    description: `Заказ: ${template.title}. Бюджет: $${budgetVariation}. ${template.overclocking ? 'Нужен разгон.' : 'Разгон не нужен.'} Приложения: ${template.apps.join(', ')}.`,
    budget: budgetVariation,
    deadline: 10 + Math.floor(Math.random() * 20), // минут
    requirements: {
      minPerformance: template.minPerf,
      neededComponents: neededComponents,
      overclocking: template.overclocking,
      apps: template.apps,
      os: template.isServer ? 'Linux Ubuntu' : 'Windows 11 Pro'
    },
    bonus: 10 + Math.floor(Math.random() * 40),
    penalty: 20,
    isServer: template.isServer,
    reputationReward: template.isServer ? 15 : 10,
  };
}

// ОС
export const OPERATING_SYSTEMS = [
  { id: 'win11', name: 'Windows 11 Pro', price: 120, icon: '🪟' },
  { id: 'win10', name: 'Windows 10', price: 10, icon: '🪟' },
  { id: 'ubuntu', name: 'Linux Ubuntu', price: 0, icon: '🐧' },
  { id: 'win95', name: 'Windows 95', price: 0, icon: '🪟' },
];

// Приложения для установки
export const APPS = [
  { id: 'steam', name: 'Steam', price: 0, icon: '🎮' },
  { id: 'epic', name: 'Epic Games', price: 0, icon: '🎮' },
  { id: 'chrome', name: 'Google Chrome', price: 0, icon: '🌐' },
  { id: 'firefox', name: 'Mozilla Firefox', price: 0, icon: '🦊' },
  { id: 'vscode', name: 'VS Code', price: 0, icon: '💻' },
  { id: 'blender', name: 'Blender', price: 0, icon: '🎨' },
  { id: 'premiere', name: 'Adobe Premiere Pro', price: 230, icon: '🎬' },
  { id: 'minecraft', name: 'Minecraft Launcher', price: 27, icon: '⛏️' },
  { id: 'tempmanager', name: 'Temperature Manager', price: 0, icon: '🌡️' },
  { id: 'fpsmonitor', name: 'FPS Monitor', price: 0, icon: '📊' },
  { id: 'store', name: 'App Store', price: 0, icon: '🏪' },
];
