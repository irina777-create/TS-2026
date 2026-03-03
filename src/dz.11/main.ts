//Вам потрібно створити тип DeepReadonly який буде робити доступними
// тільки для читання навіть властивості вкладених обʼєктів.

type DeepReadonly<T> =
    T extends (...args: any[]) => any
        ? T
        : T extends object
            ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
            : T;
//Вам потрібно створити тип DeepRequireReadonly який буде робити доступними
// тільки для читання навіть властивості вкладених обʼєктів та ще й робити їх обовʼязковими.

type DeepRequireReadonly<T> =
    T extends (...args: any[]) => any
        ? T
        : T extends readonly (infer U)[]
            ? ReadonlyArray<DeepRequireReadonly<U>>
            : T extends object
                ? { readonly [K in keyof T]-?: DeepRequireReadonly<T[K]> }
                : T;
//Вам потрібно створити тип UpperCaseKeys, який буде приводити всі ключі до верхнього регістру.
type UpperCaseKeys<T> =
    T extends object
        ? { [K in keyof T as Uppercase<K & string>]: T[K] }
        : T;
//І саме цікаве. Створіть тип ObjectToPropertyDescriptor, який перетворює звичайний обʼєкт
// на обʼєкт де кожне value є дескриптором.

type ObjectToPropertyDescriptor<T> =
    T extends object
        ? {
            [K in keyof T]: {
                value: T[K];
                writable: boolean;
                configurable: boolean;
                enumerable: boolean;
            }
        }
        : T;