import React, { useContext, useState } from 'react'
import { ResponsiveLine } from '@nivo/line'
import { Paper } from '@material-ui/core'
import { makeStyles, styled } from '@material-ui/core/styles'
import { GlobalContext } from '../context/GlobalContext'


export const TooltipSurface = styled(Paper)({
    padding: '5px',
    textAlign: 'center',
})

const Tooltip = ({ point }) => (
    <TooltipSurface>
        <div>{`${point.data.x} ${point.serieId}`}</div>
        <div><b>{point.data.y}</b></div>
    </TooltipSurface>
)

// data coming in is a dict where keys are features, values are dict where keys are decades ($1940), values are decimals

const ResponsiveOverTime = ({ data, features, colors }) => {
    const formattedData = features.map(feature => {
        const id = feature
        const color = colors[feature]
        const featureDict = data[feature]
        const featureData = Object.keys(featureDict).map(decade => (
            {
                x: decade.substring(1)+`'s`,
                y: featureDict[decade].toFixed(2)
            }
        ))
        return {
            id,
            color,
            data: featureData
        }
    })
    //const [hovered, setHovered] = useState('none')

    

    return (
        <ResponsiveLine
            data={formattedData}
            curve='monotoneX'
            margin={{ top: 20, right: 50, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 0, max: 1}}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'decade',
                legendOffset: 36,
                legendPosition: 'middle'
            }}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'feature value',
                legendOffset: -40,
                legendPosition: 'middle'
            }}
            colors={d => d.color}
            pointSize={10}
            pointBorderWidth={2}
            useMesh={true}
            tooltip={Tooltip}
            //onMouseMove={(_data)=>{if (hovered !== _data.serieId){setHovered(_data.serieId)}}}
            //onMouseLeave={()=>{setHovered('none')}}
            /*
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}*/
        />
    )
}

export default ResponsiveOverTime
