import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import { schemeCategory10 } from 'd3-scale-chromatic'




let theme = createMuiTheme({
    palette: {
        primary: {
            main: '#EF3F7E', //fuschia
            bright: '#FF5994'
        },
        secondary: {
            main: '#2476F3' // indigo
        },
        background: {
            default: '#2E2D32' // dark grey
        },
        nav: '#2E2D32',
        dataColors: schemeCategory10
    },
    typography: {
        fontFamily: '"Muli", "Roboto", sans-serif',
        button: {
            textTransform: 'none'
        }
    }
})

const responsiveTheme = responsiveFontSizes(theme)

export default responsiveTheme