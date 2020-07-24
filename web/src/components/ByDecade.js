import React, { useState } from 'react'
import { Select, MenuItem, Fade, Button, Typography, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SongList from './SongList'
import * as $ from 'jquery'
import FeatureCheckboxLegend from './FeatureCheckboxLegend'
import SpiderChart from './SpiderChart'
import theme from '../styles/theme'




const useStyles = makeStyles((theme) => ({

    root: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
    },
    left: {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        '& > hr': {
            margin: theme.spacing(2,4)
        },
    },
    title: {
        alignSelf: 'center',
        textAlign: 'center'
    },
    spiderContainer: {
        flex: '1 1 500px',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch'
    },
    legendContainer: {
        flex: '1 1 auto'
    },
    right: {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    spacer: {
        flex: `0 0 ${theme.spacing(4)}px`,
    },
    select: {
        fontFamily: 'Roboto, sans-serif',
        fontSize: '18px'
    },
    menuItem: {
        fontFamily: 'Roboto, sans-serif',
        fontSize: '18px'
    },
    viewButton: {
        marginTop: theme.spacing(2)
    },
    viewContainer: {
        minHeight: '500px',
        padding: '10px'
    },
    text: {
        margin: theme.spacing(0,3),
        fontSize: theme.typography.pxToRem(16),
        maxWidth: '400px'
    },
    compareContainer: {
        display: 'flex',
        alignItems: 'baseline',
        '& p': {
            marginRight: theme.spacing(2)
        },
        alignSelf: 'center'
    }

}))



function ByDecade({ data, descriptions, decade, setDecade }) {
    const classes = useStyles()
    const features = Object.keys(data.features)

    const avgFeatures = Object.keys(data.features).reduce((avgs,feature) => {
        const decades = Object.keys(data.features[feature])
        const avg = decades.reduce((sum,d)=>(sum + data.features[feature][d]),0) / decades.length
        avgs[feature] = avg
        return avgs
    }, {})

    const [compareDecade, setCompareDecade] = useState('none') // in key form i.e. $1940
    const [viewSongs, setViewSongs] = useState(false)
    const [listHeight, setListHeight] = useState(0)

    const compareList = Object.keys(descriptions).reduce((list, decadeKey) => {
        if (decadeKey.substring(1) !== decade)
            list.push(decadeKey)
        return list
    }, ['none','avg'])

    const compareData = compareDecade!=='none' ? (
        compareDecade==='avg' ? { label: 'average', data: avgFeatures }
        : { label: compareDecade.substring(1), data: data.decades[compareDecade].features }
    ) : null


    const [checks, setChecks] = useState(features.reduce((obj, feature)=> (
        {...obj, [feature]: true}
    ),{}))
    const setCheck = e => {
        setChecks({ ...checks, [e.target.name]: e.target.checked})
    }

    const toggleView = () => {
        if (viewSongs){
            setViewSongs(false)
            return
        }
        else {
            setListHeight($('#view-container').height())
            setViewSongs(true)
            return
        }
    }
    //const hoverSongData = hoverSong ? {label: data.decades['$'+decade].songs[hoverSong].song, data: data.decades['$'+decade].songs[hoverSong].features} : null

    return (
        <div className={classes.root}>
            <div className={classes.left}>
                <Typography variant='h5' className={classes.title}>{`audio features of #1 singles from the ${decade}'s`}</Typography>
                <div className={classes.spiderContainer}>
                    <div style={{width: '100%'}}>
                        <SpiderChart
                            data={data.decades['$'+decade].features}
                            decade={decade}
                            colors={[theme.palette.primary.main,theme.palette.secondary.main]}
                            features={Object.keys(checks).reduce((list,feature)=>{
                                if (checks[feature])
                                    list.push(feature)
                                return list
                            },[])}
                            compareDecade={compareData}
                        />
                    </div>
                </div>
                <div className={classes.legendContainer}>
                    <FeatureCheckboxLegend features={features} checks={checks} setCheck={setCheck}/>
                </div>
                <Divider variant='middle'/>
                <div className={classes.compareContainer}>
                    <Typography component='p'>compare with:</Typography>
                    <Select value={compareDecade} onChange={e=>{setCompareDecade(e.target.value)}} color='secondary' className={classes.select}>
                        {compareList.map(item => (
                            <MenuItem key={item} value={item} className={classes.menuItem}>
                                {item!=='none' ? (item==='avg'?'average':item.substring(1)+`'s`) : 'none'}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
                
            </div>

            <div className={classes.spacer}/>

            <div className={classes.right}>
                <Select value={decade} onChange={e=>{setDecade(e.target.value);setCompareDecade('none')}} color='secondary' className={classes.select}>
                    {Object.keys(descriptions).map(decade => {
                        return (<MenuItem key={decade} value={decade.substring(1)} className={classes.menuItem}>{decade.substring(1)+'\'s'}</MenuItem>)
                    })}
                </Select>
                <div id='view-container' className={classes.viewContainer}>
                    { viewSongs ? <Fade in={viewSongs} timeout={500}>
                        <div>
                        <SongList data={data.decades['$'+decade].songs} height={listHeight}/> 
                        </div>
                    </Fade> : null}
                    { !viewSongs ? <Fade in={!viewSongs} timeout={500}>
                        <div className={classes.text}>{descriptions['$'+decade]}</div>
                    </Fade> : null }
                    
                </div>
                <Button variant={viewSongs ? 'outlined' : 'contained'} onClick={()=>toggleView()} color='primary' className={classes.viewButton}>
                    {viewSongs ? 'close' : 'view top songs from '+decade+'\'s'}
                </Button>
            </div>
        </div>
    )
}

export default ByDecade
