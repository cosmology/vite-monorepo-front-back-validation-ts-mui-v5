import {
  validate,
  IsNotEmpty,
  MinLength,
  ValidationError,
} from 'class-validator';

export interface ITodoItem {
  text: string;
}

export interface IAddTodoPayload {
  todoItem: ITodoItem;
}

export interface IGetTodosResponse {
  todoList: ITodoItem[];
}

export class TodoItem {
  @MinLength(2, {
    message:
      'Todo is too short. Minimal length is $constraint1 characters, you typed $value',
  })
  @IsNotEmpty({
    message: 'Todo cannot be empty',
  })
  text: string;

  constructor(data?: any) {
    if (data === undefined) {
      data = {};
    }
    this.text = data.text;
  }
}

export const validateTodoWithClassValidator = async (
  todo: ITodoItem
): Promise<ValidationError[]> => {
  return validate(todo).then((errors) => {
    return errors.length > 0 ? errors : [];
  });
};
