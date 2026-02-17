//Визначте інтерфейс, який використовує сигнатуру індексу з типами об'єднання.
// Наприклад, тип значення для кожного ключа може бути число | рядок.

interface  Car{
id:number;
[attr:string]:number|string;
}
//Створіть інтерфейс, у якому типи значень у сигнатурі індексу є функціями.
// Ключами можуть бути рядки, а значеннями — функції, які приймають будь-які аргументи.

// @ts-ignore
interface Product{
    id:number;
    name:string;
    price:number;
getFormatedPrice:() => string;
[key :string]:number|string|((...args: unknown[]) => unknown)
}
// @ts-ignore
const laptop:Product={
    id:34,
    name:'Apple',
    price:3000,
    getFormatedPrice():string{
        return `$${this.price}`
    }

}
//Опишіть інтерфейс, який використовує сигнатуру індексу для опису об'єкта, подібного до масиву.
// Ключі повинні бути числами, а значення - певного типу.
interface NumberArray{
    [index:number]:number;
}
const numbers:NumberArray={
    0:10,
    1:20,
    3:40,
}
console.log(numbers[1]);
//Створіть інтерфейс з певними властивостями та індексною сигнатурою.
// Наприклад, ви можете мати властивості типу name: string та індексну сигнатуру для додаткових динамічних властивостей.
interface User {
    name: string;
    age?: number;

    [key: string]: string | number | undefined;
}
const user: User = {
    name: "Ira",
    age: 44,
    city: "Odesa",

};
//Створіть два інтерфейси, один з індексною сигнатурою, а інший розширює перший, додаючи специфічні властивості.
interface  BaseEntity{
    [key: string]: string | number | undefined;
}
interface Product extends BaseEntity {
    id:number
    product:string;
    price: number;


}
//Напишіть функцію, яка отримує об'єкт з індексною сигнатурою і перевіряє,
// чи відповідають значення певних ключів певним критеріям (наприклад, чи всі значення є числами).
interface NumericDictionary {
    [key: string]: number;
}
function areAllValuesNumbers(obj: {
    [key: string]: unknown;
}): obj is NumericDictionary {
    return Object.values(obj).every(
        (value) => typeof value === "number"
    );
}
const data = {
    a: 10,
    b: 20,
    c: 30
};

if (areAllValuesNumbers(data)) {
    console.log(data.a + data.b);
}

