import React from 'react'
import NavBar from '../components/NavBar'
import { Paper, Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles((theme) => ({
    main: {
        padding: theme.spacing(4)
    }
}))


export default function ContentPage({children}) {
    const classes = useStyles()

    return (
        <>
        <NavBar/>
        <Container component="main" maxWidth='lg' className={classes.main}>
            <Paper>
                {children}
            </Paper>
        </Container>
        </>
    )
}

