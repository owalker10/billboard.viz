import React, { useContext } from 'react'
import { ResponsiveRadar } from '@nivo/radar'
import { makeStyles } from '@material-ui/core/styles'
import { GlobalContext } from '../context/GlobalContext'


const useStyles = makeStyles((theme) => ({
    label: {
        fontWeight: 600,
        fontSize: '16px'
    }
}))


const ResponsiveSpider = ({ data, features, decade, colors, compareDecade }) => {
    // format of data coming in: object where keys are features, values are decimals
    // compare var is either null or has a label and similar data
    const { hoverSong } = useContext(GlobalContext)
    const compare = hoverSong || compareDecade
    const formattedData = features.map(feature => {
        let dataPoint =
        {
            feature: feature,
            [decade]: Math.round(data[feature] * 100) / 100
        }
        if (compare)
            dataPoint[compare.label] = Math.round(compare.data[feature] * 100) / 100
        return dataPoint
})

    return (
    <ResponsiveRadar
        data={formattedData}
        formatY
        maxValue={1}
        keys={compare ? [decade, compare.label] : [decade]}
        indexBy='feature'
        margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
        colors={({ index })=>(colors[index])}
        gridLabel={LabelComponent}
        enableDotLabel={true && !compare}
        fillOpacity={0.25}
    />
    )

}

export default ResponsiveSpider

const LabelComponent = ({ id, anchor }) => {
    const classes = useStyles()

    return (
    <g transform={`translate(${anchor === 'end' ? -60 : anchor === 'middle' ? -30 : 0}, 0)`}>
        <text className={classes.label}>{id}</text>
    </g>
    )
}