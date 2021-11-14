import { DefaultTheme } from "styled-components";

export type ColorUsage = "primary" | "default"

export interface ButtonColorScheme {
    background: {
        default: string;
        hover: string;
        disabled: string;
    }
    outline: string;
}

export const LightTheme: DefaultTheme = {
    colors: {
        background: "#D7E9FF",
        foreground: "#FFFFFF",
        link: "#0066CC",
        button: {
            default: {
                background: {
                    default: "#FFFFFF00",
                    hover: "#FFFFFF",
                    disabled: "#D2D2D2"
                },
                outline: "black"
            },
            primary: {
                background: {
                    default: "#bfd4ff",
                    hover: "#a9bbdf",
                    disabled: "#D2D2D2"
                },
                outline: "#415784"
            }
        },
        items: {
            unlockDateUpcoming: "#F67575",
            unlockDatePassed: "#A7DF70",
            editing: "#FFFFFF"
        },
        formErrorNotification: "#FF3030",
        formErrorBackground: "#FFA0A0A0",
        unlockedBackgroundColor: "#56f956",
        lockedBackgroundColor: "#ff6d6d"
    }
}