import './App.css';
import React, { useEffect } from 'react';
import { Grid, Box } from "@mui/material";
import { makeStyles } from 'tss-react/mui';
import AddTodo from './Components/AddTodo';
import FilterTodo from './Components/FilterTodu';
import Task from './Components/Task';
import URLS from './Components/URLS';
import axios from 'axios';


//immer import
import { useImmerReducer } from 'use-immer';


const useStyle = makeStyles()(() => ({
  mainContainer: {
    marginTop: "50px"
  },
  addTodoContainer: {
    backgroundColor: 'white',
    padding: '30px 20px',
    borderRadius: '10px',
    margin: '10px'
  },
  addTodoContainerScroll: {
    height: '400px', // Set the desired height
    overflowY: 'auto', // Enable vertical scrolling when content overflows
  },
}));


function App() {

  const { classes } = useStyle();

  const initialstate = {
    todos: [],
    addNewTodo: true,
    todoFilterStatus : '',
  };

  function ReduceFunction(draft, action) {
    switch (action.type) {
      case 'catchTodus':
        draft.todos = action.getTodoResponse;
        break;
      case 'addTodo':
        draft.addNewTodo = !draft.addNewTodo;
        break;
      case 'todoFilterStatus':
        draft.todoFilterStatus = action.data;
        break;
      default:
        break;
    }
  };

  const [state, dispatch] = useImmerReducer(ReduceFunction, initialstate);


  useEffect(() => {
    async function getTodo() {
      try {
        const response = await axios.get(
          URLS.createTodoUrl,
        )
        dispatch({ type: 'catchTodus', getTodoResponse: response.data });

      } catch (error) {
        console.log(error);
      }

    }
    getTodo();

  }, [state.addNewTodo])

  function addTodoStatus() {
    dispatch({ type: 'addTodo' });
  };
  
  
  function showTodo(filterStatus) {
    if (filterStatus === 'active') {
      return (
        state.todos.map((item) => {
          if(!item.completed){
            return (<Task data={item} key={item.id} addTodoStatus={addTodoStatus} />);
          }
        })
      );
    }
    else if (filterStatus === 'deactivate') {
      return (
        state.todos.map((item) => {
          if(item.completed){
            return (<Task data={item} key={item.id} addTodoStatus={addTodoStatus} />);
          }
        })
      );
    }
    else {
      return (
        state.todos.map((item) => {
          return (<Task data={item} key={item.id} addTodoStatus={addTodoStatus} />);
        })
      );
    }
  };

  function todoFilter(todoFilterStatus) {
    dispatch({type: "todoFilterStatus", data: todoFilterStatus})
  }

  return (
    <Box className={classes.mainContainer}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={10} md={6} xl={4} className={classes.addTodoContainer}>
          <AddTodo addTodoStatus={addTodoStatus} />
        </Grid>
      </Grid>
      <Grid
        container
        justifyContent="center"
        alignItems="center"

      >
        <Grid item xs={12} sm={10} md={6} xl={4} className={classes.addTodoContainer}>
          <FilterTodo showTodoFilter={todoFilter} />
        </Grid>
      </Grid>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={10} md={6} xl={4} className={`${classes.addTodoContainer} ${classes.addTodoContainerScroll}`}>
          { showTodo(state.todoFilterStatus) }
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;

//----------------------------------------------------------------