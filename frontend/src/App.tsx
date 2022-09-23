import { useState, useEffect } from 'react';
import axios from 'axios';
import { ValidationError } from 'class-validator';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import CheckIcon from '@mui/icons-material/Check';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { grey, cyan, indigo } from '@mui/material/colors';
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: indigo,
    secondary: cyan,
    divider: '#fff',
    text: {
      primary: '#fff',
      secondary: grey[300],
    },
    background: {
      default: '#0b0f19',
      paper: indigo[900],
    },
  },
});

const BASE_URL = 'http://localhost:8082';

// The validation library 'code-validation'  is shared between backend and frontend
// using some great prebuilt decorators and other goodies
import {
  validateTodoWithClassValidator,
  IAddTodoPayload,
  IGetTodosResponse,
  ITodoItem,
  TodoItem,
} from '@cosmology/validation';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React from 'react';

function App() {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [selectedTheme, setSelectedTheme] = React.useState(theme);
  const [todoList, setTodoList] = useState<ITodoItem[]>([]);
  const [newTodoItemText, setNewTodoItemText] = useState('');

  useEffect(() => {
    axios
      .get<IGetTodosResponse>(`${BASE_URL}/todos`)
      .then(({ data }) => {
        console.log('IGetTodosResponse');
        console.log({ data });
        setTodoList(data.todoList);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Adds a new todo item.
  async function onAddNewTodoItem(
    event: React.MouseEvent<HTMLElement>,
    text: string
  ) {
    event.preventDefault();

    const newTodoItem: ITodoItem = { text: newTodoItemText };

    // front end typed validatin with class-validator
    const todo = new TodoItem(newTodoItem);
    const errors = await validateTodoWithClassValidator(todo);

    // comment this out to see the back end validation bringing
    // the same user experience as front end
    // if (errors.length > 0) {
    //   setErrors(errors);
    //   return;
    // }

    try {
      await axios.post<IAddTodoPayload>(`${BASE_URL}/todo`, {
        todoItem: newTodoItem,
      });
    } catch (error: any) {
      errors.map((error: any, i: number) => {
        let property: keyof typeof error.constraints;
        // @ts-ignore
        for (property in error.constraints) {
          alert(
            `Back validation failed: ${
              error.constraints && error.constraints[property]
            }`
          );
        }
      });

      setErrors(errors);
      return;
    }
    // merge spreading for better ui instead of pushing down the screen
    setTodoList([...[newTodoItem], ...todoList]);
    setNewTodoItemText('');
    setErrors([]);
  }

  if (todoList === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography color="primary" variant="h1" sx={{ m: 3 }} align="center">
        {selectedTheme?.palette?.mode}{' '}
        {selectedTheme?.palette?.mode === 'dark' ? '🌙' : '🌞'}
      </Typography>

      <Box>
        <Paper
          component={Stack}
          direction="column"
          justifyContent="center"
          sx={{ pb: 1 }}>
          <Container maxWidth="sm">
            <Typography
              color="primary"
              align="center"
              variant="body2"
              sx={{ pt: 1 }}>
              Enter empty or a single character todo
            </Typography>
            <Stack sx={{ pt: 1, pb: 1 }} spacing={1}>
              <Button
                variant="contained"
                onClick={(e) => onAddNewTodoItem(e, 'clicked')}>
                Add front and back end validated todo
              </Button>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder="Write a new todo"
                value={newTodoItemText}
                onChange={(event) =>
                  setNewTodoItemText(event.currentTarget.value)
                }
              />
            </Stack>
            {errors && errors.length > 0 && (
              <Stack sx={{ pb: 1 }} spacing={0}>
                {errors.map((error, i) => {
                  let property: keyof typeof error.constraints;
                  // @ts-ignore
                  for (property in error.constraints) {
                    return (
                      <Alert variant="filled" severity="error" key={i}>
                        {error.constraints && error.constraints[property]}
                      </Alert>
                    );
                  }
                })}
              </Stack>
            )}
            <Stack spacing={1}>
              {todoList.map((todo, index) => {
                return (
                  <Alert
                    key={index}
                    icon={<CheckIcon fontSize="inherit" />}
                    severity="success">
                    {todo.text}
                  </Alert>
                );
              })}
            </Stack>
          </Container>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default App;
