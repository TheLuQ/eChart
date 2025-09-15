import { useState } from 'react'
import './App.css'
import {
  Paper
} from '@mui/material'
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
  instrument: string,
  part?: number
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
    <SheetList
      sheets={filteredSheets}
      prevAction={() => setStep(prev => prev - 1)}
      prevDisabled={false}
    />
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
