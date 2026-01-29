console.log("DZ3.1 працює ✅");

class School {
    private _directions: Direction[] = [];

    get directions(): Direction[] {
        return this._directions;
    }

    addDirection(direction: Direction): void {
        this._directions.push(direction);
    }
}

class Direction {
    private _levels: Level[] = [];
    private _name: string;

    get name(): string {
        return this._name;
    }

    get levels(): Level[] {
        return this._levels;
    }

    constructor(name: string) {
        this._name = name;
    }

    addLevel(level: Level): void {
        this._levels.push(level);
    }
}

class Level {
    private _groups: Group[] = [];
    private _name: string;
    private _program: string;

    constructor(name: string, program: string) {
        this._name = name;
        this._program = program;
    }

    get name(): string {
        return this._name;
    }

    get program(): string {
        return this._program;
    }

    get groups(): Group[] {
        return this._groups;
    }

    addGroup(group: Group): void {
        this._groups.push(group);
    }
}

class Group {
    private _students: Student[] = [];
    private _name: string;

    constructor(name: string) {
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

    get students(): Student[] {
        return this._students;
    }

    addStudent(student: Student): void {
        this._students.push(student);
    }

    showPerformance(): Student[] {
        return this._students
            .slice()
            .sort((a: Student, b: Student) => b.getPerformanceRating() - a.getPerformanceRating());
    }
}

class Student {
    grades: { [key: string]: number } = {};
    attendance: boolean[] = [];

    firstName: string;
    lastName: string;
    birthYear: number;

    constructor(firstName: string, lastName: string, birthYear: number) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthYear = birthYear;
    }

    get fullName(): string {
        return `${this.lastName} ${this.firstName}`;
    }

    set fullName(value: string) {
        [this.lastName, this.firstName] = value.split(" ");
    }

    get age(): number {
        return new Date().getFullYear() - this.birthYear;
    }

    setGrade(subject: string, grade: number): void {
        this.grades[subject] = grade;
    }

    markAttendance(present: boolean): void {
        this.attendance.push(present);
    }

    getPerformanceRating(): number {
        const gradeValues: number[] = Object.values(this.grades);
        if (gradeValues.length === 0) return 0;

        const averageGrade: number =
            gradeValues.reduce((sum: number, grade: number) => sum + grade, 0) / gradeValues.length;

        const attendancePercentage: number =
            this.attendance.length === 0
                ? 0
                : (this.attendance.filter((present: boolean) => present).length / this.attendance.length) *
                100;

        return (averageGrade + attendancePercentage) / 2;
    }
}
