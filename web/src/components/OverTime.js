import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import theme from '../styles/theme'

import FeatureCheckboxLegend from './FeatureCheckboxLegend'
import LineChart from './LineChart'
import { Typography } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    chartContainer: {
        width: '100%',
        height: '600px'
    },
    legendContainer: {
        flex: '1 1 auto',
        width: '100%',
    },
}))


function OverTime({ data }) {
    const classes = useStyles()
    const features = Object.keys(data.features)
    const [checks, setChecks] = useState(features.reduce((obj, feature)=> (
        {...obj, [feature]: true}
    ),{}))
    const setCheck = e => {
        setChecks({ ...checks, [e.target.name]: e.target.checked})
    }
    const colors = features.reduce((obj, feature, i) => {
        obj[feature] = theme.palette.dataColors[i]
        return obj
    }, {})

    return (
        <div className={classes.root}>
            <Typography variant='h4'>audio features of #1 singles by decade</Typography>
            <div className={classes.chartContainer}>
                <LineChart
                    data={data.features}
                    features={Object.keys(checks).reduce((list,feature)=>{
                        if (checks[feature])
                            list.push(feature)
                        return list
                    },[])}
                    colors={colors}
                />
            </div>
            <div className={classes.legendContainer}>
                <FeatureCheckboxLegend features={features} checks={checks} setCheck={setCheck} ncols={4}/>
            </div>
            
        </div>
    )
}

export default OverTime
