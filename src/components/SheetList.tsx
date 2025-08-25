import DownloadIcon from '@mui/icons-material/Download';
import {
  Alert,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormLabel,
  List,
  ListItemButton,
  ListItemText,
  Radio,
  RadioGroup,
  Snackbar,
  type AlertColor
} from '@mui/material'
import type { Sheet, SheetGroup } from '../App'
import { useState } from 'react'
import { mergePdfs } from '../PdfReader'
import type { NavigationProps } from './Navigation';
import Navigation from './Navigation';

type GroupingKey = (sh: Sheet) => string

interface ListProps extends NavigationProps {
  sheets: Sheet[],
  defaultGroupingOption?: number
}

interface Alert {
  message: string
  severity: AlertColor
}

export default function SheetList(props: ListProps) {
  const { sheets, prevAction, defaultGroupingOption } = props
  const [groupingIndex, selectGroupingIndex] = useState(defaultGroupingOption ?? 0)
  const successAlert: Alert = {
    message: 'Sheets merged successfully!',
    severity: 'success'
  }
  const errorAlert: Alert = {
    message: 'Network error. Can\'t get sheets from Internet :(',
    severity: 'warning'
  }
  const [alert, setOpenAlert] = useState<Alert | undefined>(undefined)
  const [loadingNumber, setLoadingNumber] = useState<number>(-1)

  const confs = [
    { state: 'instrument', fn: (sheet: Sheet) => sheet.instrument },
    { state: 'one file', fn: (sheet: Sheet) => sheet.mimeType },
    { state: 'title', fn: (sheet: Sheet) => sheet.title }
  ]
  const currentConf = confs[groupingIndex]
  const currentGroups = createGroups(sheets, currentConf.fn)
  const getAllGroups = () => currentGroups.forEach(gr => mergePdfs(gr.sheets, gr.title))

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
      <div className='radio' hidden={sheets.length === 0}>
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
        {sheets.length > 0 ? <List>
          {groupingIndex >= 0 &&
            currentGroups.map((group, groupNo) => (
              <div key={group.title}>
                <ListItemButton sx={{ justifyContent: 'space-between' }}>
                  <ListItemText
                    primary={group.title}
                    secondary={`${group.sheets.length} files`}
                  />
                  <Button onClick={() => {
                    setLoadingNumber(groupNo)
                    mergePdfs(group.sheets, group.title)
                      .then(() => setOpenAlert(successAlert))
                      .catch((err) => { console.log(err); setOpenAlert(errorAlert) })
                      .finally(() => setLoadingNumber(-1))
                  }
                  }>
                    {loadingNumber === groupNo ? <CircularProgress size="2rem" /> : <DownloadIcon color="primary" />}
                  </Button>
                </ListItemButton>
                <Divider />
              </div>
            ))
          }
        </List> : <div>No results. Please redefine query</div>}
        <Navigation
          prevAction={prevAction}
          nextAction={getAllGroups}
          prevDisabled={false}
          customNextButtonLabel={<>Get all <DownloadIcon color="primary" /></>}
        />
        <Snackbar
          open={alert != undefined}
          autoHideDuration={2000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={() => setOpenAlert(undefined)}
        >
          {alert && <Alert
            onClose={() => setOpenAlert(undefined)}
            severity={alert?.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {alert?.message}
          </Alert>}
        </Snackbar>
      </div>
    </>
  )
}