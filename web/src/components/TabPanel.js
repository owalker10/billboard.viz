import React from 'react'
import { Fade } from '@material-ui/core'

function TabPanel({ children, currentValue, thisValue, fade}) {
    if (fade){
        return (
            <Fade in={currentValue === thisValue} timeout={300}>
                <div style={currentValue === thisValue ? {} : {display: 'none'}}>
                    {children}
                </div>
            </Fade>
        )
    }
    else {
        return (
            <div style={currentValue === thisValue ? {} : {display: 'none'}}>
                {children}
            </div>
        )
    }
}

export default TabPanel
