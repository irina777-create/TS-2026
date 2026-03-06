//У вас є дві сутності - список фільмів і список категорій фільмів.
// Кожен фільм містить поля: назва, рік випуску, рейтинг, список нагород.
// Категорія містить поля: назва і фільми.
// У кожного списку є пошук за ім'ям (це, по суті, фільтрація), у списку фільмів є додаткова фільтрація за роком випуску, рейтингом і нагородами.
// У нас визначено три типи фільтрів:
// Фільтр відповідності має поле filter
// Фільтр діапазону має поле filter і filterTo
// Фільтр пошуку за значеннями має поле values
// Кожен список містить стан його фільтрів, який може бути змінений тільки методом applySearchValue або applyFiltersValue (за наявності додаткових фільтрів)
// Вам необхідно подумати про поділ вашого коду на різні сутності, інтерфеси і типи, щоб зробити ваше рішення типобезпечним. Реалізація всіх методів не є необхідною - це за бажанням.
enum GridFilterTypeEnum {
    Equal = 'equal',
    Range = 'range',
    Set = 'set',
}

interface IFilm {
    title: string;
    year: number;
    rating: number;
    awards: string[];
}

interface ICategory {
    title: string;
    films: IFilm[];
}

type GridFilterValue<T extends string | number> =
    | { type: GridFilterTypeEnum.Equal; filter: T }
    | { type: GridFilterTypeEnum.Range; filter: T; filterTo: T };

type GridFilterSetValues<T> = {
    type: GridFilterTypeEnum.Set;
    values: T[];
};

interface FilmFilters {
    search: GridFilterValue<string>;
    year: GridFilterValue<number>;
    rating: GridFilterValue<number>;
    awards: GridFilterSetValues<string>;
}

interface CategoryFilters {
    search: GridFilterValue<string>;
}

interface BaseList<T, F> {
    items: T[];
    filters: F;
    applySearchValue(value: string): void;
}

interface FilterableList<T, F> extends BaseList<T, F> {
    applyFiltersValue<K extends keyof F>(key: K, value: F[K]): void;
}

class FilmList implements FilterableList<IFilm, FilmFilters> {
    constructor(public items: IFilm[], public filters: FilmFilters) {}

    applySearchValue(value: string): void {
        this.filters.search = { type: GridFilterTypeEnum.Equal, filter: value };
    }

    applyFiltersValue<K extends keyof FilmFilters>(key: K, value: FilmFilters[K]): void {
        this.filters[key] = value;
    }
}

class CategoryList implements BaseList<ICategory, CategoryFilters> {
    constructor(public items: ICategory[], public filters: CategoryFilters) {}

    applySearchValue(value: string): void {
        this.filters.search = { type: GridFilterTypeEnum.Equal, filter: value };
    }
}