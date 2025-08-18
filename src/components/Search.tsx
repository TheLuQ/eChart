import React, {
  useEffect,
  useState,
  type SetStateAction
} from "react"
import type { Instrument, Sheet, Song } from "../App"
import Navigation, { type NavigationProps } from "./Navigation"
import SearchBar from "./SearchBar"

interface MyProps extends NavigationProps {
  setFilteredSheets: React.Dispatch<SetStateAction<Sheet[]>>
}

export default function Search(props: MyProps) {
  const { setFilteredSheets, prevAction, nextAction } = props

  // State management
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [songs, setSongs] = useState<Song[]>([])
  const [selInstruments, selectInstruments] = useState<string[]>([])
  const [sheets, setSheets] = useState<Sheet[]>([])
  const [selSongs, setSelSongs] = useState<string[]>([])
  const [errState, setErrState] = useState<boolean[]>([false, false])

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
    fetch(`${import.meta.env.VITE_BACKEND}/api/instruments`)
      .then(res => res.json())
      .then(data => setInstruments(data))

    fetch(`${import.meta.env.VITE_BACKEND}/api/titles`)
      .then(res => res.json())
      .then(data => setSongs(data))

    fetch(`${import.meta.env.VITE_BACKEND}/api/sheets`)
      .then(res => res.json())
      .then(data => setSheets(data))
  }, [])

  return (
    <>
      <p>Select which sheets do you want to show</p>
      {/* Songs Selection */}
      <SearchBar
        error={errState[0]}
        setError={() => setErrState(prev => [false, prev[1]])}
        label="Select songs"
        options={songs.map(song => song.title)}
        setFilteredResult={setSelSongs}
      />

      {/* Instruments Selection */}
      <SearchBar
        error={errState[1]}
        setError={() => setErrState(prev => [prev[0], false])}
        label="Select instruments"
        options={instruments.map(instr => instr.full_name)}
        setFilteredResult={selectInstruments}
      />
      <Navigation
        prevAction={prevAction}
        nextAction={() => { setFilteredSheets(filtSheets); if (canSubmit()) { nextAction?.() } }}
        prevDisabled={true}
      />
    </>
  )
}