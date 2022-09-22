import { ValidationError } from 'class-validator';
export interface ITodoItem {
    text: string;
}
export interface IAddTodoPayload {
    todoItem: ITodoItem;
}
export interface IGetTodosResponse {
    todoList: ITodoItem[];
}
export declare class TodoItem {
    text: string;
    constructor(data?: any);
}
export declare const validateTodoWithClassValidator: (todo: ITodoItem) => Promise<ValidationError[]>;
