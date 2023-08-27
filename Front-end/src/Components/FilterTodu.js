import React, {useEffect} from 'react'
import { Select, FormControl, InputLabel, MenuItem } from '@mui/material'

function FilterTodo(props) {
    const [filterValue, setFilterValue] = React.useState('');

    const handleChange = (event) => {
        setFilterValue(event.target.value);
    };
    
    useEffect(() => {
        props.showTodoFilter(filterValue);
    }, [filterValue])


    return (
        <>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-helper-label">Todo Filter</InputLabel>
                <Select
                    labelId="demo-simple-select-helper-label"
                    value={filterValue}
                    label="Todo Filter"
                    onChange={handleChange}
                >
                    <MenuItem value={''}>
                        <em>None</em>
                    </MenuItem>
                    <MenuItem  value='active'>Active</MenuItem>
                    <MenuItem  value='deactivate'>Deactivate</MenuItem>
                </Select>
            </FormControl>
        </>
    )
}

export default FilterTodo;