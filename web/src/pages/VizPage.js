import React, { useState } from 'react'
import ContentPage from '../layouts/ContentPage'
import { Tabs, Tab, Select, MenuItem, Button, Fade, Collapse } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import descriptions from '../data/decadeDescriptions'
import TabPanel from '../components/TabPanel'
import OverTime from '../components/OverTime'
import ByDecade from '../components/ByDecade'


const data = require('../data/data.json')
//console.log(data)
//console.log(descriptions)

const useStyles = makeStyles((theme) => ({

    tab: {
        fontSize: theme.typography.pxToRem(18)
    },
    content: {
        padding: theme.spacing(4),
        display: 'flex'
    },
    
}))

const VizPage = () => {
    const classes = useStyles()
    const [tab, setTab] = useState(0)
    const [decade, setDecade] = useState('1940')
    

    return (
        <ContentPage>
            <Tabs className={classes.tabs} variant='fullWidth' value={tab} onChange={(e,v) => setTab(v)}>
                <Tab label="over time" className={classes.tab}/>
                <Tab label="by decade" className={classes.tab}/>
            </Tabs>
            <TabPanel currentValue={tab} thisValue={0} fade>
                <div className={classes.content}>
                    <OverTime data={data}/>
                </div>
            </TabPanel>
            <TabPanel currentValue={tab} thisValue={1} fade>
                <div className={classes.content}>
                    <ByDecade data={data} descriptions={descriptions} decade={decade} setDecade={setDecade}/>
                </div>
            </TabPanel>
        </ContentPage>
    )
}

export default VizPage
