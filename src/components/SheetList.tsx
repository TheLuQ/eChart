import DownloadIcon from '@mui/icons-material/Download';
import {
  Alert,
  Button,
  CircularProgress,
  Divider,
  FormLabel,
  List,
  ListItemButton,
  ListItemText,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
  type AlertColor
} from '@mui/material'
import type { Sheet } from '../App'
import { useState } from 'react'
import { mergePdfs } from '../PdfReader'
import type { NavigationProps } from './Navigation';
import Navigation from './Navigation';
import { createGroups } from '../utils/groupSheets'

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
    { state: 'instrument voice', fn: (sh: Sheet) => `${sh.instrument} ${sh.part ? sh.part : ''}` },
    { state: 'title', fn: (sheet: Sheet) => sheet.title }
  ]
  const currentConf = confs[groupingIndex]
  const currentGroups = createGroups(sheets, currentConf.fn).sort((a, b) => a.title.localeCompare(b.title))
  const getAllGroups = () => currentGroups.forEach(gr => mergePdfs(gr.sheets, gr.title))

  return (
    <>
      <div className='radio' hidden={sheets.length === 0}>
        <FormLabel id="grouping-label">
          Choose grouping type
        </FormLabel>
        <ToggleButtonGroup
          aria-label="grouping-label"
          value={groupingIndex}
          exclusive
          onChange={(_, val) => selectGroupingIndex(val)}
        >
          <ToggleButton value={0}>Instrument</ToggleButton>
          <ToggleButton value={1}>Instrument voice</ToggleButton>
          <ToggleButton value={2}>Title</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div hidden={groupingIndex === -1}>
        {sheets.length > 0 ? <List>
          {groupingIndex >= 0 &&
            currentGroups.map((group, groupNo) => (
              <div key={group.title}>
                <ListItemButton sx={{ justifyContent: 'space-between' }}>
                  <ListItemText
                    primary={group.title}
                    secondary={`${group.count} files`}
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