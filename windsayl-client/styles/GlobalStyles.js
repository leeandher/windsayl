import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    padding: 0;
    margin: 0;
  }
  a {
    text-decoration: none;
    color: #0783cb;
  }
  button:hover {
    cursor: pointer;
  }
`

export default GlobalStyles