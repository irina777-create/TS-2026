/* Вам треба створити додаток для управління нотатками, використовуючи принципи ООП, патерн DTO та декоратори.

1. Нотатки
Кожна нотатка має містити:
- ідентифікатор
- назву
- зміст
- дату створення
- дату редагування
- статус
- тип

Нотатки бувають двох типів (використовуйте наслідування):
- Дефолтні.
- Такі, що вимагають підтвердження при редагуванні та видалинні

2. У списку нотаток повинні бути методи для:
- Додавання нового запису.
- Видалення запису за ідентифікатором.
- Редагування запису.
- Отримання повної інформації про нотатку за ідентифікатором.
- Позначення нотатки як "виконаної".
- Отримання статистики: скільки всього нотаток у списку і скільки залишилося невиконаними.
- У списку повинна бути можливість пошуку нотатки за ім'ям або змістом.
- Додайте можливість сортування нотаток за статусом виконання або за часом створення.

3. Робота з даними
Уявіть, що дані надходять до вашого списку із зовнішнього API. Всі вхідні дані приходять у форматі snake_case.
Внутрішня бізнес-логіка вашого додатку та класи повинні суворо використовувати camelCase.

Типізуйте механізм, який автоматично трансформує ключі об'єктів зі snake_case у camelCase при отриманні даних, та навпаки — при поверненні результату клієнту.

4. Декоратори
Для оптимізації та чистоти коду необхідно реалізувати та застосувати наступні декоратори:

@SanitizeInput: Застосовується до методів додавання та редагування. Повинен автоматично видаляти зайві пробіли на початку
та в кінці строк у назві та змісті нотатки перед тим, як дані потраплять до основної логіки методу.

@ValidateNotEmpty: Застосовується після очищення. Нотатки не повинні бути порожніми. Декоратор перевіряє,
чи не є назва та зміст порожніми строками, і якщо так — викидає помилку до виконання основної логіки методу.

@AutoUpdateTimestamp: Застосовується до методу редагування. Декоратор повинен перехоплювати виклик методу
і автоматично оновлювати поле дата редагування поточною датою та часом, звільняючи розробника від необхідності
писати цю логіку всередині самого методу.
*/

enum NoteStatus {
    ACTIVE = 'active',
    COMPLETED = 'completed',
    DELETED = 'deleted',
}

enum NoteType {
    DEFAULT = 'default',
    CONFIRMATION = 'confirmation',
}

interface CreateNoteDto {
    title: string;
    content: string;
    type: NoteType;
}

interface EditNoteDto {
    title?: string;
    content?: string;
}

interface Note {
    noteId: string;
    noteTitle: string;
    noteContent: string;
    createdAt: string;
    updatedAt: string;
    isCompleted: boolean;
    type: 'default' | 'confirmation';
}

type StartsWithUppercase<S extends string> =
    S extends Uncapitalize<S> ? false : true;

type CamelToSnake<T extends string> =
    T extends `${infer C}${infer R}`
        ? StartsWithUppercase<R> extends true
            ? `${Uncapitalize<C>}_${CamelToSnake<R>}`
            : `${Uncapitalize<C>}${CamelToSnake<R>}`
        : T;

type SnakeToCamel<T extends string> =
    T extends `${infer F}_${infer R}`
        ? `${F}${Capitalize<SnakeToCamel<R>>}`
        : T;

type MapToSnakeCaseDTO<T> = {
    [K in keyof T as CamelToSnake<K & string>]: T[K];
};

type MapToCamelCaseDomain<T> = {
    [K in keyof T as SnakeToCamel<K & string>]: T[K];
};

type NoteServerDTO = MapToSnakeCaseDTO<Note>;
type ReconstructedNote = MapToCamelCaseDomain<NoteServerDTO>;

