import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Box } from '@material-ui/core';
import fullLogo from '../assets/full_logo.svg'
import logo from '../assets/logo.svg'
import NavBarTab from './NavBarTab'
import { Link } from 'react-router-dom' 

const useStyles = makeStyles((theme) => ({
    
    root: {
        flexGrow: 1,
        
    },
    appBar: {
        backgroundColor: theme.palette.nav
    },
    container: {
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    box: {
        alignSelf: 'stretch',
        display: 'flex'
    }
    /*
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },*/
  }));
  
function NavBar(props) {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <AppBar position='static' elevation={0} className={classes.appBar}>
                <Toolbar className={classes.container}>
                    <Link style={{fontSize:0}} to='/'>
                        <img src={fullLogo} height='40px' alt='logo'/>
                    </Link>
                    <Box className={classes.box} component='div'>
                        <NavBarTab label='visualize' to='/viz'/>
                        <NavBarTab label='about' to='/about'/>
                    </Box>

                    
                    

                </Toolbar>
            </AppBar>
        </div>
    )
}

export default NavBar