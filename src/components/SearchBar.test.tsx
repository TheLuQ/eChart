import { render, screen } from "@testing-library/react"
import SearchBar, { type ISearch } from "./SearchBar"
import userEvent from "@testing-library/user-event"

describe('Search bar', () => {
    const basicProps: ISearch = {
        error: false,
        setError: vi.fn(),
        label: 'interesting',
        options: ['one', 'two'],
        setFilteredResult: vi.fn()
    }
    it('renders search element', () => {
        render(<SearchBar {...basicProps} />)

        expect(screen.getByLabelText('interesting'))
    })

    it('builds proper condition for sheets', async () => {
        const mockSetfilter = vi.fn()
        const props: ISearch = { ...basicProps, setFilteredResult: mockSetfilter }
        render(<SearchBar {...props} />)

        await userEvent.click(screen.getByLabelText(/interesting/i))
        await userEvent.click(screen.getByText(/one/i))
        await userEvent.click(screen.getByText(/two/i))
        const filtered = mockSetfilter.mock.lastCall?.[0]
        expect(filtered).toEqual(['one', 'two'])
    })
})