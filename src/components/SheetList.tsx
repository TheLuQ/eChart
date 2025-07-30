import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import {
  Button,
  Divider,
  FormControlLabel,
  FormLabel,
  List,
  ListItemButton,
  ListItemText,
  Radio,
  RadioGroup
} from '@mui/material'
import type { Sheet, SheetGroup } from '../App'
import type { SetStateAction } from 'react'

type GroupingKey = (sh: Sheet) => string

interface ListProps {
  groupingIndex: number
  selectGroupingIndex: (value: SetStateAction<number>) => void
  sheets: Sheet[]
}

export default function SheetList(props: ListProps) {
  const { groupingIndex, selectGroupingIndex, sheets } = props

  const confs = [
    { state: 'instrument', fn: (sheet: Sheet) => sheet.instrument },
    { state: 'type', fn: (sheet: Sheet) => sheet.mimeType },
    { state: 'title', fn: (sheet: Sheet) => sheet.title }
  ]
  const currentConf = confs[groupingIndex]

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

  return (
    <>
      <div className='radio'>
        <FormLabel id="demo-radio-buttons-group-label">
          Choose grouping type
        </FormLabel>

        <RadioGroup
          row
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          value={groupingIndex}
        >
          {confs.map((conf, index) => (
            <FormControlLabel
              key={conf.state}
              checked={groupingIndex === index}
              onChange={() => selectGroupingIndex(index)}
              value={conf.state}
              control={<Radio />}
              label={conf.state}
            />
          ))}
        </RadioGroup>
      </div>

      <div hidden={groupingIndex === -1}>
        <List>
          {groupingIndex >= 0 &&
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