import './App.css'
import { Autocomplete, TextField, type AutocompleteRenderInputParams } from '@mui/material'

function App() {

  return (
    <>
      <h1>eChart</h1>
      <p>Select which sheets do you want to show</p>
      <Autocomplete className='input' renderInput={function (params: AutocompleteRenderInputParams): React.ReactNode {
        return [<TextField sx={{ maxWidth: '500px' }} multiline  {...params} label="Select songs" variant="outlined" key={0} />]
      }} options={[]}></Autocomplete>

      <Autocomplete className='input' renderInput={function (params: AutocompleteRenderInputParams): React.ReactNode {
        return [<TextField sx={{ maxWidth: '500px' }} multiline  {...params} label="Select instruments" variant="outlined" key={0} />]
      }} options={[]}></Autocomplete>
    </>
  )
}

export default App
