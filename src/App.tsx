import { useEffect, useState } from 'react'
import './App.css'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import {
  Autocomplete,
  Button,
  Divider,
  FormControlLabel,
  FormLabel,
  List,
  ListItemButton,
  ListItemText,
  Radio,
  RadioGroup,
  TextField,
  type AutocompleteRenderInputParams
} from '@mui/material'

interface Instrument {
  name: string
}

interface Song {
  title: string
}

interface Sheet {
  kind: string
  id: string
  name: string
  mimeType: string
  title: string,
  instrument: string
}

interface SheetGroup {
  title: string
  sheets: Sheet[]
}

type GroupingKey = (sh: Sheet) => string

function App() {
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [songs, setSongs] = useState<Song[]>([])
  const [selInstruments, selectInstruments] = useState<Instrument[]>([])
  const [selSongs, selectSongs] = useState<Song[]>([])
  const [groupMethod2, selectGroupMethod2] = useState<number>(-1)
  const [sheets, setSheets] = useState<Sheet[]>([])

  const confs = [
    { state: 'instrument', fn: (sheet: Sheet) => sheet.instrument },
    { state: 'type', fn: (sheet: Sheet) => sheet.mimeType }
  ]
  const currentConf = confs[groupMethod2]

  function createGroups(sheets: Sheet[], getKey: GroupingKey) {
    const resultMap = new Map<string, Sheet[]>()

    sheets.forEach(sheet => {
      const key = getKey(sheet)
      const prev = resultMap.get(key) || []
      prev.push(sheet)
      resultMap.set(key, prev)
    })

    return Array.from(resultMap.entries())
      .map<SheetGroup>(entry => ({
        title: entry[0],
        sheets: entry[1]
      }))
  }


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
      <h1>eChart</h1>

      <div hidden>
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
          getOptionLabel={(opt) => opt.name}
          isOptionEqualToValue={(a, b) => a.name === b.name}
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
      </div>

      <div className='radio'>
        <FormLabel id="demo-radio-buttons-group-label">
          Choose grouping type
        </FormLabel>

        <RadioGroup
          row
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          value={groupMethod2}
        >
          {confs.map((conf, index) => (
            <FormControlLabel
              key={conf.state}
              checked={groupMethod2 === index}
              onChange={() => selectGroupMethod2(index)}
              value={conf.state}
              control={<Radio />}
              label={conf.state}
            />
          ))}
        </RadioGroup>
      </div>

      <div hidden={groupMethod2 === -1}>
        <List>
          {groupMethod2 >= 0 &&
            createGroups(sheets, currentConf.fn).map(group => (
              <div key={group.title}>
                <ListItemButton sx={{ justifyContent: 'space-between' }}>
                  <ListItemText
                    primary={group.title}
                    secondary={`${group.sheets.length} files`}
                  />
                  <Button>
                    <OpenInNewIcon color="primary" />
                  </Button>
                </ListItemButton>
                <Divider />
              </div>
            ))
          }
        </List>
      </div>
    </>
  )
}

export default App
