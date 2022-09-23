import express, { Application, NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import bodyParser from 'body-parser';

import { AppRouter } from './AppRouter';
import cors from 'cors';

import {
  validateTodoWithClassValidator,
  TodoItem,
  IAddTodoPayload,
  IGetTodosResponse,
  ITodoItem,
} from '@cosmology/validation';

let todoList: ITodoItem[] = [
  {
    text: 'Eat',
  },
  {
    text: 'Code',
  },
  {
    text: 'Play hockey',
  },
];

export const app: Application = express();
const port = 8082;

app.use(bodyParser.json());
app.use(AppRouter.getInstance());

app.use(cors());

app.get('/healthcheck', (req: Request, res: Response) => {
  res.send({ status: 'ok' });
});

app.post(
  '/todo',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { todoItem } = req.body as IAddTodoPayload;

    // typed validation with class-validator
    const todo = new TodoItem(todoItem);
    const errors: ValidationError[] = await validateTodoWithClassValidator(
      todo
    );

    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }

    // prepend spreading instead of using push
    todoList = [...[todo], ...todoList];

    res.sendStatus(200);
  })
);

app.get('/todos', (req: Request, res: Response) => {
  const response: IGetTodosResponse = {
    todoList: todoList,
  };
  res.json(response);
});

app.listen(port, () => {
  console.log(`Webserver is running at localhost: ${port}`);
});
