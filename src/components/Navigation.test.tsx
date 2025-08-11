import Navigation from "./Navigation";
import { type JSX } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const createNavigation = (nextAction?: () => void, prevAction?: () => void, prevDisabled?: boolean, nextLabel?: JSX.Element) =>
    render(
        <Navigation
            nextAction={nextAction ?? (() => { })}
            prevAction={prevAction ?? (() => { })}
            prevDisabled={prevDisabled ?? false}
            customNextButtonLabel={nextLabel}
        />
    )

it('displays navigation', async () => {
    const fn = vi.fn()
    createNavigation(fn)

    const element = screen.getByText(/next/i)
    expect(element).toBeInTheDocument()

    await userEvent.click(element)
    expect(fn).toBeCalledTimes(1)
})

it('disables previous step action', () => {
    createNavigation(undefined, undefined, true)

    const element = screen.getByText(/back/i)
    expect(element).toBeDisabled()
})

it('clicks prev button', async () => {
    const fn = vi.fn()
    createNavigation(undefined, fn)

    const element = screen.getByText(/back/i)
    expect(element).toBeInTheDocument()
    await userEvent.click(element)
    expect(fn).toBeCalled()
})

it('clicks next button', async () => {
    const fn = vi.fn()
    createNavigation(undefined, fn)

    const element = screen.getByText(/back/i)
    expect(element).toBeInTheDocument()
    await userEvent.click(element)
    expect(fn).toBeCalled()
})

it('shows custom label', () => {
    const customLabel = <>Hello</>

    createNavigation(undefined, undefined, false, customLabel)

    const element = screen.getByText(/hello/i)
    expect(element).toBeInTheDocument()
})