const mockServerResponse: NoteServerDTO[] = [
    {
        note_id: '1',
        note_title: 'Прочитати: Великий Гетсбі (Ф. Скотт Фіцджеральд)',
        note_content: 'Проаналізувати мотив «зеленого вогника» та крах американської мрії.',
        created_at: '2026-02-01T10:00:00Z',
        updated_at: '2026-02-02T15:30:00Z',
        is_completed: true,
        type: 'default',
    },
    {
        note_id: '2',
        note_title: 'Купити: На Західному фронті без змін (Е.М. Ремарк)',
        note_content: 'Звернути увагу на контраст між мирним життям та жахами окопів.',
        created_at: '2026-02-05T09:15:00Z',
        updated_at: '2026-02-05T09:15:00Z',
        is_completed: false,
        type: 'confirmation',
    },
    {
        note_id: '3',
        note_title: 'Написати есе: Фієста (Е. Хемінґвей)',
        note_content: 'Розібрати «принцип айсберга» Хемінґвея.',
        created_at: '2026-02-10T14:20:00Z',
        updated_at: '2026-02-12T11:00:00Z',
        is_completed: false,
        type: 'default',
    },
];

function mapToDTO(data: ReconstructedNote): NoteServerDTO {
    return {
        note_id: data.noteId,
        note_title: data.noteTitle,
        note_content: data.noteContent,
        created_at: data.createdAt,
        updated_at: data.updatedAt,
        is_completed: data.isCompleted,
        type: data.type,
    };
}

function mapFromDTO(data: NoteServerDTO): ReconstructedNote {
    return {
        noteId: data.note_id,
        noteTitle: data.note_title,
        noteContent: data.note_content,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        isCompleted: data.is_completed,
        type: data.type,
    };
}

function SanitizeInput(target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = function (...args: any[]) {
        const sanitized = args.map((arg) => {
            if (!arg || typeof arg !== 'object') return arg;
            const copy = { ...arg };
            if (typeof copy.title === 'string') copy.title = copy.title.trim();
            if (typeof copy.content === 'string') copy.content = copy.content.trim();
            return copy;
        });

        return original.apply(this, sanitized);
    };

    return descriptor;
}

function ValidateNotEmpty(target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = function (...args: any[]) {
        for (const arg of args) {
            if (!arg || typeof arg !== 'object') continue;
            if ('title' in arg && typeof arg.title === 'string' && arg.title === '') {
                throw new Error('Title cannot be empty');
            }
            if ('content' in arg && typeof arg.content === 'string' && arg.content === '') {
                throw new Error('Content cannot be empty');
            }
        }

        return original.apply(this, args);
    };

    return descriptor;
}

function AutoUpdateTimestamp(target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = function (...args: any[]) {
        const id = args[0];
        const note = this.getNoteById(id);
        if (note) note.updatedAt = new Date();
        return original.apply(this, args);
    };

    return descriptor;
}

abstract class BaseNote {
    constructor(
        public id: string,
        public title: string,
        public content: string,
        public createdAt: Date,
        public updatedAt: Date,
        public status: NoteStatus,
        public type: NoteType
    ) {}

    abstract canEdit(): boolean;
    abstract canDelete(): boolean;

    edit(dto: EditNoteDto): void {
        if (dto.title !== undefined) this.title = dto.title;
        if (dto.content !== undefined) this.content = dto.content;
    }

    markCompleted(): void {
        this.status = NoteStatus.COMPLETED;
    }

    toDomain(): ReconstructedNote {
        return {
            noteId: this.id,
            noteTitle: this.title,
            noteContent: this.content,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
            isCompleted: this.status === NoteStatus.COMPLETED,
            type: this.type,
        };
    }
}

class DefaultNote extends BaseNote {
    constructor(
        id: string,
        title: string,
        content: string,
        createdAt: Date,
        updatedAt: Date,
        status: NoteStatus
    ) {
        super(id, title, content, createdAt, updatedAt, status, NoteType.DEFAULT);
    }

    canEdit(): boolean {
        return true;
    }

    canDelete(): boolean {
        return true;
    }
}

