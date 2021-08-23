import { createGlobalStyle } from "styled-components";

export const lightTheme = {
    body: "#FFF",
    text: "#363537",
    toggleBorder: "#FFF",
    background: "#363537"
}

export const darkTheme = {
    body: "#363537",
    text: "#FAFAFA",
    toggleBorder: "#6B8096",
    background: "#999"
}

export const themeUI = {
    fonts: {
        body: '"Quicksand-Regular", system-ui, sans-serif',
        heading: '"Quicksand-Regular", "Avenir Next", sans-serif',
        monospace: '"Quicksand-Regular", Menlo, monospace',
    },
    colors: {
        text: '#000',
        background: '#fff',
        primary: '#33e',
    },
}

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Quicksand-Regular';
    src: url("/fonts/Quicksand-Regular.ttf");
  }
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: 'Quicksand-Regular', Tahoma, Helvetica, Arial, Roboto, sans-serif;
    transition: all 0.50s linear;
  }
`