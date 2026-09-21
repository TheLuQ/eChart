import type { Sheet } from "../App"
import { render, screen } from '@testing-library/react';
import SheetList from "./SheetList";

const customRender = (sheets: Sheet[], defaultGroupingOption?: number) =>
    render(
        <SheetList sheets={sheets} defaultGroupingOption={defaultGroupingOption} />
    )

describe('sheet list', () => {
    it('displays default elements', () => {
        const input: Sheet[] = []

        customRender(input)
        const element = screen.getByText(/No results. Please redefine query/i)

        expect(element).toBeInTheDocument()
    })

    it('displays merged result by title', async () => {
        const pattern: Sheet = { file_id: 'id', title: 'tit', instrument_name_en: 'clarinet', file_name: 'heh', instrument_name_pol: 'klarnet', url: 'tofill' }
        const input = [pattern, { ...pattern, instrument_name_en: 'drums' }]

        customRender(input, 2)
        const resultOptions = screen.getByRole('list')
        expect(resultOptions.children).toHaveLength(1)
    })

    it('displays merged result by voice', async () => {
        const pattern: Sheet = { file_id: 'id', title: 'tit', instrument_name_en: 'clarinet', file_name: 'heh', instrument_name_pol: 'klarnet', url: 'tofill' }
        const input = [pattern, { ...pattern, voice: 1 }]

        customRender(input, 1)
        const resultOptions = screen.getByRole('list')
        expect(resultOptions.children).toHaveLength(2)
    })
})
