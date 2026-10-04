// ============================================
// ГЛАВНЫЙ КОМПОНЕНТ: UI + инициализация игры
// ============================================

import { useEffect, useRef, useState } from 'react';
import { Game } from './game/Engine';
import { 
  ALL_COMPONENTS, ALL_PERIPHERALS, Component, Peripheral,
  ComponentType, PeripheralType, Order, OPERATING_SYSTEMS, APPS
} from './game/Data';

// Категории магазина
const SHOP_CATEGORIES = [
  { id: 'cpu', name: '🔲 Процессоры', type: ComponentType.CPU },
  { id: 'gpu', name: '🎮 Видеокарты', type: ComponentType.GPU },
  { id: 'ram', name: '💾 ОЗУ', type: ComponentType.RAM },
  { id: 'psu', name: '⚡ Блоки питания', type: ComponentType.PSU },
  { id: 'storage', name: '💿 Накопители', type: ComponentType.STORAGE },
  { id: 'case', name: '🖥️ Корпуса', type: ComponentType.CASE },
  { id: 'cooler', name: '🌀 Кулеры', type: ComponentType.COOLER },
  { id: 'motherboard', name: '📟 Мат. платы', type: ComponentType.MOTHERBOARD },
  { id: 'sound_card', name: '🔊 Зв. карты', type: ComponentType.SOUND_CARD },
  { id: 'network_card', name: '🌐 Сет. карты', type: ComponentType.NETWORK_CARD },
  { id: 'cd_rom', name: '📀 CD-ROM', type: ComponentType.CD_ROM },
  { id: 'thermal_paste', name: '🧴 Термопаста', type: ComponentType.THERMAL_PASTE },
  { id: 'mouse', name: '🖱️ Мыши', type: 'peripheral_mouse' },
  { id: 'keyboard', name: '⌨️ Клавиатуры', type: 'peripheral_keyboard' },
  { id: 'monitor', name: '🖥️ Мониторы', type: 'peripheral_monitor' },
  { id: 'headphones', name: '🎧 Наушники', type: 'peripheral_headphones' },
  { id: 'mousepad', name: '🟫 Коврики', type: 'peripheral_mousepad' },
  { id: 'microphone', name: '🎤 Микрофоны', type: 'peripheral_microphone' },
  { id: 'speakers', name: '🔈 Колонки', type: 'peripheral_speakers' },
];

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [gameState, setGameState] = useState<any>(null);
  const [showControls, setShowControls] = useState(true);
  
  // Инициализация игры
  useEffect(() => {
    if (containerRef.current && !gameRef.current) {
      gameRef.current = new Game(containerRef.current);
      
      // Обновление UI каждые 100мс
      const interval = setInterval(() => {
        if (gameRef.current) {
          setGameState(gameRef.current.getState());
        }
      }, 100);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, []);
  
  // Скрыть подсказки через 10 секунд
  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 10000);
    return () => clearTimeout(timer);
  }, []);
  
  if (!gameState) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Загрузка...</div>
      </div>
    );
  }
  
  const game = gameRef.current!;
  
  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* Three.js контейнер */}
      <div ref={containerRef} className="absolute inset-0" />
      
      {/* HUD */}
      <HUD gameState={gameState} />
      
      {/* Прицел */}
      <Crosshair />
      
      {/* Уведомление */}
      {gameState.notification && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-lg border border-cyan-500/50 text-lg animate-pulse">
          {gameState.notification}
        </div>
      )}
      
      {/* Подсказки управления */}
      {showControls && (
        <div className="absolute bottom-4 left-4 bg-black/70 text-white p-4 rounded-lg text-sm max-w-xs">
          <h3 className="text-cyan-400 font-bold mb-2">Управление:</h3>
          <p>WASD — ходьба | Мышь — обзор</p>
          <p>B — магазин | TAB — инвентарь</p>
          <p>O — заказы | E — взаимодействие</p>
          <p>R — открыть корпус | Q — на стол</p>
          <p>P — вкл/выкл ПК | Z — BIOS</p>
          <p>] — сброс прогресса</p>
        </div>
      )}
      
      {/* Магазин */}
      {gameState.showShop && (
        <ShopPanel 
          gameState={gameState} 
          game={game}
          onClose={() => { game.showShop = false; }}
        />
      )}
      
      {/* Инвентарь */}
      {gameState.showInventory && (
        <InventoryPanel 
          gameState={gameState} 
          game={game}
          onClose={() => { game.showInventory = false; }}
        />
      )}
      
      {/* Заказы */}
      {gameState.showOrders && (
        <OrdersPanel 
          gameState={gameState} 
          game={game}
          onClose={() => { game.showOrders = false; }}
        />
      )}
      
      {/* BIOS */}
      {gameState.showBIOS && (
        <BIOSPanel 
          gameState={gameState} 
          game={game}
          onClose={() => { game.showBIOS = false; }}
        />
      )}
      
      {/* Рабочий стол */}
      {gameState.showDesktop && (
        <DesktopPanel 
          gameState={gameState} 
          game={game}
          onClose={() => { game.showDesktop = false; }}
        />
      )}
    </div>
  );
}

