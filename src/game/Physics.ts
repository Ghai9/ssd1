// ============================================
// ФИЗИКА И КОЛЛИЗИИ: AABB система
// ============================================

import * as THREE from 'three';

// AABB (Axis-Aligned Bounding Box)
export interface AABB {
  min: THREE.Vector3;
  max: THREE.Vector3;
}

// Создание AABB из позиции и размера
export function createAABB(position: THREE.Vector3, size: THREE.Vector3): AABB {
  const halfSize = size.clone().multiplyScalar(0.5);
  return {
    min: position.clone().sub(halfSize),
    max: position.clone().add(halfSize),
  };
}

// Проверка пересечения двух AABB
export function aabbIntersect(a: AABB, b: AABB): boolean {
  return (
    a.min.x <= b.max.x && a.max.x >= b.min.x &&
    a.min.y <= b.max.y && a.max.y >= b.min.y &&
    a.min.z <= b.max.z && a.max.z >= b.min.z
  );
}

// Получить точку проникновения (наименьшее перекрытие)
export function getPenetration(a: AABB, b: AABB): THREE.Vector3 {
  const overlapX = Math.min(a.max.x - b.min.x, b.max.x - a.min.x);
  const overlapY = Math.min(a.max.y - b.min.y, b.max.y - a.min.y);
  const overlapZ = Math.min(a.max.z - b.min.z, b.max.z - a.min.z);
  
  const centerA = new THREE.Vector3().addVectors(a.min, a.max).multiplyScalar(0.5);
  const centerB = new THREE.Vector3().addVectors(b.min, b.max).multiplyScalar(0.5);
  
  const pen = new THREE.Vector3();
  
  if (overlapX < overlapY && overlapX < overlapZ) {
    pen.x = centerA.x < centerB.x ? -overlapX : overlapX;
  } else if (overlapY < overlapZ) {
    pen.y = centerA.y < centerB.y ? -overlapY : overlapY;
  } else {
    pen.z = centerA.z < centerB.z ? -overlapZ : overlapZ;
  }
  
  return pen;
}

// Коллизионный объект
export interface CollisionObject {
  id: string;
  aabb: AABB;
  isStatic: boolean; // не двигается
  isFloor: boolean;
  isWall: boolean;
  isTable: boolean;
  surfaceHeight?: number; // высота поверхности (для стола)
}

// Физический мир
export class PhysicsWorld {
  objects: CollisionObject[] = [];
  gravity = -9.81;
  
  // Добавить объект
  addObject(obj: CollisionObject) {
    this.objects.push(obj);
  }
  
  // Удалить объект
  removeObject(id: string) {
    this.objects = this.objects.filter(o => o.id !== id);
  }
  
  // Обновить AABB объекта
  updateObjectAABB(id: string, position: THREE.Vector3, size: THREE.Vector3) {
    const obj = this.objects.find(o => o.id === id);
    if (obj) {
      obj.aabb = createAABB(position, size);
    }
  }
  
  // Проверка коллизии игрока со стенами
  // Возвращает скорректированную позицию
  checkPlayerCollision(
    playerPos: THREE.Vector3,
    playerRadius: number,
    playerHeight: number
  ): THREE.Vector3 {
    const newPos = playerPos.clone();
    const playerAABB: AABB = {
      min: new THREE.Vector3(
        newPos.x - playerRadius,
        newPos.y,
        newPos.z - playerRadius
      ),
      max: new THREE.Vector3(
        newPos.x + playerRadius,
        newPos.y + playerHeight,
        newPos.z + playerRadius
      ),
    };
    
    for (const obj of this.objects) {
      if (obj.isFloor) continue; // Пол не блокирует движение
      
      if (aabbIntersect(playerAABB, obj.aabb)) {
        const pen = getPenetration(playerAABB, obj.aabb);
        
        // Если столкновение по Y - не корректируем (гравитация обработает)
        if (Math.abs(pen.y) > Math.abs(pen.x) && Math.abs(pen.y) > Math.abs(pen.z)) {
          continue;
        }
        
        // Корректируем позицию
        newPos.x += pen.x;
        newPos.z += pen.z;
        
        // Обновляем AABB
        playerAABB.min.x = newPos.x - playerRadius;
        playerAABB.max.x = newPos.x + playerRadius;
        playerAABB.min.z = newPos.z - playerRadius;
        playerAABB.max.z = newPos.z + playerRadius;
      }
    }
    
    return newPos;
  }
  
  // Проверка: стоит ли игрок на полу или на поверхности
  checkGrounded(playerPos: THREE.Vector3, playerRadius: number): { grounded: boolean; groundY: number } {
    let groundY = 0; // пол
    let grounded = false;
    
    const feetAABB: AABB = {
      min: new THREE.Vector3(playerPos.x - playerRadius, playerPos.y - 0.1, playerPos.z - playerRadius),
      max: new THREE.Vector3(playerPos.x + playerRadius, playerPos.y + 0.05, playerPos.z + playerRadius),
    };
    
    for (const obj of this.objects) {
      if (obj.isFloor) {
        grounded = true;
        groundY = Math.max(groundY, obj.aabb.max.y);
        continue;
      }
      
      if (obj.surfaceHeight !== undefined && aabbIntersect(feetAABB, obj.aabb)) {
        if (obj.aabb.max.y > groundY && playerPos.y >= obj.aabb.max.y - 0.2) {
          groundY = obj.aabb.max.y;
          grounded = true;
        }
      }
    }
    
    return { grounded, groundY };
  }
  
