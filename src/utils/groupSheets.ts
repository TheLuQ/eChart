import type { Sheet } from '../App'

type GroupingKey = (sh: Sheet) => string

export interface SheetGroup {
    title: string
    sheets: Sheet[]
    count: number
}

export function createGroups(sheets: Sheet[], getKey: GroupingKey): SheetGroup[] {
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
            sheets: entry[1],
            count: entry[1].length
        }))
}
