import React from 'react'

import { Tab } from '@material-ui/core'
import { withRouter, Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({

    root: {
        '&:hover .shadow-background': {
            opacity: .5
        }
    },
    container: {
        maxHeight: '100%',
        height: '100%',
        fontSize: theme.typography.pxToRem(20),
        //textTransform: 'none',
        fontWeight: 400,
        opacity: 1,
    },
    active: {
        color: theme.palette.primary.bright,
        fontWeight: 700,
    },
    background: {
        backgroundImage: `linear-gradient(to bottom, #18181A, ${theme.palette.background.default}00)`,
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
        transition: '.3s',
    }
}))
    



const NavBarTab = (props) => {
    const active = props.location.pathname === props.to
    const classes = useStyles()

    return (
        <div className={classes.root} style={{position: 'relative'}}>
            <div className={`${classes.background} shadow-background`}/>
            <Tab
                component={Link}
                className={`${classes.container} ${active ? classes.active : ''}`}
                {...props}
            />
            
            

        </div>
    )
}

export default withRouter(NavBarTab)
