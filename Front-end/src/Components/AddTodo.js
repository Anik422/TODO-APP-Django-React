import React, { useEffect } from 'react'
import { Grid, TextField, Snackbar } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

//immer
import { useImmerReducer } from 'use-immer';

import URLS from './URLS';

function AddTodo(props) {

    const initialstate = {
        todoValue: '',
        sendRequest: 0,
        submitButton: false,
        todoAddMessage: false,
        openSnack: false,
        submitButtonLoading: false,
        todoError: {
            hasError: false,
            errorMessage: ''
        }

    };

    function ReduceFunction(draft, action) {
        switch (action.type) {
            case 'catchTodoChange':
                draft.todoValue = action.todoChosen;
                draft.todoError.hasError = false;
                draft.todoError.errorMessage = "";
                draft.submitButton = false;
                break;
            case 'changeRequest':
                draft.sendRequest += 1;
                draft.submitButtonLoading = true;
                draft.submitButton = true;

                break;
            case 'catchTodoError':
                if (action.todoChosen.length === 0) {
                    draft.todoError.hasError = true;
                    draft.todoError.errorMessage = "Todo cannot be empty";
                    draft.submitButton = true;
                    draft.submitButtonLoading = false;
                }
                break;
            case 'catchOpenSnack':
                draft.todoValue = "";
                draft.openSnack = true;
                draft.submitButton = false;
                draft.submitButtonLoading = false;
                break;
            case 'catchCloseSnack':
                draft.openSnack = false;
                break;
            default:
                break;
        }
    };

    const [state, dispatch] = useImmerReducer(ReduceFunction, initialstate);

    function formSubmit(e) {
        e.preventDefault();
        if (state.todoValue.length === 0) {
            dispatch({ type: 'catchTodoError', todoChosen: state.todoValue })
        }
        else {
            dispatch({ type: 'changeRequest' })
        }
    };

    useEffect(() => {
        if (state.sendRequest) {
            async function createTodo() {
                try {
                    const response = await axios.post(
                        URLS.createTodoUrl,
                        {
                            'task': state.todoValue
                        }
                    )
                    dispatch({ type: 'catchOpenSnack' })

                } catch (error) {
                    console.log(error);
                }
            }
            createTodo();

        }
    }, [state.sendRequest])


    useEffect(() => {
        if (state.openSnack) {
            setTimeout(() => {
                dispatch({ type: 'catchCloseSnack' })
                props.addTodoStatus();
            }, 1500)
        }
    }, [state.openSnack])


    return (
        <>
            <form onSubmit={formSubmit}>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={8} md={8}>
                        <TextField
                            fullWidth
                            label="Enter Todo"
                            variant="outlined"
                            value={state.todoValue}
                            onChange={(event) => dispatch({ type: 'catchTodoChange', todoChosen: event.target.value })}
                            // onBlur={(e) => } 
                            error={state.todoError.hasError ? true : false}
                            helperText={state.todoError.errorMessage}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} md={4}>
                        <LoadingButton
                            fullWidth
                            style={{ height: '100%' }}
                            loadingPosition="start"
                            startIcon={<AddIcon />}
                            disabled={state.submitButton}
                            loading={state.submitButtonLoading}
                            variant="contained"
                            type='submit'
                        >
                            <span>Add Todo</span>

                        </LoadingButton>
                    </Grid>
                </Grid>
            </form>
            <Snackbar
                open={state.openSnack}
                autoHideDuration={6000}
                message="Successfully add Todo!"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
            />
        </>
    )
}

export default AddTodo;