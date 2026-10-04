// ============================================
// ОСНОВНОЙ ДВИЖОК ИГРЫ
// ============================================

import * as THREE from 'three';
import { PhysicsWorld } from './Physics';
import { createRoom, createComponentMesh, createPeripheralMesh, RoomObjects } from './World';
import { 
  ALL_COMPONENTS, ALL_PERIPHERALS, Component, Peripheral, 
  ComponentType, PeripheralType, Order, generateOrder,
  OPERATING_SYSTEMS, APPS
} from './Data';
import { audioSystem } from './Audio';
import { SaveData, saveGame, loadGame, deleteSave, DEFAULT_SAVE } from './Save';

// ============================================
// ТИПЫ И ИНТЕРФЕЙСЫ
// ============================================

interface HeldItem {
  component?: Component;
  peripheral?: Peripheral;
  mesh: THREE.Group;
}

interface ShelfItem {
  id: string;
  mesh: THREE.Group;
  component?: Component;
  peripheral?: Peripheral;
  position: THREE.Vector3;
}

interface PCState {
  caseComponent: Component | null;
  caseMesh: THREE.Group | null;
  installedComponents: Record<string, { component: Component; mesh: THREE.Group }>;
  isOpen: boolean;
  isOnTable: boolean;
  isRunning: boolean;
  osInstalled: string | null;
  installedApps: string[];
  overclocking: boolean;
  xmpEnabled: boolean;
  temperature: number;
}

// ============================================
// ГЛАВНЫЙ КЛАСС ИГРЫ
// ============================================

export class Game {
  // Three.js
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private clock: THREE.Clock;
  
  // Освещение
  private dirLight: THREE.DirectionalLight;
  private ambientLight: THREE.AmbientLight;
  private hemiLight: THREE.HemisphereLight;
  private pointLight: THREE.PointLight;
  private lightOn = true;
  
  // Физика
  private physicsWorld: PhysicsWorld;
  
  // Комната
  private roomObjects: RoomObjects | null = null;
  
  // Игрок
  private playerPos = new THREE.Vector3(0, 1.7, 2);
  private playerVel = new THREE.Vector3();
  private playerRadius = 0.4;
  private playerHeight = 1.7;
  private yaw = 0;
  private pitch = 0;
  private isGrounded = true;
  private moveSpeed = 3.0;
  
  // Управление
  private keys: Record<string, boolean> = {};
  private isPointerLocked = false;
  
  // Инвентарь
  private heldItem: HeldItem | null = null;
  private inventory: Component[] = [];
  private peripheralInventory: Peripheral[] = [];
  
  // Полка (визуальные объекты на полке)
  private shelfItems: ShelfItem[] = [];
  
  // ПК
  public pcState: PCState = {
    caseComponent: null,
    caseMesh: null,
    installedComponents: {},
    isOpen: false,
    isOnTable: false,
    isRunning: false,
    osInstalled: null,
    installedApps: [],
    overclocking: false,
    xmpEnabled: false,
    temperature: 25,
  };
  
  // Заказ
  private currentOrder: Order | null = null;
  private orders: Order[] = [];
  
  // Экономика
  private money = 5000;
  private reputation = 0;
  private completedOrders = 0;
  private totalEarnings = 0;
  
  // UI состояние (public для доступа из React UI)
  public showShop = false;
  public showInventory = false;
  public showOrders = false;
  public showBIOS = false;
  public showOS = false;
  public showDesktop = false;
  public shopCategory = 'cpu';
  private notification = '';
  private notificationTimer = 0;
  
  // Частицы
  private particles: THREE.Points | null = null;
  private particlePositions: Float32Array | null = null;
  
  // Время
  private gameTime = 0;
  
  // Сохранение
  private saveData: SaveData;
  
  // Контейнер для UI
  private container: HTMLElement;
  
