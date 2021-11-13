import { DefaultTheme } from "styled-components";

export type ColorUsage = "primary" | "default"

export interface ButtonColorScheme {
    background: {
        default: string;
        hover: string;
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
                    hover: "#FFFFFF"
                },
                outline: "black"
            },
            primary: {
                background: {
                    default: "#bfd4ff",
                    hover: "#a9bbdf"
                },
                outline: "#415784"
            }
        },
        items: {
            unlockDateUpcoming: "#F67575",
            unlockDatePassed: "#A7DF70",
            editing: "#FFFFFF"
        }
    }
}