// ============================================
// HUD (информация на экране)
// ============================================
function HUD({ gameState }: { gameState: any }) {
  return (
    <div className="absolute top-0 left-0 right-0 pointer-events-none">
      {/* Верхняя панель */}
      <div className="flex justify-between items-start p-4">
        {/* Деньги и репутация */}
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
          <div className="text-green-400 text-lg font-bold">${gameState.money.toLocaleString()}</div>
          <div className="text-yellow-400 text-sm">⭐ Репутация: {gameState.reputation}</div>
          <div className="text-gray-400 text-xs">Выполнено заказов: {gameState.completedOrders}</div>
        </div>
        
        {/* Статус ПК */}
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
          <div className="text-white text-sm">
            {gameState.pcState.caseComponent ? (
              <>
                <div className="text-cyan-400">🖥️ {gameState.pcState.caseComponent.name}</div>
                <div className={gameState.pcState.isRunning ? 'text-green-400' : 'text-gray-400'}>
                  {gameState.pcState.isRunning ? '● Включён' : '○ Выключен'}
                </div>
                {gameState.pcState.isRunning && (
                  <div className="text-orange-400 text-xs">🌡️ {Math.round(gameState.pcState.temperature)}°C</div>
                )}
                {gameState.pcState.osInstalled && (
                  <div className="text-blue-400 text-xs">
                    ОС: {OPERATING_SYSTEMS.find(o => o.id === gameState.pcState.osInstalled)?.name}
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-500">Нет корпуса</div>
            )}
          </div>
        </div>
        
        {/* Текущий заказ */}
        {gameState.currentOrder && (
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-yellow-700 max-w-xs">
            <div className="text-yellow-400 text-sm font-bold">📋 {gameState.currentOrder.title}</div>
            <div className="text-gray-300 text-xs mt-1">Бюджет: ${gameState.currentOrder.budget}</div>
            <div className="text-gray-400 text-xs">Дедлайн: {gameState.currentOrder.deadline} мин</div>
          </div>
        )}
      </div>
      
      {/* Держимый предмет */}
      {gameState.heldItem && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/80 border border-cyan-500 rounded-lg px-4 py-2">
          <div className="text-cyan-400 text-sm">
            В руках: {gameState.heldItem.component?.name || gameState.heldItem.peripheral?.name}
          </div>
          <div className="text-gray-400 text-xs">E — поставить | Клик — бросить</div>
        </div>
      )}
    </div>
  );
}

// Прицел
function Crosshair() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <div className="w-4 h-4 border-2 border-white/50 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white/80 rounded-full" />
    </div>
  );
}

