import Search from "./Search";
import { type Dispatch, type SetStateAction } from "react";
import type { Sheet } from "../App";
import { render, screen, within } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import { setupRoutes } from "../setupTests";

beforeAll(() => {
    vi.stubEnv('VITE_BACKEND', 'http://localhost:3003')
    setupRoutes()
})

afterAll(() => {
    vi.unstubAllEnvs()
})

const renderSearch = (setFilteredSheets?: Dispatch<SetStateAction<Sheet[]>>, prevAction?: () => void, prevDisabled?: boolean) =>
    render(
        <Search
            setFilteredSheets={setFilteredSheets ?? (() => [])}
            prevAction={prevAction ?? (() => [])}
            prevDisabled={prevDisabled ?? false}
        />
    )

it('shows songs options', async () => {
    renderSearch()
    const element = screen.getByLabelText(/select songs/i)
    expect(element).toBeInTheDocument()

    await userEvent.click(element)

    const songsInput = await screen.findByRole('listbox')

    const options = within(songsInput).getAllByRole('option').map(opt => opt.textContent)
    expect(options).containSubset(['The Kerry Bog', 'Dusty Trails'])
})

it('shows instruments options', async () => {
    renderSearch()
    const element = screen.getByLabelText(/select instruments/i)
    expect(element).toBeInTheDocument()

    await userEvent.click(element)

    const instrumentInput = await screen.findByRole('listbox')

    const options = within(instrumentInput).getAllByRole('option').map(opt => opt.textContent)
    expect(options).containSubset(['clarinet', 'flute'])
})