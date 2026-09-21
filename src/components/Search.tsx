import React, {
  useEffect,
  useMemo,
  useState,
  type SetStateAction
} from "react"
import type { Sheet } from "../App"
import Navigation, { type NavigationProps } from "./Navigation"
import SearchBar from "./SearchBar"

interface MyProps extends NavigationProps {
  setFilteredSheets: React.Dispatch<SetStateAction<Sheet[]>>
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
      .map(instr => instr.instrument_name_en)
      .sort()
  ), [sheets])

  // Filter logic
  const filterSheetFn = (sh: Sheet) => (
    selSongs.includes(sh.title) &&
    selInstruments.includes(sh.instrument_name_en)
  )
  const filtSheets = sheets.filter(filterSheetFn)
  const canSubmit = () => {
    const inputErrors = [selSongs.length === 0, selInstruments.length === 0]
    setErrState(inputErrors)
    return !inputErrors[0] && !inputErrors[1]
  }

  // Data fetching effect
  useEffect(() => {
    fetch(`/api/sheets`)
      .then(res => res.json())
      .then(data => { setSheets(data) })
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