// ============================================
// ПАНЕЛЬ МАГАЗИНА
// ============================================
function ShopPanel({ gameState, game, onClose }: { gameState: any; game: Game; onClose: () => void }) {
  const [category, setCategory] = useState('cpu');
  
  const getItems = () => {
    const cat = SHOP_CATEGORIES.find(c => c.id === category);
    if (!cat) return [];
    
    if (typeof cat.type === 'string' && cat.type.startsWith('peripheral_')) {
      const pType = cat.type.replace('peripheral_', '') as PeripheralType;
      return ALL_PERIPHERALS.filter(p => p.type === pType);
    }
    return ALL_COMPONENTS.filter(c => c.type === cat.type);
  };
  
  const items = getItems();
  
  return (
    <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl border border-gray-700 w-[90vw] max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Заголовок */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">🏪 Магазин комплектующих</h2>
          <div className="flex items-center gap-4">
            <span className="text-green-400 text-lg font-bold">${gameState.money.toLocaleString()}</span>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Категории */}
          <div className="w-48 border-r border-gray-700 overflow-y-auto p-2">
            {SHOP_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm mb-1 ${
                  category === cat.id ? 'bg-cyan-700 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          
          {/* Товары */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((item: any) => (
                <div key={item.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-cyan-600 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">{item.name}</div>
                      <div className="text-gray-400 text-xs mt-1">{item.description}</div>
                      <div className="flex gap-2 mt-2">
                        <span className="text-cyan-400 text-xs">⚡{item.performance}</span>
                        {item.power > 0 && <span className="text-yellow-400 text-xs">⚡{item.power}W</span>}
                        {item.isRetro && <span className="text-orange-400 text-xs">🕹️ Ретро</span>}
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <div className="text-green-400 font-bold">${item.price}</div>
                      <button
                        onClick={() => {
                          if (item.type in PeripheralType || Object.values(PeripheralType).includes(item.type)) {
                            game.buyPeripheral(item as Peripheral);
                          } else {
                            game.buyComponent(item as Component);
                          }
                        }}
                        className="mt-2 bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded text-xs"
                        disabled={gameState.money < item.price}
                      >
                        Купить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ПАНЕЛЬ ИНВЕНТАРЯ
// ============================================
function InventoryPanel({ gameState, game, onClose }: { gameState: any; game: Game; onClose: () => void }) {
  return (
    <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl border border-gray-700 w-[80vw] max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">🎒 Инвентарь</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {/* Комплектующие */}
          <h3 className="text-cyan-400 font-bold mb-2">Комплектующие ({gameState.inventory.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {gameState.inventory.map((comp: Component, idx: number) => (
              <button
                key={comp.id + idx}
                onClick={() => game.takeItemFromInventory(idx, false)}
                className="bg-gray-800 rounded p-2 border border-gray-700 hover:border-cyan-500 text-left"
              >
                <div className="text-white text-xs font-medium truncate">{comp.name}</div>
                <div className="text-gray-400 text-xs">{comp.type}</div>
              </button>
            ))}
            {gameState.inventory.length === 0 && (
              <div className="text-gray-500 col-span-4 text-center py-4">Пусто. Купите детали в магазине (B).</div>
            )}
          </div>
          
          {/* Периферия */}
          <h3 className="text-purple-400 font-bold mb-2">Периферия ({gameState.peripheralInventory.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {gameState.peripheralInventory.map((per: Peripheral, idx: number) => (
              <button
                key={per.id + idx}
                onClick={() => game.takeItemFromInventory(idx, true)}
                className="bg-gray-800 rounded p-2 border border-gray-700 hover:border-purple-500 text-left"
              >
                <div className="text-white text-xs font-medium truncate">{per.name}</div>
                <div className="text-gray-400 text-xs">{per.type}</div>
              </button>
            ))}
            {gameState.peripheralInventory.length === 0 && (
              <div className="text-gray-500 col-span-4 text-center py-4">Пусто.</div>
            )}
          </div>
          
          {/* Установленные компоненты */}
          {gameState.pcState.caseComponent && (
            <>
              <h3 className="text-green-400 font-bold mb-2 mt-6">Установлено в ПК:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(gameState.pcState.installedComponents).map(([slot, data]: [string, any]) => (
                  <div key={slot} className="bg-gray-800 rounded p-2 border border-green-700">
                    <div className="text-green-300 text-xs font-medium">{data.component.name}</div>
                    <div className="text-gray-500 text-xs">{slot}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {/* Действия */}
          <div className="mt-6 flex gap-3">
            {gameState.heldItem && (
              <button
                onClick={() => game.dropHeldItem()}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
              >
                Вернуть предмет в инвентарь
              </button>
            )}
            {gameState.pcState.caseComponent && gameState.pcState.isOnTable && (
              <button
                onClick={() => game.submitPC()}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
              >
                📦 Сдать ПК по заказу
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ПАНЕЛЬ ЗАКАЗОВ
// ============================================
function OrdersPanel({ gameState, game, onClose }: { gameState: any; game: Game; onClose: () => void }) {
  // Генерируем заказы при первом открытии если их нет
  if (gameState.orders.length === 0) {
    game.generateNewOrders();
  }
  const orders: Order[] = gameState.orders;
  
  return (
    <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl border border-gray-700 w-[80vw] max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">📋 Заказы</h2>
          <div className="flex gap-3">
            <button
              onClick={() => game.generateNewOrders()}
              className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
            >
              🔄 Обновить
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {/* Текущий заказ */}
          {gameState.currentOrder && (
            <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 mb-4">
              <div className="text-yellow-400 font-bold">Активный заказ: {gameState.currentOrder.title}</div>
              <div className="text-gray-300 text-sm mt-1">{gameState.currentOrder.description}</div>
            </div>
          )}
          
          {/* Доступные заказы */}
          <div className="space-y-3">
            {orders.map((order: Order) => (
              <div key={order.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-white font-bold">
                      {order.isServer ? '🖥️' : '💻'} {order.title}
                    </div>
                    <div className="text-gray-300 text-sm mt-1">{order.description}</div>
                    <div className="flex gap-3 mt-2 text-xs">
                      <span className="text-green-400">💰 ${order.budget}</span>
                      <span className="text-cyan-400">⚡ Мин. {order.requirements.minPerformance}</span>
                      <span className="text-yellow-400">⏱️ {order.deadline} мин</span>
                      {order.requirements.overclocking && <span className="text-red-400">🔥 Разгон нужен</span>}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      Приложения: {order.requirements.apps.join(', ')}
                    </div>
                  </div>
                  <button
                    onClick={() => game.takeOrder(order)}
                    disabled={!!gameState.currentOrder}
                    className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-500 text-white px-4 py-2 rounded text-sm"
                  >
                    Взять
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ПАНЕЛЬ BIOS
// ============================================
function BIOSPanel({ gameState, game, onClose }: { gameState: any; game: Game; onClose: () => void }) {
  return (
    <div className="absolute inset-0 bg-blue-900/95 flex items-center justify-center z-50 font-mono">
      <div className="bg-blue-950 border-2 border-blue-400 rounded w-[700px] max-h-[500px] overflow-hidden">
        <div className="bg-blue-800 p-2 text-center text-white font-bold">
          BIOS SETUP UTILITY v2.0
        </div>
        <div className="p-6 text-blue-200">
          <div className="mb-6">
            <h3 className="text-yellow-400 mb-2">═══ Настройки ═══</h3>
            
            {/* EXPO/XMP */}
            <div className="flex justify-between items-center py-2 border-b border-blue-800">
              <span>EXPO / XMP Profile</span>
              <button
                onClick={() => { gameState.pcState.xmpEnabled = !gameState.pcState.xmpEnabled; }}
                className={`px-3 py-1 rounded text-sm ${gameState.pcState.xmpEnabled ? 'bg-green-600' : 'bg-gray-700'}`}
              >
                {gameState.pcState.xmpEnabled ? 'ВКЛ' : 'ВЫКЛ'}
              </button>
            </div>
            
            {/* Разгон CPU */}
            <div className="flex justify-between items-center py-2 border-b border-blue-800">
              <span>CPU Overclocking</span>
              <button
                onClick={() => { gameState.pcState.overclocking = !gameState.pcState.overclocking; }}
                className={`px-3 py-1 rounded text-sm ${gameState.pcState.overclocking ? 'bg-red-600' : 'bg-gray-700'}`}
              >
                {gameState.pcState.overclocking ? 'ВКЛ' : 'ВЫКЛ'}
              </button>
            </div>
            
            {/* Настройка кулера */}
            <div className="flex justify-between items-center py-2 border-b border-blue-800">
              <span>Fan Speed</span>
              <span className="text-green-400">
                {gameState.pcState.installedComponents['cooler']?.component?.performance || 0}%
              </span>
            </div>
            
            {/* Информация */}
            <div className="mt-4 text-sm text-blue-400">
              <p>CPU: {gameState.pcState.installedComponents['cpu']?.component?.name || 'Не установлен'}</p>
              <p>RAM: {gameState.pcState.installedComponents['ram']?.component?.name || 'Не установлена'}</p>
              <p>Температура: {Math.round(gameState.pcState.temperature)}°C</p>
            </div>
          </div>
          
          <div className="text-center text-blue-400 text-sm mt-4">
            Нажмите Z или ESC для выхода
          </div>
        </div>
        <div className="bg-blue-800 p-2 text-center text-blue-300 text-xs">
          ↑↓ - выбор | Enter - изменить | ESC - выход
        </div>
      </div>
    </div>
  );
}

// ============================================
// РАБОЧИЙ СТОЛ (после установки ОС)
// ============================================
function DesktopPanel({ gameState, game, onClose }: { gameState: any; game: Game; onClose: () => void }) {
  const os = OPERATING_SYSTEMS.find(o => o.id === gameState.pcState.osInstalled);
  
  return (
    <div className="absolute inset-0 z-50 flex flex-col" style={{
      background: gameState.pcState.osInstalled === 'ubuntu' 
        ? 'linear-gradient(135deg, #2c001e 0%, #4a0033 100%)'
        : gameState.pcState.osInstalled === 'win95'
        ? '#008080'
        : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    }}>
      {/* Панель задач */}
      <div className={`p-2 flex justify-between items-center ${
        gameState.pcState.osInstalled === 'ubuntu' ? 'bg-black/80' :
        gameState.pcState.osInstalled === 'win95' ? 'bg-gray-400' :
        'bg-black/50 backdrop-blur'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{os?.icon}</span>
          <span className="text-white text-sm font-medium">{os?.name}</span>
        </div>
        <div className="text-white/70 text-xs">
          🌡️ {Math.round(gameState.pcState.temperature)}°C | 
          ⚡ {gameState.pcState.overclocking ? 'OC' : 'Stock'} |
          💾 {gameState.pcState.xmpEnabled ? 'XMP' : 'Auto'}
        </div>
        <button onClick={onClose} className="text-white/70 hover:text-white text-sm px-2">
          ✕ Закрыть
        </button>
      </div>
      
      {/* Рабочий стол */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
          {/* Приложения */}
          {gameState.pcState.installedApps.map((appId: string) => {
            const app = APPS.find(a => a.id === appId);
            if (!app) return null;
            return (
              <div key={appId} className="flex flex-col items-center gap-1 cursor-pointer hover:bg-white/10 rounded-lg p-2">
                <span className="text-3xl">{app.icon}</span>
                <span className="text-white text-xs text-center">{app.name}</span>
              </div>
            );
          })}
          
          {/* Кнопка установки приложений */}
          <div className="col-span-4 md:col-span-6 mt-4">
            <h3 className="text-white/70 text-sm mb-2">📦 Установить приложения:</h3>
            <div className="flex flex-wrap gap-2">
              {APPS.filter(a => !gameState.pcState.installedApps.includes(a.id)).map(app => (
                <button
                  key={app.id}
                  onClick={() => game.installApp(app.id)}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                >
                  <span>{app.icon}</span>
                  <span>{app.name}</span>
                  {app.price > 0 && <span className="text-green-400">${app.price}</span>}
                </button>
              ))}
            </div>
          </div>
          
          {/* Установка ОС (если не установлена) */}
          {!gameState.pcState.osInstalled && (
            <div className="col-span-4 md:col-span-6 mt-6">
              <h3 className="text-white text-lg mb-3">💿 Установите операционную систему:</h3>
              <div className="flex flex-wrap gap-3">
                {OPERATING_SYSTEMS.map(osys => (
                  <button
                    key={osys.id}
                    onClick={() => game.installOS(osys.id)}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-3 rounded-lg flex items-center gap-2"
                  >
                    <span className="text-2xl">{osys.icon}</span>
                    <div className="text-left">
                      <div className="text-sm font-medium">{osys.name}</div>
                      <div className="text-xs text-green-400">{osys.price === 0 ? 'Бесплатно' : `$${osys.price}`}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Нижняя панель */}
      <div className="bg-black/50 p-2 flex justify-between items-center">
        <div className="text-white/50 text-xs">
          PC Builder Simulator | Репутация: {gameState.reputation} | Заказов: {gameState.completedOrders}
        </div>
        <div className="text-white/50 text-xs">
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

export default App;
