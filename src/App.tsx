import { useState } from 'react'
import './App.css'
import {
  Paper
} from '@mui/material'
import Search from './components/Search'
import SheetList from './components/SheetList'
import Navigation from './components/Navigation'

export interface Instrument {
  instrument_name_pol: string
  instrument_name_en: string
  file_name: string
  voice: number
  id: string
  key?: string
}

export interface SheetGroup {
  title: string
  instruments: Instrument[]
}

export interface Song {
  title: string
}

export interface Sheet {
  file_id: string
  file_name: string
  title: string,
  instrument_name_en: string,
  instrument_name_pol: string,
  key?: string,
  voice?: number,
  url: string
}

function App() {
  const [step, setStep] = useState<number>(0)
  const [filteredSheets, setFilteredSheets] = useState<Sheet[]>([])

  const firstStep = (
    <Search
      setFilteredSheets={setFilteredSheets}
      prevAction={() => { }}
      nextAction={() => { setStep(prev => prev + 1) }}
      prevDisabled={true}
    />
  )

  const secondStep = (
    <>
      <SheetList
        sheets={filteredSheets}
      />
      <Navigation
        prevAction={() => setStep(prev => prev - 1)}
        nextAction={() => { }} //to update  add disabled next action
        prevDisabled={false}
      />
    </>
  )

  const steps = [firstStep, secondStep]

  return (
    <>
      <h1>eChart</h1>

      <Paper elevation={0}>
        {steps[step]}
      </Paper>
    </>
  )
}

export default App
