import React, {
  useEffect,
  useMemo,
  useState,
  type SetStateAction
} from "react"
import type { Sheet, SheetGroup } from "../App"
import Navigation, { type NavigationProps } from "./Navigation"
import SearchBar from "./SearchBar"

interface MyProps extends NavigationProps {
  setFilteredSheets: React.Dispatch<SetStateAction<Sheet[]>>
}

function flattenSheets(sheets: SheetGroup[]): Sheet[] {
  const result: Sheet[] = []
  sheets.forEach(sh => {
    sh.instruments.forEach(instr => {
      result.push({
        id: instr.id,
        name: instr.file_name,
        title: sh.title,
        instrument: instr.instrument_name_en,
        name_pol: instr.instrument_name_pol,
        key: instr.key,
        part: instr.voice
      })
    })
  })
  return result
}

export default function Search(props: MyProps) {
  const { setFilteredSheets, prevAction, nextAction } = props

  // State management
  const [selInstruments, selectInstruments] = useState<string[]>([])
  const [sheets, setSheets] = useState<Sheet[]>([])
  const [selSongs, setSelSongs] = useState<string[]>([])
  const [errState, setErrState] = useState<boolean[]>([false, false])
  const instruments = useMemo(() => new Set(
    sheets
      .map(instr => instr.instrument)
      .sort()
  ), [sheets])

  // Filter logic
  const filterSheetFn = (sh: Sheet) => (
    selSongs.includes(sh.title) &&
    selInstruments.includes(sh.instrument)
  )
  const filtSheets = sheets.filter(filterSheetFn)
  const canSubmit = () => {
    const inputErrors = [selSongs.length === 0, selInstruments.length === 0]
    setErrState(inputErrors)
    return !inputErrors[0] && !inputErrors[1]
  }

  // Data fetching effect
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND}/api/sheets`)
      .then(res => res.json())
      .then(data => { setSheets(flattenSheets(data)) })
  }, [])

  return (
    <>
      <p>Select which sheets do you want to show</p>
      {/* Songs Selection */}
      <SearchBar
        error={errState[0]}
        setError={() => setErrState(prev => [false, prev[1]])}
        label="Select songs"
        options={[...new Set(sheets.map(song => song.title).sort())]}
        setFilteredResult={setSelSongs}
      />

      {/* Instruments Selection */}
      <SearchBar
        error={errState[1]}
        setError={() => setErrState(prev => [prev[0], false])}
        label="Select instruments"
        options={[...instruments]}
        setFilteredResult={selectInstruments}
        disabled={selSongs.length === 0}
      />
      <Navigation
        prevAction={prevAction}
        nextAction={() => { setFilteredSheets(filtSheets); if (canSubmit()) { nextAction?.() } }}
        prevDisabled={true}
      />
    </>
  )
}