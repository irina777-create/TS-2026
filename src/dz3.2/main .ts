// ===== Types =====

export enum GroupStatus {
    Active = "active",
    Paused = "paused",
    Archived = "archived",
}

export type ContactType = "email" | "phone" | "telegram" | "linkedin";

export interface Contact {
    type: ContactType;     // <-- UNION
    value: string;
}

export type LecturerPosition = "mentor" | "lecturer" | "assistant"; // <-- UNION (можна зробити enum)

export interface Lecturer {
    name: string;
    surname: string;
    position: LecturerPosition;
    company: string;
    experience: number; // years
    courses: string[];
    contacts: Contact[];
}

// ===== Classes =====

export class School {
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

    removeArea(areaName: string): void {
        this._areas = this._areas.filter(a => a.name !== areaName);
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

export class Area {
    private _levels: Level[] = [];
    private _name: string;

    constructor(name: string) {
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

    get levels(): Level[] {
        return this._levels;
    }

    addLevel(level: Level): void {
        this._levels.push(level);
    }

    removeLevel(levelName: string): void {
        this._levels = this._levels.filter(l => l.name !== levelName);
    }
}

export class Level {
    private _groups: Group[] = [];
    private _name: string;
    private _description: string;

    constructor(name: string, description: string) {
        this._name = name;
        this._description = description;
    }

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

    removeGroup(groupName: string): void {
        this._groups = this._groups.filter(g => g.name !== groupName);
    }
}

export class Group {
    private _name: string;
    private _areaName: string;
    private _levelName: string;
    private _status: GroupStatus = GroupStatus.Active; // <-- ENUM
    private _students: Student[] = [];

    constructor(name: string, areaName: string, levelName: string) {
        this._name = name;
        this._areaName = areaName;
        this._levelName = levelName;
    }

    get name(): string {
        return this._name;
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
        // без toSorted (щоб працювало всюди)
        return this._students
            .slice()
            .sort((a, b) => b.getPerformanceRating() - a.getPerformanceRating());
    }
}

export class Student {
    private _firstName: string;
    private _lastName: string;
    private _birthYear: number;

    private _grades: Record<string, number> = {};  // <-- правильний тип
    private _visits: boolean[] = [];               // або: Array<boolean | "late" | "excused">

    constructor(firstName: string, lastName: string, birthYear: number) {
        this._firstName = firstName;
        this._lastName = lastName;
        this._birthYear = birthYear;
    }

    get fullName(): string {
        return `${this._lastName} ${this._firstName}`;
    }

    set fullName(value: string) {
        const [last, first] = value.split(" ");
        this._lastName = last ?? this._lastName;
        this._firstName = first ?? this._firstName;
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
        const gradeValues = Object.values(this._grades);
        if (gradeValues.length === 0) return 0;

        const averageGrade =
            gradeValues.reduce((sum, g) => sum + g, 0) / gradeValues.length;

        const attendancePercentage =
            this._visits.length === 0
                ? 0
                : (this._visits.filter(Boolean).length / this._visits.length) * 100;

        return (averageGrade + attendancePercentage) / 2;
    }
}
