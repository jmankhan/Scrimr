import { extendTheme } from '@chakra-ui/react'
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}
const customLightTheme = {
  "colors": {
    "background": "#f7f7f7",
    "body": {
      "bg" : "#f7f7f7"
    }
  },
}

const theme = extendTheme({ config, ...customLightTheme });
export default theme;