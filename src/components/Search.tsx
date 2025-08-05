import {
  Autocomplete,
  TextField,
  type AutocompleteRenderInputParams
} from "@mui/material"
import React, {
  useEffect,
  useImperativeHandle,
  useState,
  type SetStateAction
} from "react"
import type { Instrument, Sheet, Song, Stepper } from "../App"

interface MyProps {
  ref: React.RefObject<Stepper>
  setFilteredSheets: React.Dispatch<SetStateAction<Sheet[]>>
}

export default function Search(props: MyProps) {
  const { ref, setFilteredSheets } = props

  // State management
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [songs, setSongs] = useState<Song[]>([])
  const [selInstruments, selectInstruments] = useState<Instrument[]>([])
  const [sheets, setSheets] = useState<Sheet[]>([])
  const [selSongs, selectSongs] = useState<Song[]>([])
  const [errState, setErrState] = useState<boolean[]>([false, false])

  // Filter logic
  const filterSheetFn = (sh: Sheet) => (
    selSongs.map(s => s.title).includes(sh.title) &&
    selInstruments.map(i => i.short_name).includes(sh.instrument)
  )
  const filtSheets = sheets.filter(filterSheetFn)
  const errstate = [selSongs.length === 0, selInstruments.length === 0]

  // Imperative handle for stepper
  useImperativeHandle(ref, () => ({
    submit: () => {
      setFilteredSheets(filtSheets)
    },
    label: 'Next',
    canSubmit: () => { setErrState(errstate); return selSongs.length > 0 && selInstruments.length > 0 }
  }))

  // Data fetching effect
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND}/instruments`)
      .then(res => res.json())
      .then(data => setInstruments(data))

    fetch(`${import.meta.env.VITE_BACKEND}/titles`)
      .then(res => res.json())
      .then(data => setSongs(data))

    fetch(`${import.meta.env.VITE_BACKEND}/sheets`)
      .then(res => res.json())
      .then(data => setSheets(data))
  }, [])

  return (
    <>
      <p>Select which sheets do you want to show</p>

      {/* Songs Selection */}
      <Autocomplete
        multiple
        value={selSongs}
        className="input"
        disableCloseOnSelect={true}
        getOptionLabel={(opt) => opt.title}
        isOptionEqualToValue={(a, b) => a.title === b.title}
        onChange={(_, value) => selectSongs(value)}
        options={songs}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <TextField
            sx={{ maxWidth: '500px' }}
            multiline
            error={errState[0]}
            onClick={() => setErrState(prev => [false, prev[1]])}
            {...params}
            label="Select songs"
            variant="outlined"
            helperText={errState[0] ? 'Please select which song do you want to select...' : null}
          />
        )}
      />

      {/* Instruments Selection */}
      <Autocomplete
        multiple
        value={selInstruments}
        className="input"
        disableCloseOnSelect={true}
        getOptionLabel={(opt) => opt.full_name}
        isOptionEqualToValue={(a, b) => a.short_name === b.short_name}
        onChange={(_, value) => selectInstruments(value)}
        autoHighlight={true}
        options={instruments}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <TextField
            sx={{ maxWidth: '500px' }}
            multiline
            error={errState[1]}
            onClick={() => setErrState(prev => [prev[0], false])}
            {...params}
            label="Select instruments"
            variant="outlined"
            helperText={errState[1] ? 'Please select which instruments do you want to select...' : null}
          />
        )}
      />
    </>
  )
}