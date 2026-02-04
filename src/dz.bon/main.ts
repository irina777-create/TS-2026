// 1. Створіть тип FilterCallback. Функція, яка приймає value (строку або число) і повертає boolean.
// Використовуйте цей тип для параметра predicate у функції filterItems.

// TODO: Type FilterCallback here

// function filterItems(items: any, predicate: any): any { const result: any = [];
//   for (const item of items) { if (!predicate(item)) continue; result.push(item); } return
//   result; } const numbers = [1, 2, 3, 4, 5];
// const evenNumbers = filterItems(numbers, (x) => typeof x === 'number' && x % 2 === 0);

type FilterCallback = (value: string | number) => boolean;

function filterItems(
    items: (string | number)[],
    predicate: FilterCallback
): (string | number)[] {
    const result: (string | number)[] = [];

    for (const item of items) {
        if (!predicate(item)) continue;
        result.push(item);
    }

    return result;
}

const numbers = [1, 2, 3, 4, 5];
const evenNumbers = filterItems(
    numbers,
    (x) => typeof x === 'number' && x % 2 === 0
);


// 2. Типізуйте функцію sendEvent. Вона приймає:
//  a. eventType: суворий літерал Attack | Move | Interact
//  b. ...payload:
//    - Attack => (targetId: number, weapon: string)
//    - Move => (x: number, y: number)
//    - Interact => (targetId: number)

// function sendEvent(eventType, ...payload) {
// //   console.info(`Event: ${eventType}, Data: ${payload.join(', ')}`);
// //
// }
type EventType = 'Attack' | 'Move' | 'Interact';

type EventPayload =
    | [eventType: 'Attack', targetId: number, weapon: string]
    | [eventType: 'Move', x: number, y: number]
    | [eventType: 'Interact', targetId: number];

function sendEvent(...args: EventPayload): void {
    const [eventType, ...payload] = args;
    console.info(`Event: ${eventType}, Data: ${payload.join(', ')}`);
}


sendEvent('Attack', 1, 'sword');
sendEvent('Move', 10, 20);
sendEvent('Interact', 5);


// 3. Функція runCommand поводиться по-різному залежно від команди.
//  - get-health, targetId: number -> повертає health.
//  - get-status, targetId: number -> повертає status.
//  - search-area, x: number, y: number, radius?: number -> повертає список знайденого.
//  - spawn-creep, type: goblin | orc -> повертає об'єкт { id: number, type: string }.

// TODO: Declare overloads here
// function runCommand(command, arg1, arg2, arg3) {
//   if (command === 'get-health') {
//     return 100;
//   }
//   if (command === 'get-status') {
//     return 'Stunned';
//   }
//   if (command === 'search-area') {
//     return ['Rock', 'Tree', 'Chest'];
//   }
//   if (command === 'spawn-creep') {
//     return { id: Math.random(), type: arg1 };
//   }
//   throw new Error('Unknown command');
// }


type CreepType = 'goblin' | 'orc';


// @ts-ignore
function runCommand(command: 'get-health', targetId: number): number;
function runCommand(command: 'get-status', targetId: number): string;
function runCommand(
    command: 'search-area',
    x: number,
    y: number,
    radius?: number
): string[];
function runCommand(
    command: 'spawn-creep',
    type: CreepType
): { id: number; type: string };

function runCommand(
    command: string,
    arg1?: number | string,
    arg2?: number,
    arg3?: number
) {
    if (command === 'get-health') {
        return 'health';
    }

    if (command === 'get-status') {
        return 'status';
    }

    if (command === 'search-area') {
        return ['Rock', 'Tree', 'Chest'];
    }

    if (command === 'spawn-creep') {
        return { id: Math.random(), type: arg1 as string };
    }

    throw new Error('Unknown command');
}



const health = runCommand('get-health', 1);

const statu = runCommand('get-status', 1);
const area = runCommand('search-area', 10, 20);
const creep = runCommand('spawn-creep', 'goblin');



// // 4. Функція calculateDamage рахує урон, але вона також має властивість history, яка є масивом чисел.
// // Також вона має метод showHistory(), який нічого не повертає.
// // Опишіть цей тип DamageCalculator і типізуйте константу.
//
// // TODO: Define DamageCalculator type
//
// const calculateDamage = function (min, max) {
//   const dmg = Math.floor(Math.random() * (max - min) + min);
//   calculateDamage.history.push(dmg);
//   return dmg;
// };
//
// calculateDamage.history = [];
// calculateDamage.showHistory = function () {
//   console.info('History:', this.history);
// };



type DamageCalculator = {
    (min: number, max: number): number;
    history: number[];
    showHistory(): void;
};

const calculateDamage: DamageCalculator = function (
    min: number,
    max: number
): number {
    const dmg = Math.floor(Math.random() * (max - min) + min);
    calculateDamage.history.push(dmg);
    return dmg;
};


calculateDamage.history = [];

calculateDamage.showHistory = function (): void {
    console.info('History:', this.history);
};


calculateDamage(10, 20);
calculateDamage(5, 15);
calculateDamage(8, 12);

calculateDamage.showHistory();


// // 5. У нас є тип GameState. Напишіть функцію processState, яка повертає повідомлення.
// // У default зробіть перевірку, щоб переконатися, що всі стани оброблені. //
// Якщо додати новий стан у GameState, TS повинен підсвітити помилку в switch. //
// type GameState = 'Loading' | 'Playing' | 'Paused'; // 'GameOver' //
// function processState(state: GameState): string {
// switch (state) {
// case 'Loading':
// return 'Please wait...';
// case 'Playing':
// return 'Game is on!';
// case 'Paused':
// return 'Press Start to continue';
// default:
// return 'Unknown state'; // } // }// //
//

type GameState = 'Loading' | 'Playing' | 'Paused';

function processState(state: GameState): string {
    switch (state) {
        case 'Loading':
            return 'Please wait...';

        case 'Playing':
            return 'Game is on!';

        case 'Paused':
            return 'Press Start to continue';

        default: {
            // Проверка, что все состояния обработаны
            const _exhaustiveCheck: never = state;
            return _exhaustiveCheck;
        }
    }
}

