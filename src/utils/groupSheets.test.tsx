import { createGroups } from './groupSheets'
import type { Sheet } from '../App'

describe('createGroups', () => {
    const sheets: Sheet[] = [
        { file_id: '1', file_name: 'A', title: 'Song1', instrument_name_en: 'Piano', instrument_name_pol: 'Fortepian', url: 'tofill' },
        { file_id: '2', file_name: 'B', title: 'Song2', instrument_name_en: 'Violin', instrument_name_pol: 'Skrzypce', url: 'tofill' },
        { file_id: '3', file_name: 'C', title: 'Song1', instrument_name_en: 'Piano', instrument_name_pol: 'Fortepian', url: 'tofill' },
        { file_id: '4', file_name: 'D', title: 'Song3', instrument_name_en: 'Violin', instrument_name_pol: 'Skrzypce', url: 'tofill' },
        { file_id: '5', file_name: 'E', title: 'Song4', instrument_name_en: 'Clarinet', instrument_name_pol: 'Klarnet', voice: 1, url: 'tofill' },
        { file_id: '6', file_name: 'F', title: 'Song4', instrument_name_en: 'Clarinet', instrument_name_pol: 'Klarnet', voice: 2, url: 'tofill' }
    ]

    it('groups by instrument', () => {
        const groups = createGroups(sheets, s => s.instrument_name_en)
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
        expect(createGroups([], s => s.instrument_name_en)).toEqual([])
    })

    it('groups all into one if key is constant', () => {
        const groups = createGroups(sheets, () => 'all')
        expect(groups.map(g => ({ title: g.title, count: g.count })))
            .toEqual([{ title: 'all', count: sheets.length }])
    })

    it('groups by instrument and part', () => {
        const groups = createGroups(sheets, s => s.instrument_name_en + (s.voice ? ` ${s.voice}` : ''))
        expect(groups.map(g => ({ title: g.title, count: g.count })))
            .toEqual([
                { title: 'Piano', count: 2 },
                { title: 'Violin', count: 2 },
                { title: 'Clarinet 1', count: 1 },
                { title: 'Clarinet 2', count: 1 }
            ])
    })
})
