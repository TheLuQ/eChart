import { useRef, useState } from 'react'
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

export interface Stepper {
  submit(): void
  canSubmit(): boolean
}

function App() {
  const [step, setStep] = useState<number>(0)
  const [filteredSheets, setFilteredSheets] = useState<Sheet[]>([])
  const sourceRef = useRef<Stepper>({ submit: () => { }, canSubmit: () => false })

  const firstStep = (
    <Search
      ref={sourceRef}
      setFilteredSheets={setFilteredSheets}
    />
  )

  const secondStep = (
    filteredSheets.length > 0 ? <SheetList
      sheets={filteredSheets}
    /> : <div>No results. Please redefine query</div>
  )

  const steps = [firstStep, secondStep]

  return (
    <>
      <h1>eChart</h1>

      <Paper elevation={0}>
        {steps[step]}
      </Paper>

      <ButtonGroup
        className='navigation'
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
          onClick={() => { if (sourceRef.current.canSubmit()) { sourceRef.current.submit(); setStep(prev => prev + 1) } }}
          disabled={step === steps.length - 1}
        >
          Next <NavigateNext />
        </IconButton>
      </ButtonGroup>
    </>
  )
}

export default App
