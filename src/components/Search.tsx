import {
  Autocomplete,
  TextField,
  type AutocompleteRenderInputParams
} from "@mui/material"
import type { Instrument, Song } from "../App"
import type { SetStateAction } from "react"

interface MyProps {
  songs: Song[]
  selSongs: Song[]
  instruments: Instrument[]
  selInstruments: Instrument[]
  selectSongs: (value: SetStateAction<Song[]>) => void
  selectInstruments: (value: SetStateAction<Instrument[]>) => void
}

export default function Search(props: MyProps) {
  const {
    songs,
    selSongs,
    instruments,
    selInstruments,
    selectSongs,
    selectInstruments
  } = props

  return (
    <>
      <p>Select which sheets do you want to show</p>

      <Autocomplete
        multiple
        value={selSongs}
        className='input'
        disableCloseOnSelect={true}
        getOptionLabel={(opt) => opt.title}
        isOptionEqualToValue={(a, b) => a.title === b.title}
        onChange={(_, value) => selectSongs(value)}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <TextField
            sx={{ maxWidth: '500px' }}
            multiline
            {...params}
            label="Select songs"
            variant="outlined"
          />
        )}
        options={songs}
      />

      <Autocomplete
        multiple
        value={selInstruments}
        className='input'
        disableCloseOnSelect={true}
        getOptionLabel={(opt) => opt.full_name}
        isOptionEqualToValue={(a, b) => a.short_name === b.short_name}
        onChange={(_, value) => selectInstruments(value)}
        autoHighlight={true}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <TextField
            sx={{ maxWidth: '500px' }}
            multiline
            {...params}
            label="Select instruments"
            variant="outlined"
          />
        )}
        options={instruments}
      />
    </>
  )
}