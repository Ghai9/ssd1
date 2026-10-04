// ============================================
// МИР: комната, мебель, процедурные текстуры
// ============================================

import * as THREE from 'three';
import { PhysicsWorld, createRoomCollisions, createTableCollision, createShelfCollision } from './Physics';

// ============================================
// ПРОЦЕДУРНЫЕ ТЕКСТУРЫ через Canvas
// ============================================

function createCanvasTexture(width: number, height: number, drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  drawFn(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Текстура чёрных обоев
function createWallpaperTexture(): THREE.CanvasTexture {
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, w, h);
    // Тонкий узор
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, h);
      ctx.stroke();
    }
    for (let j = 0; j < h; j += 32) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(w, j);
      ctx.stroke();
    }
  });
}

// Текстура белого ламината
function createLaminateTexture(): THREE.CanvasTexture {
  return createCanvasTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#e8e4df';
    ctx.fillRect(0, 0, w, h);
    // Доски ламината
    const boardHeight = 64;
    for (let y = 0; y < h; y += boardHeight) {
      const offset = (Math.floor(y / boardHeight) % 2) * (w / 3);
      for (let x = -w; x < w * 2; x += w / 2) {
        ctx.strokeStyle = '#ccc8c0';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + offset, y, w / 2, boardHeight);
        // Текстура дерева
        ctx.fillStyle = `rgba(180, 170, 155, ${Math.random() * 0.1})`;
        ctx.fillRect(x + offset + 2, y + 2, w / 2 - 4, boardHeight - 4);
        // Линии дерева
        for (let l = 0; l < 3; l++) {
          ctx.strokeStyle = `rgba(160, 150, 135, ${Math.random() * 0.15})`;
          ctx.beginPath();
          ctx.moveTo(x + offset + Math.random() * w / 2, y);
          ctx.lineTo(x + offset + Math.random() * w / 2, y + boardHeight);
          ctx.stroke();
        }
      }
    }
  });
}

// Текстура потолка
function createCeilingTexture(): THREE.CanvasTexture {
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, w, h);
    // Лёгкая текстура
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.02})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, Math.random() * 20, Math.random() * 20);
    }
  });
}

// Текстура дерева (для стола)
function createWoodTexture(): THREE.CanvasTexture {
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#5c3a1e';
    ctx.fillRect(0, 0, w, h);
    // Годовые кольца
    for (let i = 0; i < 30; i++) {
      ctx.strokeStyle = `rgba(80, 50, 20, ${0.1 + Math.random() * 0.2})`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      const y = Math.random() * h;
      ctx.moveTo(0, y);
      for (let x = 0; x < w; x += 10) {
        ctx.lineTo(x, y + Math.sin(x * 0.02) * 5 + Math.random() * 3);
      }
      ctx.stroke();
    }
  });
}

