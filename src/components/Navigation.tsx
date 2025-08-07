import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { ButtonGroup, IconButton } from "@mui/material";
import type { JSX } from "react";

export interface NavigationProps {
    prevAction: () => void;
    nextAction?: () => void;
    customNextButtonLabel?: JSX.Element;
    prevDisabled: boolean;
}

export default function Navigation(props: NavigationProps) {
    const { prevAction, nextAction, customNextButtonLabel, prevDisabled } = props;
    const nextButtonContent = customNextButtonLabel ?? (
        <>
            Next <NavigateNext />
        </>
    );

    return (
        <ButtonGroup className="navigation">
            <IconButton
                size="small"
                color="primary"
                onClick={prevAction}
                disabled={prevDisabled}
            >
                <NavigateBefore /> Back
            </IconButton>

            <IconButton
                size="small"
                color="primary"
                onClick={nextAction}
            >
                {nextButtonContent}
            </IconButton>
        </ButtonGroup>
    );
}