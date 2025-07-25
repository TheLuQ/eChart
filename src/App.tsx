import { useEffect, useState } from 'react'
import './App.css'
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, FormControlLabel, FormLabel, List, ListItemButton, Radio, RadioGroup, TextField, Typography, type AutocompleteRenderInputParams } from '@mui/material'

interface Instrument {
  name: string
}

interface Song {
  title: string
}

function App() {
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [songs, setSongs] = useState<Song[]>([])
  const [selInstruments, selectInstruments] = useState<Instrument[]>([])
  const [selSongs, selectSongs] = useState<Song[]>([])
  const [groupMethod, selectGroupMethod] = useState<string>('undefined')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND}/instruments`)
      .then(res => res.json())
      .then(data => setInstruments(data))

    fetch(`${import.meta.env.VITE_BACKEND}/titles`)
      .then(res => res.json())
      .then(data => setSongs(data))
  }, [])

  return (
    <>
      <h1>eChart</h1>
      <div>
        <p>Select which sheets do you want to show</p>
        <Autocomplete multiple value={selSongs} className='input'
          disableCloseOnSelect={true}
          getOptionLabel={(opt) => opt.title}
          isOptionEqualToValue={(a, b) => a.title === b.title}
          onChange={(_, value) => selectSongs(value)}
          renderInput={function (params: AutocompleteRenderInputParams): React.ReactNode {
            return [<TextField sx={{ maxWidth: '500px' }} multiline  {...params} label="Select songs" variant="outlined" key={0} />]
          }} options={songs}></Autocomplete>

        <Autocomplete multiple value={selInstruments} className='input'
          disableCloseOnSelect={true}
          getOptionLabel={(opt) => opt.name}
          isOptionEqualToValue={(a, b) => a.name === b.name}
          onChange={(_, value) => selectInstruments(value)}
          autoHighlight={true}
          renderInput={function (params: AutocompleteRenderInputParams): React.ReactNode {
            return [<TextField sx={{ maxWidth: '500px' }} multiline  {...params} label="Select instruments" variant="outlined" key={1} />]
          }}
          options={instruments}>
        </Autocomplete>
      </div>

      <div className='radio' hidden>
        <FormLabel id="demo-radio-buttons-group-label">Choose grouping type</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          value={groupMethod}
          onChange={(_, value) => selectGroupMethod(value)}
        >
          <FormControlLabel value="instrument" control={<Radio />} label="instrument" />
          <FormControlLabel value="song" control={<Radio />} label="song" />
        </RadioGroup>
      </div>

      <div hidden>
        <Accordion className='acc' hidden={groupMethod === 'undefined'}>
          <AccordionSummary
            // expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">Dusty Trails</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List sx={{ display: 'flex', flexDirection: 'column' }}>
              <ListItemButton selected>Woodwind</ListItemButton>
              <ListItemButton>Brass</ListItemButton>
              <ListItemButton selected>Percussion</ListItemButton>
            </List>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  )
}

export default App