// Текстура металла
function createMetalTexture(): THREE.CanvasTexture {
  return createCanvasTexture(128, 128, (ctx, w, h) => {
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(0, 0, w, h);
    // Шлифовка
    for (let i = 0; i < 100; i++) {
      ctx.strokeStyle = `rgba(100, 100, 100, ${Math.random() * 0.3})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      const y = Math.random() * h;
      ctx.moveTo(0, y);
      ctx.lineTo(w, y + (Math.random() - 0.5) * 2);
      ctx.stroke();
    }
  });
}

// Текстура пластика
function createPlasticTexture(baseColor: string): THREE.CanvasTexture {
  return createCanvasTexture(64, 64, (ctx, w, h) => {
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, w, h);
    // Лёгкая зернистость
    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.03})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
    }
  });
}

// Текстура ковра
function createCarpetTexture(): THREE.CanvasTexture {
  return createCanvasTexture(128, 128, (ctx, w, h) => {
    ctx.fillStyle = '#2a1a2a';
    ctx.fillRect(0, 0, w, h);
    // Ворс
    for (let x = 0; x < w; x += 2) {
      for (let y = 0; y < h; y += 2) {
        ctx.fillStyle = `rgba(${40 + Math.random() * 20}, ${20 + Math.random() * 15}, ${40 + Math.random() * 20}, 0.5)`;
        ctx.fillRect(x, y, 2, 2);
      }
    }
  });
}

// ============================================
// СОЗДАНИЕ КОМНАТЫ
// ============================================

export interface RoomObjects {
  group: THREE.Group;
  table: THREE.Mesh;
  chair: THREE.Mesh;
  shelf: THREE.Mesh;
  door: THREE.Mesh;
  lightSwitch: THREE.Mesh;
  chandelier: THREE.Group;
  carpet: THREE.Mesh;
  // Позиции для коллизий
  tablePos: THREE.Vector3;
  tableSize: THREE.Vector3;
  shelfPos: THREE.Vector3;
  shelfSize: THREE.Vector3;
}

export function createRoom(scene: THREE.Scene, physicsWorld: PhysicsWorld): RoomObjects {
  const roomWidth = 8;
  const roomDepth = 6;
  const roomHeight = 3;
  const wallThickness = 0.2;
  
  const group = new THREE.Group();
  
  // Текстуры
  const wallTex = createWallpaperTexture();
  wallTex.repeat.set(4, 2);
  const floorTex = createLaminateTexture();
  floorTex.repeat.set(4, 3);
  const ceilTex = createCeilingTexture();
  ceilTex.repeat.set(4, 3);
  
  // Пол
  const floorGeo = new THREE.PlaneGeometry(roomWidth, roomDepth);
  const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.7 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  group.add(floor);
  
  // Потолок
  const ceilGeo = new THREE.PlaneGeometry(roomWidth, roomDepth);
  const ceilMat = new THREE.MeshStandardMaterial({ map: ceilTex, roughness: 0.9 });
  const ceiling = new THREE.Mesh(ceilGeo, ceilMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = roomHeight;
  group.add(ceiling);
  
  // Стены
  const wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.8 });
  
  // Северная стена
  const wallN = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, roomHeight, wallThickness), wallMat);
  wallN.position.set(0, roomHeight / 2, -roomDepth / 2);
  wallN.receiveShadow = true;
  group.add(wallN);
  
  // Западная стена
  const wallW = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, roomHeight, roomDepth), wallMat);
  wallW.position.set(-roomWidth / 2, roomHeight / 2, 0);
  wallW.receiveShadow = true;
  group.add(wallW);
  
  // Восточная стена
  const wallE = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, roomHeight, roomDepth), wallMat);
  wallE.position.set(roomWidth / 2, roomHeight / 2, 0);
  wallE.receiveShadow = true;
  group.add(wallE);
  
  // Южная стена (с дверным проёмом)
  const doorWidth = 1.0;
  const doorHeight = 2.2;
  // Левая часть
  const wallSL = new THREE.Mesh(
    new THREE.BoxGeometry((roomWidth - doorWidth) / 2, roomHeight, wallThickness), wallMat
  );
  wallSL.position.set(-(doorWidth / 2 + (roomWidth - doorWidth) / 4), roomHeight / 2, roomDepth / 2);
  wallSL.receiveShadow = true;
  group.add(wallSL);
  // Правая часть
  const wallSR = new THREE.Mesh(
    new THREE.BoxGeometry((roomWidth - doorWidth) / 2, roomHeight, wallThickness), wallMat
  );
  wallSR.position.set(doorWidth / 2 + (roomWidth - doorWidth) / 4, roomHeight / 2, roomDepth / 2);
  wallSR.receiveShadow = true;
  group.add(wallSR);
  // Над дверью
  const wallST = new THREE.Mesh(
    new THREE.BoxGeometry(doorWidth, roomHeight - doorHeight, wallThickness), wallMat
  );
  wallST.position.set(0, doorHeight + (roomHeight - doorHeight) / 2, roomDepth / 2);
  group.add(wallST);
  
  // Дверь
  const woodTex = createWoodTexture();
  const doorMat = new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.6 });
  const door = new THREE.Mesh(new THREE.BoxGeometry(doorWidth, doorHeight, 0.05), doorMat);
  door.position.set(0, doorHeight / 2, roomDepth / 2 - 0.03);
  door.castShadow = true;
  door.name = 'door';
  group.add(door);
  
  // Ручка двери
  const handleMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 });
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 8), handleMat);
  handle.rotation.x = Math.PI / 2;
  handle.position.set(0.35, 1.0, roomDepth / 2 - 0.06);
  group.add(handle);
  
  // Выключатель света (рядом с дверью)
  const switchMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.3 });
  const lightSwitch = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.02), switchMat);
  lightSwitch.position.set(doorWidth / 2 + 0.3, 1.2, roomDepth / 2 - 0.11);
  lightSwitch.name = 'lightSwitch';
  group.add(lightSwitch);
  
  // ============================================
  // СТОЛ (рабочий)
  // ============================================
  const tableW = 1.6, tableD = 0.7, tableH = 0.75, tableThick = 0.04;
  const tableLegH = tableH - tableThick;
  const tablePos = new THREE.Vector3(0, 0, -roomDepth / 2 + 1.0);
  const tableSize = new THREE.Vector3(tableW, tableH, tableD);
  
  // Столешница
  const tableMat = new THREE.MeshStandardMaterial({ map: woodTex.clone(), roughness: 0.5 });
  const tableTop = new THREE.Mesh(new THREE.BoxGeometry(tableW, tableThick, tableD), tableMat);
  tableTop.position.set(tablePos.x, tableH - tableThick / 2, tablePos.z);
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  tableTop.name = 'table';
  group.add(tableTop);
  
  // Ножки стола
  const legMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5 });
  const legGeo = new THREE.BoxGeometry(0.04, tableLegH, 0.04);
  const legPositions = [
    [-tableW / 2 + 0.05, tableLegH / 2, -tableD / 2 + 0.05],
    [tableW / 2 - 0.05, tableLegH / 2, -tableD / 2 + 0.05],
    [-tableW / 2 + 0.05, tableLegH / 2, tableD / 2 - 0.05],
    [tableW / 2 - 0.05, tableLegH / 2, tableD / 2 - 0.05],
  ];
  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(tablePos.x + x, y, tablePos.z + z);
    leg.castShadow = true;
    group.add(leg);
  });
  
  // ============================================
  // СТУЛ
  // ============================================
  const chairMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.7 });
  const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.05, 0.45), chairMat);
  chairSeat.position.set(tablePos.x, 0.45, tablePos.z + 0.8);
  chairSeat.castShadow = true;
  chairSeat.name = 'chair';
  group.add(chairSeat);
  
  // Спинка стула
  const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.5, 0.04), chairMat);
  chairBack.position.set(tablePos.x, 0.7, tablePos.z + 1.0);
  chairBack.castShadow = true;
  group.add(chairBack);
  
  // Ножки стула
  const chairLegGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.45, 6);
  [[-0.18, 0.225, -0.18], [0.18, 0.225, -0.18], [-0.18, 0.225, 0.18], [0.18, 0.225, 0.18]].forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(chairLegGeo, legMat);
    leg.position.set(tablePos.x + x, y, tablePos.z + 0.8 + z);
    group.add(leg);
  });
  
  // ============================================
  // ПОЛКА (для деталей)
  // ============================================
  const shelfW = 1.2, shelfD = 0.3, shelfH = 0.03;
  const shelfY = 1.2;
  const shelfX = -roomWidth / 2 + 0.8;
  const shelfZ = 0;
  const shelfPos = new THREE.Vector3(shelfX, shelfY, shelfZ);
  const shelfSize = new THREE.Vector3(shelfW, shelfH, shelfD);
  
  const shelfMat = new THREE.MeshStandardMaterial({ map: woodTex.clone(), roughness: 0.5 });
  const shelf = new THREE.Mesh(new THREE.BoxGeometry(shelfW, shelfH, shelfD), shelfMat);
  shelf.position.copy(shelfPos);
  shelf.castShadow = true;
  shelf.receiveShadow = true;
  shelf.name = 'shelf';
  group.add(shelf);
  
  // Кронштейны полки
  const bracketMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.7 });
  [-0.4, 0.4].forEach(offsetX => {
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.15, shelfD - 0.05), bracketMat);
    bracket.position.set(shelfX + offsetX, shelfY - 0.08, shelfZ);
    group.add(bracket);
  });
  
  // Вторая полка
  const shelf2 = new THREE.Mesh(new THREE.BoxGeometry(shelfW, shelfH, shelfD), shelfMat.clone());
  shelf2.position.set(shelfX, shelfY + 0.5, shelfZ);
  shelf2.castShadow = true;
  shelf2.receiveShadow = true;
  group.add(shelf2);
  
  // ============================================
  // ЛЮСТРА
  // ============================================
  const chandelier = new THREE.Group();
  chandelier.name = 'chandelier';
  
  // Основание
  const chanBaseMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
  const chanBase = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.05, 16), chanBaseMat);
  chanBase.position.y = roomHeight - 0.025;
  chandelier.add(chanBase);
  
  // Стержень
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.3, 8), chanBaseMat);
  rod.position.y = roomHeight - 0.2;
  chandelier.add(rod);
  
  // Плафон
  const shadeMat = new THREE.MeshStandardMaterial({ 
    color: 0xffffee, emissive: 0xffffaa, emissiveIntensity: 0.5, 
    transparent: true, opacity: 0.8 
  });
  const shade = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 12), shadeMat);
  shade.position.y = roomHeight - 0.4;
  chandelier.add(shade);
  
  group.add(chandelier);
  
  // ============================================
  // КОВЁР
  // ============================================
  const carpetTex = createCarpetTexture();
  carpetTex.repeat.set(2, 2);
  const carpetMat = new THREE.MeshStandardMaterial({ map: carpetTex, roughness: 0.95 });
  const carpet = new THREE.Mesh(new THREE.PlaneGeometry(3, 2), carpetMat);
  carpet.rotation.x = -Math.PI / 2;
  carpet.position.set(0, 0.005, 1);
  carpet.receiveShadow = true;
  carpet.name = 'carpet';
  group.add(carpet);
  
  // ============================================
  // КОЛЛИЗИИ
  // ============================================
  createRoomCollisions(physicsWorld, roomWidth, roomDepth, roomHeight, wallThickness);
  
  // Стол
  createTableCollision(physicsWorld, 'table', 
    new THREE.Vector3(tablePos.x, tableH / 2, tablePos.z), 
    new THREE.Vector3(tableW, tableH, tableD)
  );
  
  // Стул
  createTableCollision(physicsWorld, 'chair',
    new THREE.Vector3(tablePos.x, 0.25, tablePos.z + 0.8),
    new THREE.Vector3(0.45, 0.5, 0.45)
  );
  
  // Полка
  createShelfCollision(physicsWorld, 'shelf',
    new THREE.Vector3(shelfX, shelfY, shelfZ),
    new THREE.Vector3(shelfW, shelfH + 0.15, shelfD)
  );
  
  scene.add(group);
  
  return {
    group,
    table: tableTop,
    chair: chairSeat,
    shelf: shelf,
    door: door,
    lightSwitch: lightSwitch,
    chandelier: chandelier,
    carpet: carpet,
    tablePos: new THREE.Vector3(tablePos.x, tableH, tablePos.z),
    tableSize: new THREE.Vector3(tableW, tableThick, tableD),
    shelfPos: shelfPos.clone(),
    shelfSize: new THREE.Vector3(shelfW, shelfH, shelfD),
  };
}

// ============================================
// СОЗДАНИЕ 3D МОДЕЛЕЙ КОМПЛЕКТУЮЩИХ
// ============================================

export function createComponentMesh(type: string, color: number, size: [number, number, number]): THREE.Group {
  const group = new THREE.Group();
  const metalTex = createMetalTexture();
  const plasticTex = createPlasticTexture('#1a1a1a');
  
  switch (type) {
    case 'cpu': {
      // Процессор - квадратная микросхема
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(size[0], size[1], size[2]),
        new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.3 })
      );
      body.castShadow = true;
      group.add(body);
      // Теплораспределительная крышка
      const ihs = new THREE.Mesh(
        new THREE.BoxGeometry(size[0] * 0.8, size[1] * 0.3, size[2] * 0.8),
        new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.1 })
      );
      ihs.position.y = size[1] * 0.4;
      group.add(ihs);
      break;
    }
    case 'gpu': {
      // Видеокарта - длинная плата с кулерами
      const pcb = new THREE.Mesh(
        new THREE.BoxGeometry(size[0], size[1], size[2]),
        new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 })
      );
      pcb.castShadow = true;
      group.add(pcb);
      // Кулеры
      const fanMat = new THREE.MeshStandardMaterial({ color, metalness: 0.5 });
      for (let i = 0; i < 3; i++) {
        const fan = new THREE.Mesh(
          new THREE.CylinderGeometry(size[2] * 0.35, size[2] * 0.35, 0.01, 12),
          fanMat
        );
        fan.position.set(-size[0] * 0.3 + i * size[0] * 0.3, -size[1] * 0.3, 0);
        fan.rotation.x = Math.PI / 2;
        group.add(fan);
      }
      // Бэкплейт
      const backplate = new THREE.Mesh(
        new THREE.BoxGeometry(size[0] * 0.95, 0.005, size[2] * 0.95),
        new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.6 })
      );
      backplate.position.y = size[1] * 0.4;
      group.add(backplate);
      break;
    }
    case 'ram': {
      // ОЗУ - длинная планка с радиатором
      const stick = new THREE.Mesh(
        new THREE.BoxGeometry(size[0], size[1], size[2]),
        new THREE.MeshStandardMaterial({ color, roughness: 0.4 })
      );
      stick.castShadow = true;
      group.add(stick);
      // Чипы
      for (let i = 0; i < 8; i++) {
        const chip = new THREE.Mesh(
          new THREE.BoxGeometry(0.012, size[1] * 0.6, size[2] * 0.8),
          new THREE.MeshStandardMaterial({ color: 0x222222 })
        );
        chip.position.set(-size[0] * 0.4 + i * size[0] * 0.11, 0, 0);
        group.add(chip);
      }
      break;
    }
    case 'psu': {
      // Блок питания - коробка с вентилятором
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(size[0], size[1], size[2]),
        new THREE.MeshStandardMaterial({ color, roughness: 0.5 })
      );
      box.castShadow = true;
      group.add(box);
      // Вентилятор
      const fan = new THREE.Mesh(
        new THREE.CylinderGeometry(size[1] * 0.35, size[1] * 0.35, 0.01, 12),
        new THREE.MeshStandardMaterial({ color: 0x333333 })
      );
      fan.position.set(0, 0, size[2] * 0.45);
      fan.rotation.x = Math.PI / 2;
      group.add(fan);
      // Решётка
      const grill = new THREE.Mesh(
        new THREE.BoxGeometry(size[0] * 0.8, size[1] * 0.8, 0.005),
        new THREE.MeshStandardMaterial({ color: 0x222222, wireframe: true })
      );
      grill.position.set(0, 0, size[2] * 0.5);
      group.add(grill);
      break;
    }
    case 'storage': {
      // Накопитель
      if (size[1] < 0.01) {
        // NVMe - маленькая плата
        const pcb = new THREE.Mesh(
          new THREE.BoxGeometry(size[0], size[1], size[2]),
          new THREE.MeshStandardMaterial({ color: 0x006600, roughness: 0.5 })
        );
        pcb.castShadow = true;
        group.add(pcb);
        // Чип
        const chip = new THREE.Mesh(
          new THREE.BoxGeometry(size[0] * 0.4, size[1] * 2, size[2] * 0.6),
          new THREE.MeshStandardMaterial({ color, metalness: 0.5 })
        );
        chip.position.y = size[1];
        group.add(chip);
      } else {
        // HDD/SSD 2.5" - коробка
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(size[0], size[1], size[2]),
          new THREE.MeshStandardMaterial({ color, roughness: 0.4 })
        );
        box.castShadow = true;
        group.add(box);
        // Этикетка
        const label = new THREE.Mesh(
          new THREE.PlaneGeometry(size[0] * 0.8, size[2] * 0.6),
          new THREE.MeshStandardMaterial({ color: 0xffffff })
        );
        label.position.y = size[1] * 0.51;
        label.rotation.x = -Math.PI / 2;
        group.add(label);
      }
      break;
    }
    case 'cooler': {
      // Кулер
      if (size[2] < 0.05) {
        // СЖО - радиатор
        const radiator = new THREE.Mesh(
          new THREE.BoxGeometry(size[0], size[1], size[2]),
          new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6 })
        );
        radiator.castShadow = true;
        group.add(radiator);
        // Вентиляторы
        for (let i = 0; i < 2; i++) {
          const fan = new THREE.Mesh(
            new THREE.CylinderGeometry(size[1] * 0.4, size[1] * 0.4, size[2] * 0.3, 12),
            new THREE.MeshStandardMaterial({ color: 0x333333 })
          );
          fan.position.set(-size[0] * 0.25 + i * size[0] * 0.5, 0, 0);
          fan.rotation.x = Math.PI / 2;
          group.add(fan);
        }
      } else {
        // Башенный кулер
        const base = new THREE.Mesh(
          new THREE.BoxGeometry(size[0] * 0.5, 0.01, size[2] * 0.5),
          new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8 })
        );
        group.add(base);
        // Радиатор (пластины)
        for (let i = 0; i < 15; i++) {
          const fin = new THREE.Mesh(
            new THREE.BoxGeometry(size[0], 0.002, size[2]),
            new THREE.MeshStandardMaterial({ color, metalness: 0.6 })
          );
          fin.position.y = 0.02 + i * (size[1] / 15);
          group.add(fin);
        }
        // Тепловые трубки
        for (let i = 0; i < 4; i++) {
          const pipe = new THREE.Mesh(
            new THREE.CylinderGeometry(0.004, 0.004, size[1], 6),
            new THREE.MeshStandardMaterial({ color: 0xcc8844, metalness: 0.9 })
          );
          pipe.position.set(-size[0] * 0.15 + i * size[0] * 0.1, size[1] * 0.5, 0);
          group.add(pipe);
        }
      }
      break;
    }
    case 'motherboard': {
      // Материнская плата
      const pcb = new THREE.Mesh(
        new THREE.BoxGeometry(size[0], size[1], size[2]),
        new THREE.MeshStandardMaterial({ color: 0x006600, roughness: 0.6 })
      );
      pcb.castShadow = true;
      group.add(pcb);
      // Сокет CPU
      const socket = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.01, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7 })
      );
      socket.position.set(-size[0] * 0.15, size[1] * 0.6, -size[2] * 0.1);
      group.add(socket);
      // Слоты RAM
      for (let i = 0; i < 4; i++) {
        const slot = new THREE.Mesh(
          new THREE.BoxGeometry(0.005, 0.015, size[2] * 0.6),
          new THREE.MeshStandardMaterial({ color: 0x333333 })
        );
        slot.position.set(size[0] * 0.1 + i * 0.015, size[1] * 0.6, -size[2] * 0.05);
        group.add(slot);
      }
      // Слот PCIe
      const pcie = new THREE.Mesh(
        new THREE.BoxGeometry(size[0] * 0.6, 0.01, 0.008),
        new THREE.MeshStandardMaterial({ color: 0x111111 })
      );
      pcie.position.set(0, size[1] * 0.6, size[2] * 0.2);
      group.add(pcie);
      // Чипсет
      const chipset = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.01, 0.03),
        new THREE.MeshStandardMaterial({ color: 0x222222 })
      );
      chipset.position.set(size[0] * 0.1, size[1] * 0.6, size[2] * 0.1);
      group.add(chipset);
      break;
    }
    case 'case': {
      // Корпус ПК
      const caseMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.3 });
      // Основная коробка
      const body = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), caseMat);
      body.castShadow = true;
      group.add(body);
      // Стекло (боковая панель)
      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(0.005, size[1] * 0.8, size[2] * 0.8),
        new THREE.MeshStandardMaterial({ color: 0x444466, transparent: true, opacity: 0.3, metalness: 0.9 })
      );
      glass.position.x = size[0] * 0.5;
      group.add(glass);
      // Передняя панель с кнопкой питания
      const btn = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.01, 0.005, 8),
        new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 0.5 })
      );
      btn.rotation.z = Math.PI / 2;
      btn.position.set(size[0] * 0.5, size[1] * 0.4, 0);
      btn.name = 'powerButton';
      group.add(btn);
      break;
    }
    case 'sound_card':
    case 'network_card': {
      // Плата расширения
      const pcb = new THREE.Mesh(
        new THREE.BoxGeometry(size[0], size[1], size[2]),
        new THREE.MeshStandardMaterial({ color: 0x006600, roughness: 0.5 })
      );
      pcb.castShadow = true;
      group.add(pcb);
      // Заглушка
      const bracket = new THREE.Mesh(
        new THREE.BoxGeometry(0.002, size[1] * 3, size[2] * 0.3),
        new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7 })
      );
      bracket.position.set(-size[0] * 0.5, size[1], 0);
      group.add(bracket);
      break;
    }
    case 'cd_rom': {
      // CD-ROM привод
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(size[0], size[1], size[2]),
        new THREE.MeshStandardMaterial({ color, roughness: 0.4 })
      );
      box.castShadow = true;
      group.add(box);
      // Лоток
      const tray = new THREE.Mesh(
        new THREE.BoxGeometry(size[0] * 0.9, size[1] * 0.1, 0.005),
        new THREE.MeshStandardMaterial({ color: 0x222222 })
      );
      tray.position.set(0, 0, size[2] * 0.5);
      group.add(tray);
      // Кнопка
      const btn = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, 0.008, 0.005),
        new THREE.MeshStandardMaterial({ color: 0xcccccc })
      );
      btn.position.set(size[0] * 0.35, -size[1] * 0.3, size[2] * 0.5);
      group.add(btn);
      break;
    }
    case 'thermal_paste': {
      // Тюбик термопасты
      const tube = new THREE.Mesh(
        new THREE.CylinderGeometry(size[0] * 0.4, size[0] * 0.4, size[1], 8),
        new THREE.MeshStandardMaterial({ color, roughness: 0.5 })
      );
      tube.castShadow = true;
      group.add(tube);
      // Крышка
      const cap = new THREE.Mesh(
        new THREE.ConeGeometry(size[0] * 0.2, size[1] * 0.2, 8),
        new THREE.MeshStandardMaterial({ color: 0x333333 })
      );
      cap.position.y = size[1] * 0.5;
      group.add(cap);
      break;
    }
    default: {
      // Дефолтная коробка
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(size[0], size[1], size[2]),
        new THREE.MeshStandardMaterial({ color, roughness: 0.5 })
      );
      box.castShadow = true;
      group.add(box);
    }
  }
  
  return group;
}

// ============================================
// СОЗДАНИЕ ПЕРИФЕРИИ
// ============================================

export function createPeripheralMesh(type: string, color: number, size: [number, number, number]): THREE.Group {
  const group = new THREE.Group();
  
  switch (type) {
    case 'mouse': {
      const body = new THREE.Mesh(
        new THREE.SphereGeometry(size[2] * 0.4, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5),
        new THREE.MeshStandardMaterial({ color, roughness: 0.3 })
      );
      body.scale.set(0.7, 0.5, 1);
      body.castShadow = true;
      group.add(body);
      // Колёсико
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.005, 0.01, 8),
        new THREE.MeshStandardMaterial({ color: 0x666666 })
      );
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(0, size[1] * 0.3, -size[2] * 0.15);
      group.add(wheel);
      break;
    }
    case 'keyboard': {
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(size[0], size[1], size[2]),
        new THREE.MeshStandardMaterial({ color, roughness: 0.4 })
      );
      base.castShadow = true;
      group.add(base);
      // Клавиши
      const keyMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5 });
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 15; col++) {
          const key = new THREE.Mesh(
            new THREE.BoxGeometry(size[0] / 16, size[1] * 0.5, size[2] / 6),
            keyMat
          );
          key.position.set(
            -size[0] * 0.45 + col * (size[0] / 15),
            size[1] * 0.5,
            -size[2] * 0.4 + row * (size[2] / 5)
          );
          group.add(key);
        }
      }
      break;
    }
    case 'monitor': {
      // Экран
      const screen = new THREE.Mesh(
        new THREE.BoxGeometry(size[0], size[1], 0.03),
        new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 })
      );
      screen.castShadow = true;
      group.add(screen);
      // Дисплей
      const display = new THREE.Mesh(
        new THREE.PlaneGeometry(size[0] * 0.9, size[1] * 0.85),
        new THREE.MeshStandardMaterial({ color: 0x000022, emissive: 0x001133, emissiveIntensity: 0.3 })
      );
      display.position.z = 0.016;
      group.add(display);
      // Подставка
      const stand = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, size[1] * 0.3, 0.05),
        new THREE.MeshStandardMaterial({ color, metalness: 0.5 })
      );
      stand.position.set(0, -size[1] * 0.5, -0.05);
      group.add(stand);
      // База
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.12, 0.02, 16),
        new THREE.MeshStandardMaterial({ color, metalness: 0.5 })
      );
      base.position.set(0, -size[1] * 0.65, -0.05);
      group.add(base);
      break;
    }
    case 'headphones': {
      // Дужка
      const curve = new THREE.TorusGeometry(size[0] * 0.4, 0.008, 8, 16, Math.PI);
      const band = new THREE.Mesh(curve, new THREE.MeshStandardMaterial({ color, roughness: 0.4 }));
      band.rotation.x = Math.PI;
      band.position.y = size[1] * 0.2;
      group.add(band);
      // Чашки
      [-1, 1].forEach(side => {
        const cup = new THREE.Mesh(
          new THREE.CylinderGeometry(size[0] * 0.15, size[0] * 0.15, size[2], 12),
          new THREE.MeshStandardMaterial({ color, roughness: 0.3 })
        );
        cup.rotation.z = Math.PI / 2;
        cup.position.set(side * size[0] * 0.35, 0, 0);
        group.add(cup);
      });
      break;
    }
    case 'mousepad': {
      const pad = new THREE.Mesh(
        new THREE.BoxGeometry(size[0], size[1], size[2]),
        new THREE.MeshStandardMaterial({ color, roughness: 0.9 })
      );
      pad.receiveShadow = true;
      group.add(pad);
      break;
    }
    case 'microphone': {
      // Тело микрофона
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(size[0] * 0.4, size[0] * 0.4, size[1] * 0.6, 12),
        new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.4 })
      );
      body.position.y = size[1] * 0.3;
      body.castShadow = true;
      group.add(body);
      // Сетка
      const grill = new THREE.Mesh(
        new THREE.SphereGeometry(size[0] * 0.4, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5),
        new THREE.MeshStandardMaterial({ color: 0x444444, wireframe: true })
      );
      grill.position.y = size[1] * 0.6;
      group.add(grill);
      // Подставка
      const stand = new THREE.Mesh(
        new THREE.CylinderGeometry(size[0] * 0.6, size[0] * 0.6, 0.02, 12),
        new THREE.MeshStandardMaterial({ color: 0x222222 })
      );
      group.add(stand);
      break;
    }
    case 'speakers': {
      // Две колонки
      [-1, 1].forEach(side => {
        const spk = new THREE.Mesh(
          new THREE.BoxGeometry(size[0] * 0.4, size[1], size[2]),
          new THREE.MeshStandardMaterial({ color, roughness: 0.5 })
        );
        spk.position.set(side * size[0] * 0.3, size[1] * 0.5, 0);
        spk.castShadow = true;
        group.add(spk);
        // Динамик
        const driver = new THREE.Mesh(
          new THREE.CylinderGeometry(size[1] * 0.2, size[1] * 0.2, 0.01, 12),
          new THREE.MeshStandardMaterial({ color: 0x222222 })
        );
        driver.rotation.x = Math.PI / 2;
        driver.position.set(side * size[0] * 0.3, size[1] * 0.5, size[2] * 0.5);
        group.add(driver);
      });
      break;
    }
    default: {
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(size[0], size[1], size[2]),
        new THREE.MeshStandardMaterial({ color, roughness: 0.5 })
      );
      box.castShadow = true;
      group.add(box);
    }
  }
  
  return group;
}
