import { useEffect, useState } from 'react'
import './App.css'
import {
  ButtonGroup,
  IconButton,
  Paper
} from '@mui/material'
import { NavigateBefore, NavigateNext } from '@mui/icons-material'
import Search from './components/Search'
import SheetList from './components/SheetList'

export interface Instrument {
  short_name: string
  full_name: string
  category: string
}

export interface Song {
  title: string
}

export interface Sheet {
  kind: string
  id: string
  name: string
  mimeType: string
  title: string,
  instrument: string
}

export interface SheetGroup {
  title: string
  sheets: Sheet[]
}

function App() {
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [songs, setSongs] = useState<Song[]>([])
  const [selInstruments, selectInstruments] = useState<Instrument[]>([])
  const [selSongs, selectSongs] = useState<Song[]>([])
  const [groupMethod2, selectGroupMethod2] = useState<number>(-1)
  const [sheets, setSheets] = useState<Sheet[]>([])
  const [step, setStep] = useState<number>(0)
  const filterSheetFn = (sh: Sheet) => (
    selSongs.map(s => s.title).includes(sh.title) && selInstruments.map(i => i.short_name).includes(sh.instrument)
  )

  const firstStep = (
    <Search
      songs={songs}
      instruments={instruments}
      selInstruments={selInstruments}
      selSongs={selSongs}
      selectSongs={selectSongs}
      selectInstruments={selectInstruments}
    />
  )

  const secondStep = (
    <SheetList
      groupingIndex={groupMethod2}
      selectGroupingIndex={selectGroupMethod2}
      sheets={sheets.filter(filterSheetFn)}
    />
  )

  const steps = [firstStep, secondStep]

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

      <Paper elevation={0}>
        {steps[step]}
      </Paper>

      <ButtonGroup
        className='navigation'
        sx={{ justifyContent: 'space-between' }}
      >
        <IconButton
          size='small'
          color='primary'
          onClick={() => setStep(prev => prev - 1)}
          disabled={step === 0}
        >
          <NavigateBefore /> Back
        </IconButton>

        <IconButton
          size='small'
          color='primary'
          onClick={() => setStep(prev => prev + 1)}
          disabled={step === steps.length - 1}
        >
          Next <NavigateNext />
        </IconButton>
      </ButtonGroup>
    </>
  )
}

export default App
