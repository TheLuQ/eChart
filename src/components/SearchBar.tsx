import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Chip,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    type AutocompleteRenderInputParams,
} from "@mui/material";
import { useState, type SetStateAction } from "react";

export interface ISearch {
    error: boolean
    setError: React.Dispatch<SetStateAction<boolean>>
    options: string[]
    label: string
    setFilteredResult: React.Dispatch<SetStateAction<string[]>>
}


export default function SearchBar(props: ISearch) {
    const isMobile = navigator.userAgent.search(/Windows/i) === -1
    return isMobile ? MobileBar(props) : DesktopBar(props)
}

function DesktopBar(props: ISearch) {
    const [currentOpts, setCurrentOpts] = useState<string[]>([])
    const errorState = props.error && currentOpts.length === 0

    return (
        <Autocomplete
            multiple
            value={currentOpts}
            className="input"
            disableCloseOnSelect={true}
            onChange={(_, values) => {
                setCurrentOpts(values)
                props.setFilteredResult(values)
            }}
            options={props.options}
            renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField
                    sx={{ maxWidth: '500px' }}
                    multiline
                    error={errorState}
                    onFocus={() => props.setError(false)}
                    {...params}
                    label={props.label}
                    variant="outlined"
                />
            )}
        />
    )
}

function MobileBar(props: ISearch) {
    const [currentOpts, setCurrentOpts] = useState<string[]>([])
    const errorState = props.error && currentOpts.length === 0
    const [searchOptionsOpened, setOpenSearchOptions] = useState<boolean>(false)

    return (
        <FormControl className="mobileInput" error={errorState}>
            <InputLabel id={props.label}>{props.label}</InputLabel>
            <Select
                sx={{ maxWidth: '500px' }}
                multiple
                id={props.label}
                multiline
                value={currentOpts}
                label={props.label}
                open={searchOptionsOpened}
                onOpen={() => setOpenSearchOptions(true)}
                onClose={() => setOpenSearchOptions(false)}
                MenuProps={{ style: { maxHeight: '75%' } }}
                onFocus={() => props.setError(false)}
                variant="outlined"
                renderValue={(songs) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {songs.map((song) => (
                            <Chip
                                label={song}
                                key={song}
                                onDelete={() => {
                                    setCurrentOpts((prev) => prev.filter((s) => s !== song))
                                }}
                                onMouseDown={(ev) => {
                                    ev.stopPropagation()
                                }}
                            />
                        ))}
                    </Box>
                )}
                onChange={(ev) => {
                    const selectedValues = typeof ev.target.value === 'string'
                        ? ev.target.value.split(',')
                        : ev.target.value
                    setCurrentOpts(selectedValues)
                    props.setFilteredResult(selectedValues)
                }}
            >
                {props.options.map((song) => (
                    <MenuItem key={song} value={song}>
                        <ListItemText primary={song} />
                        <Checkbox checked={currentOpts.includes(song)} />
                    </MenuItem>
                ))}
                <div style={{ position: 'sticky', bottom: 0 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => setOpenSearchOptions(false)}
                    >Apply</Button>
                </div>
            </Select>
        </FormControl>
    )
}