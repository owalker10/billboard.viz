import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'



let theme = createMuiTheme({
    palette: {
        primary: {
            main: '#EF3F7E' //fuschia
        },
        secondary: {
            main: '2476F3' // indigo
        }
    },
    typography: {
        fontFamily: '"Muli", "Roboto", sans-serif'
    }
})

const responsiveTheme = responsiveFontSizes(theme)