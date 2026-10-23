import Search from "./Search";
import type { Sheet } from "../App";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const sheets = [{
    title: "Dusty Trails",
    instrument_name_en: "tuba",
    group_key: "dusty-trails"
}];
const titles = [{ group_key: "dusty-trails", title: "Dusty Trails" }];

beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn((input: RequestInfo | URL) => Promise.resolve({
        json: async () => String(input).includes("/titles") ? { titles } : sheets
    } as Response)));
});

afterAll(() => {
    vi.unstubAllGlobals();
});

it("filters sheets for the selected song", async () => {
    const setFilteredSheets = vi.fn();
    render(
        <MemoryRouter initialEntries={["/bands/gos"]}>
            <Routes>
                <Route path="/bands/:bandId" element={
                    <Search
                        setFilteredSheets={setFilteredSheets}
                        prevAction={() => { }}
                        prevDisabled={true}
                    />
                } />
            </Routes>
        </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("combobox", { name: /select songs/i }));
    await userEvent.click(await screen.findByRole("option", { name: /dusty trails/i }));
    await userEvent.click(screen.getByRole("button", { name: "Apply" }));
    await userEvent.click(screen.getByText(/next/i));

    const result = setFilteredSheets.mock.lastCall?.[0] as Sheet[];
    expect(result[0].instrument_name_en).toEqual("tuba");
    expect(result[0].title).toEqual("Dusty Trails");
});
