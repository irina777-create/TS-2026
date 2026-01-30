type Grades = Record<string, number>;
type Visits = boolean[];

interface Lecturer {
    name: string;
    surname: string;
    position: string;
    company: string;
    experience: number;
    courses: string[];
    contacts: {
        email?: string;
        phone?: string;
    };
}

enum GroupStatus {
    Active = "active",
    Inactive = "inactive",
    Completed = "completed",
}

class School {
    private _areas: Area[] = [];
    private _lecturers: Lecturer[] = [];

    get areas(): Area[] {
        return this._areas;
    }

    get lecturers(): Lecturer[] {
        return this._lecturers;
    }

    addArea(area: Area): void {
        this._areas.push(area);
    }

    removeArea(name: string): void {
        this._areas = this._areas.filter(a => a.name !== name);
    }

    addLecturer(lecturer: Lecturer): void {
        this._lecturers.push(lecturer);
    }

    removeLecturer(fullName: string): void {
        this._lecturers = this._lecturers.filter(
            l => `${l.surname} ${l.name}` !== fullName
        );
    }
}

class Area {
    private _levels: Level[] = [];

    constructor(private _name: string) {}

    get name(): string {
        return this._name;
    }

    get levels(): Level[] {
        return this._levels;
    }

    addLevel(level: Level): void {
        this._levels.push(level);
    }

    removeLevel(name: string): void {
        this._levels = this._levels.filter(l => l.name !== name);
    }
}

class Level {
    private _groups: Group[] = [];

    constructor(private _name: string, private _description: string) {}

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get groups(): Group[] {
        return this._groups;
    }

    addGroup(group: Group): void {
        this._groups.push(group);
    }

    removeGroup(group: Group): void {
        this._groups = this._groups.filter(g => g !== group);
    }
}

class Group {
    private _students: Student[] = [];
    private _status: GroupStatus = GroupStatus.Active;

    constructor(private _directionName: string, private _levelName: string) {}

    get directionName(): string {
        return this._directionName;
    }

    get levelName(): string {
        return this._levelName;
    }

    get status(): GroupStatus {
        return this._status;
    }

    get students(): Student[] {
        return this._students;
    }

    setStatus(status: GroupStatus): void {
        this._status = status;
    }

    addStudent(student: Student): void {
        this._students.push(student);
    }

    removeStudent(fullName: string): void {
        this._students = this._students.filter(s => s.fullName !== fullName);
    }

    showPerformance(): Student[] {
        // простий аналог toSorted
        return this._students
            .slice()
            .sort((a, b) => b.getPerformanceRating() - a.getPerformanceRating());
    }
}

class Student {
    private _grades: Grades = {};
    private _visits: Visits = [];

    constructor(
        private _firstName: string,
        private _lastName: string,
        private _birthYear: number
    ) {}

    get birthYear(): number {
        return this._birthYear;
    }

    get fullName(): string {
        return `${this._lastName} ${this._firstName}`;
    }

    get age(): number {
        return new Date().getFullYear() - this._birthYear;
    }

    setGrade(workName: string, mark: number): void {
        this._grades[workName] = mark;
    }

    setVisit(present: boolean): void {
        this._visits.push(present);
    }

    getPerformanceRating(): number {
        const gradesArr: number[] = Object.values(this._grades);
        const avgGrade: number = gradesArr.length
            ? gradesArr.reduce((s, g) => s + g, 0) / gradesArr.length
            : 0;

        const attendance: number = this._visits.length
            ? (this._visits.filter(Boolean).length / this._visits.length) * 100
            : 0;

        return (avgGrade + attendance) / 2;
    }
}
