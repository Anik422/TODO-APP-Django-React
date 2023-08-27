import React, { useEffect } from 'react';
import { makeStyles } from 'tss-react/mui';
import { Grid, Checkbox, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Slide, TextField, Snackbar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';

//immer
import { useImmerReducer } from 'use-immer';

import URLS from './URLS';
import axios from 'axios';



const useStyles = makeStyles((theme) => ({
    taskGridContainer: {
        backgroundColor: 'red',
        marginBottom: '50px'
    },
    taskContainer: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    taskText: {
        flexGrow: 1,
        padding: theme.spacing(1), // Adjust the padding as needed
        wordWrap: 'break-word',
        whiteSpace: 'pre-line',
    },
    taskTextIsComplite: {
        flexGrow: 1,
        padding: theme.spacing(1), // Adjust the padding as needed
        wordWrap: 'break-word',
        whiteSpace: 'pre-line',
        textDecoration: "underline",
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Task(props) {
    const classes = useStyles();


    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = React.useState(false);
    const [editTaskOpen, seteditTaskOpen] = React.useState(false);

    const handleDelete = () => {
        dispatch({type: "deleteTaskConfirmation"});
        setDeleteConfirmationOpen(false);
    };

    const handleOpenDeleteConfirmation = () => {
        setDeleteConfirmationOpen(true);
    };

    const handleCloseDeleteConfirmation = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleEdit = () => {
        if(!state.taskDetais.completed){
            seteditTaskOpen(true);
        }else{
            dispatch({type: 'updateTaskRequestNotification', open: true, message: "Completed tasks are not editable!"});
        }
    };

    const handleOpenEditSave = () => {
        dispatch({ type: "editTaskRequest" })
        seteditTaskOpen(false);
    };

    const handleCloseEdit = () => {
        seteditTaskOpen(false);
    };



    const initialstate = {
        taskDetais: {
            task: props.data.task,
            completed: props.data.completed,
        },
        taskCompletedRequest: 0,
        addNewTodo: true,
        editTask: props.data.task,
        updateTaskRequest: 0,
        updateTaskRequestNotification: {
            open: false,
            message: ''
        },
        deleteTaskConfirmation: false, 

    };

    function ReduceFunction(draft, action) {
        switch (action.type) {
            case 'chooseTodoCompleteStatus':
                draft.taskDetais.task = action.updateTodoResponse.task;
                draft.taskDetais.completed = action.updateTodoResponse.completed;
                break;
            case 'chooseTaskCompletedRequest':
                draft.taskCompletedRequest = draft.taskCompletedRequest + 1;
                break;
            case 'addTodo':
                draft.addNewTodo = !draft.addNewTodo;
                break;
            case 'editTask':
                draft.editTask = action.editTaskValue;
                break;
            case 'editTaskRequest':
                draft.updateTaskRequest = draft.updateTaskRequest + 1;
                break;
            case 'deleteTaskConfirmation':
                draft.deleteTaskConfirmation = true;
                break;
            case 'updateTaskRequestNotification':
                draft.updateTaskRequestNotification.open = action.open;
                draft.updateTaskRequestNotification.message = action.message;
                break;
            default:
                break;
        }
    };

    const [state, dispatch] = useImmerReducer(ReduceFunction, initialstate);


    useEffect(() => {
        if (state.taskCompletedRequest) {
            async function todoStatusChangeServer() {

                try {
                    const response = await axios.put(
                        `${URLS.createTodoUrl}${props.data.id}/`,
                        {
                            "task": state.taskDetais.task,
                            "completed": !state.taskDetais.completed
                        }
                    )
                    dispatch({ type: 'chooseTodoCompleteStatus', updateTodoResponse: response.data });

                } catch (error) {
                    console.log(error);
                }

            }
            todoStatusChangeServer();
        }

    }, [state.taskCompletedRequest])


    useEffect(() => {
        if (state.updateTaskRequest) {
            async function todoStatusChangeServer() {

                try {
                    const response = await axios.put(
                        `${URLS.createTodoUrl}${props.data.id}/`,
                        {
                            "task": state.editTask,
                            "completed": state.taskDetais.completed
                        }
                    )
                    dispatch({ type: 'chooseTodoCompleteStatus', updateTodoResponse: response.data });
                    dispatch({ type: "updateTaskRequestNotification", open: true, message: 'Successfully updated the task.' });

                } catch (error) {
                    dispatch({ type: "updateTaskRequestNotification", open: true, message: "Internal server error!" });
                }

            }
            todoStatusChangeServer();
        }

    }, [state.updateTaskRequest])

    useEffect(() => {
        if (state.deleteTaskConfirmation) {
            async function deleteTask() {

                try {
                    const response = await axios.delete(
                        `${URLS.createTodoUrl}${props.data.id}/`,
                    )
                    // dispatch({ type: 'chooseTodoCompleteStatus', updateTodoResponse: response.data });
                    dispatch({ type: "updateTaskRequestNotification", open: true, message: 'Successfully deleted task!' });
                    

                } catch (error) {
                    dispatch({ type: "updateTaskRequestNotification", open: true, message: "Internal server error!" });
                }

            }
            deleteTask();
        }

    }, [state.deleteTaskConfirmation])

    useEffect(() => {
        if (state.updateTaskRequestNotification.open) {
            setTimeout(() => {
                dispatch({ type: "updateTaskRequestNotification", open: false, message: '' })
            }, 1500)
        }
    }, [state.updateTaskRequestNotification.open])


    useEffect(() => {
        if (state.deleteTaskConfirmation) {
            setTimeout(() => {
                dispatch({ type: "updateTaskRequestNotification", open: false, message: '' })
                props.addTodoStatus();
            }, 1500)
        }
    }, [state.deleteTaskConfirmation])


    return (
        <div style={{ marginBottom: '10px', border: '2px solid gray', borderRadius: '8px', padding: '10px 5px' }}>

            <Grid container justifyContent="space-between" alignItems="center" direction="row" width="100%">
                <Grid item container justifyContent="start" alignItems="center" spacing={2} xs={9}>
                    <Grid item xs={2} >
                        <Checkbox
                            checked={state.taskDetais.completed}
                            onChange={(e) => dispatch({ type: 'chooseTaskCompletedRequest' })}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                    </Grid>
                    <Grid item xs={10} className={classes.taskContainer}>
                        <Typography variant="body2" fontSize={20} style={ state.taskDetais.completed ? {textDecoration: "line-through", color: "gray"} : {}} className={classes.taskText}>
                            {state.taskDetais.task}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item container justifyContent='space-around' alignItems='center' xs={2}>
                    <Grid item xs={12} md={6}>
                        <IconButton aria-label="edit" size="large" onClick={handleEdit}>
                            <BorderColorIcon fontSize="inherit" />
                        </IconButton>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <IconButton aria-label="delete" size="large" onClick={handleOpenDeleteConfirmation}>
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>
                    </Grid>
                    <Dialog
                        open={editTaskOpen}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleCloseDeleteConfirmation}
                        aria-describedby="alert-dialog-slide-description"
                        fullWidth
                    >
                        <DialogTitle>Edit Todo</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Enter Todo"
                                type="text"
                                fullWidth
                                value={state.editTask}
                                variant="outlined"
                                onChange={(e) => dispatch({ type: 'editTask', editTaskValue: e.target.value })}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseEdit} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleOpenEditSave} color="primary">
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={deleteConfirmationOpen}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleCloseDeleteConfirmation}
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogContent>
                            Are you sure you want to delete this item?
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDeleteConfirmation} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleDelete} color="primary">
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Grid>
            <Snackbar
                open={state.updateTaskRequestNotification.open}
                autoHideDuration={6000}
                message={state.updateTaskRequestNotification.message}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
            />
        </div>
    );
}

export default Task;