class ConfirmationNote extends BaseNote {
    constructor(
        id: string,
        title: string,
        content: string,
        createdAt: Date,
        updatedAt: Date,
        status: NoteStatus
    ) {
        super(id, title, content, createdAt, updatedAt, status, NoteType.CONFIRMATION);
    }

    canEdit(): boolean {
        return true;
    }

    canDelete(): boolean {
        return true;
    }
}

class NoteFactory {
    static createFromDTO(dto: NoteServerDTO): BaseNote {
        const data = mapFromDTO(dto);
        const status = data.isCompleted ? NoteStatus.COMPLETED : NoteStatus.ACTIVE;

        if (data.type === NoteType.CONFIRMATION) {
            return new ConfirmationNote(
                data.noteId,
                data.noteTitle,
                data.noteContent,
                new Date(data.createdAt),
                new Date(data.updatedAt),
                status
            );
        }

        return new DefaultNote(
            data.noteId,
            data.noteTitle,
            data.noteContent,
            new Date(data.createdAt),
            new Date(data.updatedAt),
            status
        );
    }
}

class NoteManager {
    private notes: BaseNote[];

    constructor(data: NoteServerDTO[]) {
        this.notes = data.map(NoteFactory.createFromDTO);
    }

    private generateId(): string {
        return String(Date.now() + Math.random());
    }

    @SanitizeInput
    @ValidateNotEmpty
    addNote(dto: CreateNoteDto): BaseNote {
        const now = new Date();
        const note =
            dto.type === NoteType.CONFIRMATION
                ? new ConfirmationNote(this.generateId(), dto.title, dto.content, now, now, NoteStatus.ACTIVE)
                : new DefaultNote(this.generateId(), dto.title, dto.content, now, now, NoteStatus.ACTIVE);

        this.notes.push(note);
        return note;
    }

    @SanitizeInput
    @ValidateNotEmpty
    @AutoUpdateTimestamp
    editNote(id: string, dto: EditNoteDto): BaseNote {
        const note = this.getNoteById(id);
        if (!note) throw new Error('Note not found');
        note.canEdit();
        note.edit(dto);
        return note;
    }

    deleteNote(id: string): void {
        const note = this.getNoteById(id);
        if (!note) throw new Error('Note not found');
        note.canDelete();
        note.status = NoteStatus.DELETED;
    }

    getNoteById(id: string): BaseNote | undefined {
        return this.notes.find((note) => note.id === id);
    }

    getNoteInfo(id: string): BaseNote {
        const note = this.getNoteById(id);
        if (!note) throw new Error('Note not found');
        return note;
    }

    markAsCompleted(id: string): void {
        const note = this.getNoteById(id);
        if (!note) throw new Error('Note not found');
        note.markCompleted();
    }

    getStats(): { total: number; uncompleted: number } {
        const active = this.notes.filter((note) => note.status !== NoteStatus.DELETED);
        return {
            total: active.length,
            uncompleted: active.filter((note) => note.status !== NoteStatus.COMPLETED).length,
        };
    }

    search(query: string): BaseNote[] {
        const q = query.trim().toLowerCase();
        return this.notes.filter(
            (note) =>
                note.status !== NoteStatus.DELETED &&
                (note.title.toLowerCase().includes(q) || note.content.toLowerCase().includes(q))
        );
    }

    sortByStatus(): BaseNote[] {
        const order: Record<NoteStatus, number> = {
            [NoteStatus.ACTIVE]: 1,
            [NoteStatus.COMPLETED]: 2,
            [NoteStatus.DELETED]: 3,
        };

        return [...this.notes].sort((a, b) => order[a.status] - order[b.status]);
    }

    sortByCreatedAt(): BaseNote[] {
        return [...this.notes].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    exportToDTO(): NoteServerDTO[] {
        return this.notes
            .filter((note) => note.status !== NoteStatus.DELETED)
            .map((note) => mapToDTO(note.toDomain()));
    }
}