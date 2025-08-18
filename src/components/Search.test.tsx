import Search from "./Search";
import { type Dispatch, type SetStateAction } from "react";
import type { Sheet } from "../App";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import { setupRoutes } from "../setupTests";
import * as  db from '../../docker/back/db.json'

beforeAll(() => {
    vi.stubEnv('VITE_BACKEND', 'http://localhost:3003')
    setupRoutes(db)
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

it('filters sheets with proper song and instrument', async () => {
    const resultFn = vi.fn()
    renderSearch(resultFn)

    await userEvent.click(screen.getAllByRole('combobox')[0])
        .then(() => screen.findByText(/dusty trails/i))
        .then(element => userEvent.click(element))

    fireEvent.keyDown(document.activeElement!, { key: 'Escape', code: 'Escape' })

    await userEvent.click(screen.getAllByRole('combobox')[1])
    await userEvent.click(screen.getByText(/tuba/i))
    await userEvent.click(screen.getByText(/next/i))
    const result = resultFn.mock.lastCall?.[0] as Sheet[]
    expect(result[0].instrument).toEqual('tuba')
    expect(result[0].title).toEqual('Dusty Trails')
})