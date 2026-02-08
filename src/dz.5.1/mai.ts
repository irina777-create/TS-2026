abstract class Shape {
    public readonly name: string;
    public readonly color: string;

    constructor(name: string, color: string) {
        this.name = name;
        this.color = color;
    }

    abstract calculateArea(): number;
}


class Circle extends Shape {
    constructor(
        color: string,
        private readonly radius: number
    ) {
        super('Circle', color);
    }

    calculateArea(): number {
        return Math.PI * this.radius ** 2;
    }
}


class Rectangle extends Shape {
    constructor(
        color: string,
        private readonly width: number,
        private readonly height: number
    ) {
        super('Rectangle', color);
    }

    calculateArea(): number {
        return this.width * this.height;
    }

    print(): void {
        console.log(`Area = width × height = ${this.width} × ${this.height}`);
    }
}


class Square extends Shape {
    constructor(
        color: string,
        private readonly side: number
    ) {
        super('Square', color);
    }

    calculateArea(): number {
        return this.side ** 2;
    }

    print(): void {
        console.log(`Area = side² = ${this.side}²`);
    }
}


class Triangle extends Shape {
    constructor(
        color: string,
        private readonly base: number,
        private readonly height: number
    ) {
        super('Triangle', color);
    }

    calculateArea(): number {
        return (this.base * this.height) / 2;
    }
}
const circle = new Circle('red', 10);
console.log(circle.calculateArea());

const rectangle = new Rectangle('blue', 4, 6);
rectangle.print();
console.log(rectangle.calculateArea());

const square = new Square('green', 5);
square.print();
console.log(square.calculateArea());

const triangle = new Triangle('yellow', 6, 8);
console.log(triangle.calculateArea());