  // Проверка коллизии падающего объекта
  checkFallingObject(
    objPos: THREE.Vector3,
    objSize: THREE.Vector3
  ): { grounded: boolean; groundY: number } {
    const objAABB: AABB = {
      min: new THREE.Vector3(
        objPos.x - objSize.x * 0.5,
        objPos.y - objSize.y * 0.5,
        objPos.z - objSize.z * 0.5
      ),
      max: new THREE.Vector3(
        objPos.x + objSize.x * 0.5,
        objPos.y + objSize.y * 0.5,
        objPos.z + objSize.z * 0.5
      ),
    };
    
    let groundY = 0;
    let grounded = false;
    
    for (const obj of this.objects) {
      if (obj.isFloor) {
        grounded = true;
        groundY = Math.max(groundY, obj.aabb.max.y);
        continue;
      }
      
      if (aabbIntersect(objAABB, obj.aabb)) {
        if (obj.aabb.max.y > groundY) {
          groundY = obj.aabb.max.y;
          grounded = true;
        }
      }
    }
    
    return { grounded, groundY };
  }
  
  // Проверка: можно ли поставить корпус на стол
  canPlaceOnTable(tablePos: THREE.Vector3, tableSize: THREE.Vector3, caseSize: THREE.Vector3, casePos: THREE.Vector3): boolean {
    // Проверяем, что корпус над столом
    const tableTop = tablePos.y + tableSize.y * 0.5;
    const tableMinX = tablePos.x - tableSize.x * 0.5;
    const tableMaxX = tablePos.x + tableSize.x * 0.5;
    const tableMinZ = tablePos.z - tableSize.z * 0.5;
    const tableMaxZ = tablePos.z + tableSize.z * 0.5;
    
    return (
      casePos.x >= tableMinX && casePos.x <= tableMaxX &&
      casePos.z >= tableMinZ && casePos.z <= tableMaxZ &&
      Math.abs(casePos.y - (tableTop + caseSize.y * 0.5)) < 0.5
    );
  }
}

// Создание стен комнаты
export function createRoomCollisions(world: PhysicsWorld, roomWidth: number, roomDepth: number, roomHeight: number, wallThickness: number) {
  const hw = roomWidth / 2;
  const hd = roomDepth / 2;
  const hh = roomHeight / 2;
  const wt = wallThickness;
  
  // Пол
  world.addObject({
    id: 'floor',
    aabb: createAABB(new THREE.Vector3(0, -0.05, 0), new THREE.Vector3(roomWidth, 0.1, roomDepth)),
    isStatic: true,
    isFloor: true,
    isWall: false,
    isTable: false,
  });
  
  // Стена северная (Z-)
  world.addObject({
    id: 'wall_north',
    aabb: createAABB(new THREE.Vector3(0, hh, -hd - wt/2), new THREE.Vector3(roomWidth + wt*2, roomHeight, wt)),
    isStatic: true,
    isFloor: false,
    isWall: true,
    isTable: false,
  });
  
  // Стена южная (Z+) - с проёмом для двери
  // Левая часть
  world.addObject({
    id: 'wall_south_left',
    aabb: createAABB(new THREE.Vector3(-hw/2 - 0.5, hh, hd + wt/2), new THREE.Vector3(hw - 0.5, roomHeight, wt)),
    isStatic: true,
    isFloor: false,
    isWall: true,
    isTable: false,
  });
  // Правая часть
  world.addObject({
    id: 'wall_south_right',
    aabb: createAABB(new THREE.Vector3(hw/2 + 0.5, hh, hd + wt/2), new THREE.Vector3(hw - 0.5, roomHeight, wt)),
    isStatic: true,
    isFloor: false,
    isWall: true,
    isTable: false,
  });
  // Над дверью
  world.addObject({
    id: 'wall_south_top',
    aabb: createAABB(new THREE.Vector3(0, roomHeight - 0.3, hd + wt/2), new THREE.Vector3(1.2, 0.6, wt)),
    isStatic: true,
    isFloor: false,
    isWall: true,
    isTable: false,
  });
  
  // Стена западная (X-)
  world.addObject({
    id: 'wall_west',
    aabb: createAABB(new THREE.Vector3(-hw - wt/2, hh, 0), new THREE.Vector3(wt, roomHeight, roomDepth + wt*2)),
    isStatic: true,
    isFloor: false,
    isWall: true,
    isTable: false,
  });
  
  // Стена восточная (X+)
  world.addObject({
    id: 'wall_east',
    aabb: createAABB(new THREE.Vector3(hw + wt/2, hh, 0), new THREE.Vector3(wt, roomHeight, roomDepth + wt*2)),
    isStatic: true,
    isFloor: false,
    isWall: true,
    isTable: false,
  });
  
  // Потолок
  world.addObject({
    id: 'ceiling',
    aabb: createAABB(new THREE.Vector3(0, roomHeight + 0.05, 0), new THREE.Vector3(roomWidth, 0.1, roomDepth)),
    isStatic: true,
    isFloor: false,
    isWall: false,
    isTable: false,
  });
}

// Создание коллизии стола
export function createTableCollision(world: PhysicsWorld, id: string, position: THREE.Vector3, size: THREE.Vector3) {
  world.addObject({
    id: id,
    aabb: createAABB(position, size),
    isStatic: true,
    isFloor: false,
    isWall: false,
    isTable: true,
    surfaceHeight: position.y + size.y * 0.5,
  });
}

// Создание коллизии полки
export function createShelfCollision(world: PhysicsWorld, id: string, position: THREE.Vector3, size: THREE.Vector3) {
  world.addObject({
    id: id,
    aabb: createAABB(position, size),
    isStatic: true,
    isFloor: false,
    isWall: false,
    isTable: false,
    surfaceHeight: position.y + size.y * 0.5,
  });
}
