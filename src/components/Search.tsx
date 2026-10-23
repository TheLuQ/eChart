import React, {
  useEffect,
  useState,
  type SetStateAction
} from "react"
import { useParams } from "react-router-dom"
import type { Sheet } from "../App"
import Navigation, { type NavigationProps } from "./Navigation"
import SearchBar, { type SearchOption } from "./SearchBar"

interface MyProps extends NavigationProps {
  setFilteredSheets: React.Dispatch<SetStateAction<Sheet[]>>
}

async function getSheets(bandId: string | undefined, groupKeys: string[]): Promise<Sheet[]> {
  const queryParams = new URLSearchParams()
  groupKeys.forEach(groupKey => queryParams.append("group_key", groupKey))

  const queryString = queryParams.toString()
  const url = `/api/bands/${bandId}/sheets${queryString ? `?${queryString}` : ""}`

  return fetch(url, {
    method: "GET"
  })
    .then(res => res.json() as Promise<Sheet[]>)
}

export default function Search(props: MyProps) {
  const { setFilteredSheets, prevAction, nextAction } = props
  const { bandId } = useParams<{ bandId: string }>()

  // State management
  const [titleOptions, setTitleOptions] = useState<SearchOption[]>([])
  const [selSongs, setSelSongs] = useState<string[]>([])
  const [songError, setSongError] = useState(false)

  const canSubmit = () => {
    const hasError = selSongs.length === 0
    setSongError(hasError)
    return !hasError
  }

  const handleNext = async () => {
    if (!canSubmit()) {
      return
    }

    const filteredSheets = await getSheets(bandId, selSongs)
    setFilteredSheets(filteredSheets)
    nextAction?.()
  }

  // Data fetching effect
  useEffect(() => {
    fetch(`/api/bands/${bandId}/titles`)
      .then(res => res.json() as Promise<{ titles: SearchOption[] }>)
      .then(({ titles }) => {
        setTitleOptions(
          [...titles].sort((left, right) => left.title.localeCompare(right.title))
        )
      })
  }, [bandId])

  return (
    <>
      <p>Select which sheets do you want to show</p>
      {/* Songs Selection */}
      <SearchBar
        error={songError}
        setError={setSongError}
        label="Select songs"
        options={titleOptions}
        setFilteredResult={setSelSongs}
      />
      <Navigation
        prevAction={prevAction}
        nextAction={handleNext}
        prevDisabled={true}
      />
    </>
  )
}