import { createGroups } from './groupSheets'
import type { Sheet } from '../App'

describe('createGroups', () => {
    const sheets: Sheet[] = [
        { id: '1', name: 'A', title: 'Song1', instrument: 'Piano', name_pol: 'Fortepian' },
        { id: '2', name: 'B', title: 'Song2', instrument: 'Violin', name_pol: 'Skrzypce' },
        { id: '3', name: 'C', title: 'Song1', instrument: 'Piano', name_pol: 'Fortepian' },
        { id: '4', name: 'D', title: 'Song3', instrument: 'Violin', name_pol: 'Skrzypce' },
        { id: '5', name: 'E', title: 'Song4', instrument: 'Clarinet', name_pol: 'Klarnet', part: 1 },
        { id: '6', name: 'F', title: 'Song4', instrument: 'Clarinet', name_pol: 'Klarnet', part: 2 }
    ]

    it('groups by instrument', () => {
        const groups = createGroups(sheets, s => s.instrument)
        expect(groups.map(g => ({ title: g.title, count: g.count })))
            .toEqual([
                { title: 'Piano', count: 2 },
                { title: 'Violin', count: 2 },
                { title: 'Clarinet', count: 2 }
            ])
    })

    it('groups by title', () => {
        const groups = createGroups(sheets, s => s.title)
        expect(groups.map(g => ({ title: g.title, count: g.count })))
            .toEqual([
                { title: 'Song1', count: 2 },
                { title: 'Song2', count: 1 },
                { title: 'Song3', count: 1 },
                { title: 'Song4', count: 2 }
            ])
    })

    it('returns empty array for empty input', () => {
        expect(createGroups([], s => s.instrument)).toEqual([])
    })

    it('groups all into one if key is constant', () => {
        const groups = createGroups(sheets, () => 'all')
        expect(groups.map(g => ({ title: g.title, count: g.count })))
            .toEqual([{ title: 'all', count: sheets.length }])
    })

    it('groups by instrument and part', () => {
        const groups = createGroups(sheets, s => s.instrument + (s.part ? ` ${s.part}` : ''))
        expect(groups.map(g => ({ title: g.title, count: g.count })))
            .toEqual([
                { title: 'Piano', count: 2 },
                { title: 'Violin', count: 2 },
                { title: 'Clarinet 1', count: 1 },
                { title: 'Clarinet 2', count: 1 }
            ])
    })
})