  constructor(container: HTMLElement) {
    this.container = container;
    
    // Загрузка сохранения
    this.saveData = loadGame();
    this.money = this.saveData.money;
    this.reputation = this.saveData.reputation;
    this.completedOrders = this.saveData.completedOrders;
    this.totalEarnings = this.saveData.totalEarnings;
    this.lightOn = this.saveData.lightOn;
    this.gameTime = this.saveData.gameTime;
    
    // Восстановление инвентаря
    this.saveData.inventory.forEach(id => {
      const comp = ALL_COMPONENTS.find(c => c.id === id);
      if (comp) this.inventory.push(comp);
    });
    this.saveData.peripheralInventory.forEach(id => {
      const per = ALL_PERIPHERALS.find(p => p.id === id);
      if (per) this.peripheralInventory.push(per);
    });
    
    // Восстановление заказа
    if (this.saveData.currentOrder) {
      this.currentOrder = this.saveData.currentOrder;
    }
    
    // Three.js инициализация
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x111111, 5, 15);
    this.scene.background = new THREE.Color(0x111111);
    
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.copy(this.playerPos);
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    container.appendChild(this.renderer.domElement);
    
    this.clock = new THREE.Clock();
    
    // Физика
    this.physicsWorld = new PhysicsWorld();
    
    // Освещение
    this.dirLight = new THREE.DirectionalLight(0xffeedd, 0.5);
    this.dirLight.position.set(2, 4, 1);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 0.1;
    this.dirLight.shadow.camera.far = 10;
    this.dirLight.shadow.camera.left = -5;
    this.dirLight.shadow.camera.right = 5;
    this.dirLight.shadow.camera.top = 5;
    this.dirLight.shadow.camera.bottom = -5;
    this.scene.add(this.dirLight);
    
    this.ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    this.scene.add(this.ambientLight);
    
    this.hemiLight = new THREE.HemisphereLight(0x606080, 0x202020, 0.4);
    this.scene.add(this.hemiLight);
    
    this.pointLight = new THREE.PointLight(0xffffee, 1.5, 8);
    this.pointLight.position.set(0, 2.6, 0);
    this.pointLight.castShadow = true;
    this.pointLight.shadow.mapSize.width = 1024;
    this.pointLight.shadow.mapSize.height = 1024;
    this.scene.add(this.pointLight);
    
    // Создание мира
    this.roomObjects = createRoom(this.scene, this.physicsWorld);
    
    // Частицы пыли
    this.createDustParticles();
    
    // Восстановление ПК из сохранения
    if (this.saveData.pcAssembled && this.saveData.installedComponents) {
      // Восстановление состояния ПК будет в update
    }
    
    // Обработчики событий
    this.setupEventListeners();
    
    // Инициализация аудио при первом клике
    document.addEventListener('click', () => {
      audioSystem.init();
    }, { once: true });
    
    // Обновление освещения
    this.updateLighting();
    
