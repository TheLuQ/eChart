import type { Sheet } from "../App"
import { render, screen } from '@testing-library/react';
import SheetList from "./SheetList";

const customRender = (sheets: Sheet[], defaultGroupingOption?: number) =>
    render(
        <SheetList sheets={sheets} prevAction={() => { }} prevDisabled={false} defaultGroupingOption={defaultGroupingOption} />
    )

describe('sheet list', () => {
    it('displays default elements', () => {
        const input: Sheet[] = []

        customRender(input)
        const element = screen.getByText(/No results. Please redefine query/i)

        const submitButton = screen.getByRole('button', { name: /get all/i });
        expect(submitButton).toBeInTheDocument()
        expect(element).toBeInTheDocument()
    })

    it('displays merged result by title', async () => {
        const pattern: Sheet = { id: 'id', title: 'tit', mimeType: 'pdf', instrument: 'clarinet', kind: 'pdf', name: 'heh' }
        const input = [pattern, { ...pattern, instrument: 'drums' }]

        customRender(input, 1)
        const resultOptions = screen.getByRole('list')
        expect(resultOptions.children).toHaveLength(1)
    })
})