    // Запуск игрового цикла
    this.animate();
  }
  
  // ============================================
  // ЧАСТИЦЫ ПЫЛИ
  // ============================================
  private createDustParticles() {
    const count = 200;
    const geometry = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i += 3) {
      this.particlePositions[i] = (Math.random() - 0.5) * 7;
      this.particlePositions[i + 1] = Math.random() * 2.8;
      this.particlePositions[i + 2] = (Math.random() - 0.5) * 5;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.01,
      transparent: true,
      opacity: 0.3,
    });
    
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }
  
  private updateParticles(delta: number) {
    if (!this.particlePositions) return;
    for (let i = 0; i < this.particlePositions.length; i += 3) {
      this.particlePositions[i] += Math.sin(this.gameTime + i) * 0.001;
      this.particlePositions[i + 1] += Math.sin(this.gameTime * 0.5 + i) * 0.0005;
      this.particlePositions[i + 2] += Math.cos(this.gameTime + i) * 0.001;
      
      // Границы комнаты
      if (Math.abs(this.particlePositions[i]) > 3.5) this.particlePositions[i] *= -0.9;
      if (this.particlePositions[i + 1] > 2.8) this.particlePositions[i + 1] = 0.1;
      if (this.particlePositions[i + 1] < 0) this.particlePositions[i + 1] = 2.7;
      if (Math.abs(this.particlePositions[i + 2]) > 2.5) this.particlePositions[i + 2] *= -0.9;
    }
    if (this.particles) {
      (this.particles.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
  }
  
  // ============================================
  // СОБЫТИЯ
  // ============================================
  private setupEventListeners() {
    // Клавиатура
    document.addEventListener('keydown', (e) => this.onKeyDown(e));
    document.addEventListener('keyup', (e) => this.onKeyUp(e));
    
    // Мышь
    this.renderer.domElement.addEventListener('click', () => {
      if (!this.showShop && !this.showInventory && !this.showOrders && !this.showBIOS && !this.showDesktop) {
        this.renderer.domElement.requestPointerLock();
      }
    });
    
    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === this.renderer.domElement;
    });
    
    document.addEventListener('mousemove', (e) => {
      if (this.isPointerLocked) {
        this.yaw -= e.movementX * 0.002;
        this.pitch -= e.movementY * 0.002;
        this.pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this.pitch));
      }
    });
    
    // Ресайз
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
  
  private onKeyDown(e: KeyboardEvent) {
    this.keys[e.code] = true;
    
    // B - магазин
    if (e.code === 'KeyB') {
      this.showShop = !this.showShop;
      if (this.showShop) {
        this.showInventory = false;
        this.showOrders = false;
        document.exitPointerLock();
      }
    }
    
    // TAB - инвентарь
    if (e.code === 'Tab') {
      e.preventDefault();
      this.showInventory = !this.showInventory;
      if (this.showInventory) {
        this.showShop = false;
        this.showOrders = false;
        document.exitPointerLock();
      }
    }
    
    // O - заказы
    if (e.code === 'KeyO') {
      this.showOrders = !this.showOrders;
      if (this.showOrders) {
        this.showShop = false;
        this.showInventory = false;
        document.exitPointerLock();
      }
    }
    
    // R - открыть/закрыть корпус
    if (e.code === 'KeyR') {
      if (this.pcState.caseMesh && this.pcState.isOnTable) {
        this.pcState.isOpen = !this.pcState.isOpen;
        this.showNotification(this.pcState.isOpen ? 'Корпус открыт' : 'Корпус закрыт');
      }
    }
    
    // P - включить/выключить ПК
    if (e.code === 'KeyP') {
      if (this.pcState.caseMesh && this.pcState.isOnTable) {
        this.togglePC();
      }
    }
    
    // Q - поставить корпус на стол
    if (e.code === 'KeyQ') {
      this.placeCaseOnTable();
    }
    
    // E - взаимодействие
    if (e.code === 'KeyE') {
      this.interact();
    }
    
    // Z - BIOS
    if (e.code === 'KeyZ') {
      if (this.pcState.isRunning && !this.showDesktop) {
        this.showBIOS = !this.showBIOS;
        document.exitPointerLock();
      }
    }
    
    // ] - сброс
    if (e.code === 'BracketRight') {
      if (confirm('Сбросить прогресс? Все данные будут потеряны!')) {
        deleteSave();
        location.reload();
      }
    }
    
    // Escape - закрыть меню
    if (e.code === 'Escape') {
      this.showShop = false;
      this.showInventory = false;
      this.showOrders = false;
      this.showBIOS = false;
      this.showDesktop = false;
    }
  }
  
  private onKeyUp(e: KeyboardEvent) {
    this.keys[e.code] = false;
  }
  
  // ============================================
  // ВЗАИМОДЕЙСТВИЕ (E)
  // ============================================
  private interact() {
    // Проверка: смотрим на выключатель?
    const lookDir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    const raycaster = new THREE.Raycaster(this.camera.position, lookDir, 0, 3);
    
    if (this.roomObjects) {
      const switchHits = raycaster.intersectObject(this.roomObjects.lightSwitch);
      if (switchHits.length > 0) {
        this.lightOn = !this.lightOn;
        this.updateLighting();
        this.showNotification(this.lightOn ? 'Свет включён' : 'Свет выключен');
        return;
      }
    }
    
    // Если держим предмет - поставить
    if (this.heldItem) {
      this.placeHeldItem();
      return;
    }
    
    // Подобрать предмет с полки
    this.pickFromShelf();
  }
  
  // ============================================
  // ДВИЖЕНИЕ ИГРОКА
  // ============================================
  private updatePlayer(delta: number) {
    if (this.showShop || this.showInventory || this.showOrders || this.showBIOS || this.showDesktop) return;
    
    // Направление движения
    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    
    const moveDir = new THREE.Vector3();
    if (this.keys['KeyW']) moveDir.add(forward);
    if (this.keys['KeyS']) moveDir.sub(forward);
    if (this.keys['KeyA']) moveDir.sub(right);
    if (this.keys['KeyD']) moveDir.add(right);
    
    if (moveDir.length() > 0) {
      moveDir.normalize();
      const speed = this.keys['ShiftLeft'] ? this.moveSpeed * 1.5 : this.moveSpeed;
      
      // Следующая позиция
      const nextPos = this.playerPos.clone().add(moveDir.clone().multiplyScalar(speed * delta));
      
      // Проверка коллизии
      const correctedPos = this.physicsWorld.checkPlayerCollision(nextPos, this.playerRadius, this.playerHeight);
      
      // Применяем только X и Z (Y обрабатывается гравитацией)
      this.playerPos.x = correctedPos.x;
      this.playerPos.z = correctedPos.z;
    }
    
    // Гравитация
    const ground = this.physicsWorld.checkGrounded(this.playerPos, this.playerRadius);
    if (ground.grounded) {
      this.playerVel.y = 0;
      this.playerPos.y = ground.groundY + this.playerHeight;
      this.isGrounded = true;
    } else {
      this.playerVel.y += this.physicsWorld.gravity * delta;
      this.playerPos.y += this.playerVel.y * delta;
      this.isGrounded = false;
    }
    
    // Обновление камеры
    this.camera.position.copy(this.playerPos);
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
  }
  
  // ============================================
  // ОСВЕЩЕНИЕ
  // ============================================
  private updateLighting() {
    if (this.lightOn) {
      this.pointLight.intensity = 1.5;
      this.ambientLight.intensity = 0.3;
    } else {
      this.pointLight.intensity = 0;
      this.ambientLight.intensity = 0.05;
    }
    
    // Обновление визуала люстры
    if (this.roomObjects) {
      const shade = this.roomObjects.chandelier.children.find(c => 
        (c as THREE.Mesh).material && ((c as THREE.Mesh).material as THREE.MeshStandardMaterial).emissive
      );
      if (shade) {
        const mat = (shade as THREE.Mesh).material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = this.lightOn ? 0.5 : 0;
      }
    }
  }
  
  // ============================================
  // ПОКУПКА И ИНВЕНТАРЬ
  // ============================================
  buyComponent(component: Component) {
    if (this.money >= component.price) {
      this.money -= component.price;
      this.inventory.push(component);
      audioSystem.playBuySound();
      this.showNotification(`Куплено: ${component.name} (-$${component.price})`);
      this.save();
    } else {
      this.showNotification('Недостаточно денег!');
      audioSystem.playErrorSound();
    }
  }
  
  buyPeripheral(peripheral: Peripheral) {
    if (this.money >= peripheral.price) {
      this.money -= peripheral.price;
      this.peripheralInventory.push(peripheral);
      audioSystem.playBuySound();
      this.showNotification(`Куплено: ${peripheral.name} (-$${peripheral.price})`);
      this.save();
    } else {
      this.showNotification('Недостаточно денег!');
      audioSystem.playErrorSound();
    }
  }
  
  // ============================================
  // ПОСТАВИТЬ ПРЕДМЕТ НА ПОЛКУ
  // ============================================
  private placeHeldItem() {
    if (!this.heldItem || !this.roomObjects) return;
    
    // Проверяем, смотрим ли на полку
    const lookDir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    const raycaster = new THREE.Raycaster(this.camera.position, lookDir, 0, 3);
    const hits = raycaster.intersectObject(this.roomObjects.shelf);
    
    if (hits.length > 0) {
      // Ставим на полку
      const pos = new THREE.Vector3(
        this.roomObjects.shelfPos.x + (Math.random() - 0.5) * 0.8,
        this.roomObjects.shelfPos.y + 0.05,
        this.roomObjects.shelfPos.z
      );
      
      this.heldItem.mesh.position.copy(pos);
      this.scene.add(this.heldItem.mesh);
      
      const shelfItem: ShelfItem = {
        id: this.heldItem.component?.id || this.heldItem.peripheral?.id || 'unknown',
        mesh: this.heldItem.mesh,
        component: this.heldItem.component,
        peripheral: this.heldItem.peripheral,
        position: pos.clone(),
      };
      this.shelfItems.push(shelfItem);
      
      audioSystem.playInsertSound();
      this.showNotification('Предмет поставлен на полку');
      this.heldItem = null;
    } else {
      // Бросаем на пол
      const pos = this.playerPos.clone();
      pos.y = 0.05;
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
      pos.add(forward.multiplyScalar(1));
      
      this.heldItem.mesh.position.copy(pos);
      this.scene.add(this.heldItem.mesh);
      this.heldItem = null;
    }
  }
  
  // Подобрать с полки
  private pickFromShelf() {
    if (!this.roomObjects) return;
    
    const lookDir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    const raycaster = new THREE.Raycaster(this.camera.position, lookDir, 0, 3);
    
    // Проверяем предметы на полке
    for (let i = this.shelfItems.length - 1; i >= 0; i--) {
      const item = this.shelfItems[i];
      const hits = raycaster.intersectObject(item.mesh, true);
      if (hits.length > 0) {
        // Подбираем
        this.scene.remove(item.mesh);
        this.heldItem = {
          component: item.component,
          peripheral: item.peripheral,
          mesh: item.mesh,
        };
        this.shelfItems.splice(i, 1);
        this.showNotification(`Взято: ${item.component?.name || item.peripheral?.name}`);
        return;
      }
    }
    
    // Проверяем ПК на столе
    if (this.pcState.caseMesh) {
      const hits = raycaster.intersectObject(this.pcState.caseMesh, true);
      if (hits.length > 0 && this.pcState.isOpen) {
        this.tryInstallComponent();
        return;
      }
    }
  }
  
  // ============================================
  // УСТАНОВКА КОМПЛЕКТУЮЩИХ В ПК
  // ============================================
  private tryInstallComponent() {
    if (!this.heldItem?.component || !this.pcState.caseMesh) return;
    
    const comp = this.heldItem.component;
    const slotType = this.getComponentSlotType(comp.type);
    
    // Проверяем, свободен ли слот
    if (this.pcState.installedComponents[slotType]) {
      this.showNotification(`Слот ${slotType} уже занят!`);
      audioSystem.playErrorSound();
      return;
    }
    
    // Проверяем совместимость
    if (!this.checkCompatibility(comp)) {
      this.showNotification('Несовместимый компонент!');
      audioSystem.playErrorSound();
      return;
    }
    
    // Устанавливаем
    const mesh = createComponentMesh(comp.type, comp.color, comp.size);
    const slotPos = this.getSlotPosition(slotType);
    mesh.position.copy(slotPos);
    mesh.scale.setScalar(0.5); // Масштаб внутри корпуса
    
    if (this.pcState.caseMesh) {
      this.pcState.caseMesh.add(mesh);
    }
    
    this.pcState.installedComponents[slotType] = { component: comp, mesh };
    
    // Убираем из инвентаря
    this.heldItem = null;
    
    audioSystem.playInsertSound();
    this.showNotification(`Установлено: ${comp.name}`);
    this.save();
  }
  
  private getComponentSlotType(type: ComponentType): string {
    switch (type) {
      case ComponentType.MOTHERBOARD: return 'motherboard';
      case ComponentType.CPU: return 'cpu';
      case ComponentType.COOLER: return 'cooler';
      case ComponentType.RAM: return 'ram';
      case ComponentType.GPU: return 'gpu';
      case ComponentType.PSU: return 'psu';
      case ComponentType.STORAGE: return 'storage';
      case ComponentType.SOUND_CARD: return 'sound_card';
      case ComponentType.NETWORK_CARD: return 'network_card';
      case ComponentType.CD_ROM: return 'cd_rom';
      case ComponentType.THERMAL_PASTE: return 'thermal_paste';
      default: return type;
    }
  }
  
  private getSlotPosition(slot: string): THREE.Vector3 {
    switch (slot) {
      case 'motherboard': return new THREE.Vector3(0, 0, -0.05);
      case 'cpu': return new THREE.Vector3(-0.05, 0.12, -0.04);
      case 'cooler': return new THREE.Vector3(-0.05, 0.2, -0.04);
      case 'ram': return new THREE.Vector3(0.08, 0.12, -0.04);
      case 'gpu': return new THREE.Vector3(0, -0.05, 0.05);
      case 'psu': return new THREE.Vector3(0, -0.2, 0);
      case 'storage': return new THREE.Vector3(0.12, -0.1, 0.05);
      case 'sound_card': return new THREE.Vector3(0.1, 0.05, 0.04);
      case 'network_card': return new THREE.Vector3(0.1, 0.0, 0.04);
      case 'cd_rom': return new THREE.Vector3(0, 0.15, 0.08);
      case 'thermal_paste': return new THREE.Vector3(-0.1, 0.15, 0);
      default: return new THREE.Vector3(0, 0, 0);
    }
  }
  
  private checkCompatibility(comp: Component): boolean {
    // Простая проверка: материнка должна быть установлена первой
    if (comp.type !== ComponentType.MOTHERBOARD && !this.pcState.installedComponents['motherboard']) {
      // Разрешаем, но предупреждаем
      return true;
    }
    return true;
  }
  
  // ============================================
  // КОРПУС
  // ============================================
  private placeCaseOnTable() {
    if (!this.roomObjects) return;
    
    // Если есть корпус на полке или в руках - ставим на стол
    if (this.pcState.caseMesh && !this.pcState.isOnTable) {
      this.pcState.caseMesh.position.set(
        this.roomObjects.tablePos.x + 0.3,
        this.roomObjects.tablePos.y + 0.15,
        this.roomObjects.tablePos.z
      );
      this.pcState.isOnTable = true;
      this.showNotification('Корпус поставлен на стол');
      return;
    }
    
    // Если держим корпус
    if (this.heldItem?.component?.type === ComponentType.CASE) {
      const caseComp = this.heldItem.component;
      const mesh = createComponentMesh('case', caseComp.color, caseComp.size);
      mesh.position.set(
        this.roomObjects.tablePos.x + 0.3,
        this.roomObjects.tablePos.y + caseComp.size[1] * 0.5,
        this.roomObjects.tablePos.z
      );
      this.scene.add(mesh);
      
      this.pcState.caseComponent = caseComp;
      this.pcState.caseMesh = mesh;
      this.pcState.isOnTable = true;
      this.heldItem = null;
      
      this.showNotification(`Корпус ${caseComp.name} установлен на стол`);
      audioSystem.playInsertSound();
      this.save();
    }
  }
  
  // ============================================
  // ВКЛЮЧЕНИЕ/ВЫКЛЮЧЕНИЕ ПК
  // ============================================
  private togglePC() {
    if (this.pcState.isRunning) {
      // Выключаем
      this.pcState.isRunning = false;
      this.showDesktop = false;
      this.showNotification('ПК выключен');
      audioSystem.stopFanSound();
    } else {
      // Проверяем, можно ли включить
      if (!this.pcState.installedComponents['motherboard']) {
        this.showNotification('Нет материнской платы!');
        audioSystem.playErrorSound();
        return;
      }
      if (!this.pcState.installedComponents['cpu']) {
        this.showNotification('Нет процессора!');
        audioSystem.playErrorSound();
        return;
      }
      if (!this.pcState.installedComponents['psu']) {
        this.showNotification('Нет блока питания!');
        audioSystem.playErrorSound();
        return;
      }
      
      // Включаем
      this.pcState.isRunning = true;
      audioSystem.playBootSound();
      
      // POST проверка
      setTimeout(() => {
        if (!this.pcState.installedComponents['ram']) {
          audioSystem.playErrorSound();
          this.showNotification('POST ERROR: Нет ОЗУ!');
          this.pcState.isRunning = false;
          return;
        }
        audioSystem.playPOSTBeep(1000, 0.1);
        
        // Если есть ОС - показываем рабочий стол
        if (this.pcState.osInstalled) {
          setTimeout(() => {
            this.showDesktop = true;
            document.exitPointerLock();
          }, 2000);
        }
      }, 1500);
      
      this.showNotification('ПК включён');
    }
    this.save();
  }
  
  // ============================================
  // ЗАКАЗЫ
  // ============================================
  takeOrder(order: Order) {
    this.currentOrder = order;
    this.showOrders = false;
    this.showNotification(`Заказ принят: ${order.title}`);
    this.save();
  }
  
  generateNewOrders(): Order[] {
    const orders: Order[] = [];
    for (let i = 0; i < 3; i++) {
      orders.push(generateOrder());
    }
    this.orders = orders;
    return orders;
  }
  
  submitPC() {
    if (!this.currentOrder) {
      this.showNotification('Нет активного заказа!');
      return;
    }
    
    if (!this.pcState.isRunning) {
      this.showNotification('ПК не включён!');
      return;
    }
    
    // Проверяем выполнение заказа
    const order = this.currentOrder;
    let totalPerf = 0;
    let componentCount = 0;
    
    for (const slot of Object.values(this.pcState.installedComponents)) {
      totalPerf += slot.component.performance;
      componentCount++;
    }
    
    const avgPerf = componentCount > 0 ? totalPerf / componentCount : 0;
    
    // Проверка требований
    const hasAllComponents = order.requirements.neededComponents.every(
      type => this.pcState.installedComponents[this.getComponentSlotType(type)]
    );
    
    if (!hasAllComponents) {
      this.showNotification('Не все необходимые компоненты установлены!');
      audioSystem.playErrorSound();
      return;
    }
    
    if (avgPerf < order.requirements.minPerformance) {
      this.showNotification(`Производительность слишком низкая! Нужно: ${order.requirements.minPerformance}, есть: ${Math.round(avgPerf)}`);
      audioSystem.playErrorSound();
      return;
    }
    
    // Успех!
    const qualityBonus = Math.min(1.5, avgPerf / order.requirements.minPerformance);
    const earnings = Math.floor(order.budget * (1 + order.bonus / 100 * qualityBonus));
    
    this.money += earnings;
    this.reputation += order.reputationReward;
    this.completedOrders++;
    this.totalEarnings += earnings;
    
    this.showNotification(`Заказ выполнен! +$${earnings} (бонус за качество: ${Math.round(qualityBonus * 100)}%)`);
    audioSystem.playBuySound();
    
    // Сброс ПК
    this.resetPC();
    this.currentOrder = null;
    this.save();
  }
  
  private resetPC() {
    // Удаляем визуальный корпус
    if (this.pcState.caseMesh) {
      this.scene.remove(this.pcState.caseMesh);
    }
    
    this.pcState = {
      caseComponent: null,
      caseMesh: null,
      installedComponents: {},
      isOpen: false,
      isOnTable: false,
      isRunning: false,
      osInstalled: null,
      installedApps: [],
      overclocking: false,
      xmpEnabled: false,
      temperature: 25,
    };
  }
  
  // ============================================
  // УСТАНОВКА ОС
  // ============================================
  installOS(osId: string) {
    const os = OPERATING_SYSTEMS.find(o => o.id === osId);
    if (!os) return;
    
    if (this.money < os.price) {
      this.showNotification('Недостаточно денег для установки ОС!');
      return;
    }
    
    if (!this.pcState.installedComponents['storage']) {
      this.showNotification('Нет накопителя для установки ОС!');
      return;
    }
    
    this.money -= os.price;
    this.pcState.osInstalled = osId;
    audioSystem.playInstallSound();
    this.showNotification(`${os.name} установлена!`);
    this.save();
  }
  
  installApp(appId: string) {
    const app = APPS.find(a => a.id === appId);
    if (!app) return;
    
    if (this.money < app.price) {
      this.showNotification('Недостаточно денег!');
      return;
    }
    
    if (this.pcState.installedApps.includes(appId)) {
      this.showNotification('Уже установлено!');
      return;
    }
    
    this.money -= app.price;
    this.pcState.installedApps.push(appId);
    this.showNotification(`${app.name} установлено!`);
    this.save();
  }
  
  // ============================================
  // УВЕДОМЛЕНИЯ
  // ============================================
  private showNotification(text: string) {
    this.notification = text;
    this.notificationTimer = 3;
  }
  
  // ============================================
  // СОХРАНЕНИЕ
  // ============================================
  private save() {
    this.saveData = {
      money: this.money,
      reputation: this.reputation,
      inventory: this.inventory.map(c => c.id),
      peripheralInventory: this.peripheralInventory.map(p => p.id),
      installedComponents: Object.fromEntries(
        Object.entries(this.pcState.installedComponents).map(([k, v]) => [k, v.component.id])
      ),
      currentOrder: this.currentOrder,
      completedOrders: this.completedOrders,
      totalEarnings: this.totalEarnings,
      lightOn: this.lightOn,
      pcAssembled: this.pcState.caseComponent !== null,
      pcRunning: this.pcState.isRunning,
      osInstalled: this.pcState.osInstalled,
      installedApps: this.pcState.installedApps,
      overclocking: this.pcState.overclocking,
      xmpEnabled: this.pcState.xmpEnabled,
      gameTime: this.gameTime,
    };
    saveGame(this.saveData);
  }
  
  // ============================================
  // ИГРОВОЙ ЦИКЛ
  // ============================================
  private animate() {
    requestAnimationFrame(() => this.animate());
    
    const delta = Math.min(this.clock.getDelta(), 0.1);
    this.gameTime += delta;
    
    // Обновление
    this.updatePlayer(delta);
    this.updateParticles(delta);
    
    // Уведомление
    if (this.notificationTimer > 0) {
      this.notificationTimer -= delta;
    }
    
    // Температура ПК
    if (this.pcState.isRunning) {
      const baseTemp = 35;
      const loadTemp = this.pcState.overclocking ? 20 : 10;
      const coolerBonus = this.pcState.installedComponents['cooler']?.component.performance || 0;
      this.pcState.temperature = baseTemp + loadTemp - coolerBonus * 0.2;
    }
    
    // Автосохранение каждые 30 секунд
    if (Math.floor(this.gameTime) % 30 === 0 && Math.floor(this.gameTime) > 0) {
      this.save();
    }
    
    // Рендер
    this.renderer.render(this.scene, this.camera);
  }
  
  // ============================================
  // ПУБЛИЧНЫЕ МЕТОДЫ ДЛЯ UI
  // ============================================
  getState() {
    return {
      money: this.money,
      reputation: this.reputation,
      completedOrders: this.completedOrders,
      inventory: this.inventory,
      peripheralInventory: this.peripheralInventory,
      heldItem: this.heldItem,
      pcState: this.pcState,
      currentOrder: this.currentOrder,
      orders: this.orders,
      showShop: this.showShop,
      showInventory: this.showInventory,
      showOrders: this.showOrders,
      showBIOS: this.showBIOS,
      showDesktop: this.showDesktop,
      shopCategory: this.shopCategory,
      notification: this.notificationTimer > 0 ? this.notification : '',
      lightOn: this.lightOn,
      gameTime: this.gameTime,
    };
  }
  
  setShopCategory(cat: string) {
    this.shopCategory = cat;
  }
  
  takeItemFromInventory(index: number, isPeripheral: boolean) {
    if (this.heldItem) {
      this.showNotification('Сначала поставьте текущий предмет!');
      return;
    }
    
    if (isPeripheral) {
      const per = this.peripheralInventory[index];
      if (per) {
        const mesh = createPeripheralMesh(per.type, per.color, per.size);
        this.heldItem = { peripheral: per, mesh };
        this.peripheralInventory.splice(index, 1);
        this.showNotification(`Взято: ${per.name}`);
      }
    } else {
      const comp = this.inventory[index];
      if (comp) {
        const mesh = createComponentMesh(comp.type, comp.color, comp.size);
        this.heldItem = { component: comp, mesh };
        this.inventory.splice(index, 1);
        this.showNotification(`Взято: ${comp.name}`);
      }
    }
  }
  
  dropHeldItem() {
    if (this.heldItem) {
      if (this.heldItem.component) {
        this.inventory.push(this.heldItem.component);
      } else if (this.heldItem.peripheral) {
        this.peripheralInventory.push(this.heldItem.peripheral);
      }
      this.heldItem = null;
      this.showNotification('Предмет возвращён в инвентарь');
    }
  }
}
