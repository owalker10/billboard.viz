import React, { useContext } from 'react'
import { List, ListItem, Typography, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Scrollbars } from 'react-custom-scrollbars'
import {GlobalContext} from '../context/GlobalContext'


const useStyles = makeStyles((theme) => ({
    root: {
        height: props => props.height,
        width: '400px',
        border: `1px solid ${theme.palette.grey[400]}`,
        borderRadius: '5px',
        boxShadow: `inset 0 5px 10px ${theme.palette.grey[800]}17`
    },
    list: {
        width: 'auto',
        maxHeight: '100%',
        overflow: 'auto'
    },
    itemContent: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        '& .MuiTypography-h6': {
            lineHeight: 1.2
        },
        padding: '0 10px'
    },
    songText: {
        flexGrow: '1',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        '& .MuiTypography-h6': {
            fontSize: theme.typography.pxToRem(18)
        },
        '&:hover': {
            '& *': {
                whiteSpace: 'break-spaces'
            }
        }
    },
    songVal: {
        marginLeft: '10px',
        flex: '0 0 auto',
        textAlign: 'center',
    }
}))

function SongList(props) {
    const classes = useStyles(props)
    const songs = props.data

    return (
        <div className={classes.root}>
            <List className={classes.list} component={Scrollbars} autoHide autoHideTimeout={700} autoHideDuration={200} renderTrackHorizontal={noHorizontalScroll}>
                {songs.map((song,i) => (<div key={i}>
                    <SongItem song={song} i={i} classes={classes} />
                    {<Divider variant='middle' light/>
                    }
                </div>))}
            </List>
        </div>
    )
}

export default SongList

function SongItem({ song, classes, i }) {
    const songData = {label: 'compare', data: song.features}
    const {setHoverSong} = useContext(GlobalContext)

    return (
        <ListItem button component='a' href={song.url} target='_blank'
             onMouseEnter={()=>{setHoverSong(songData)}} onMouseLeave={()=>{setHoverSong(null)}}
        >
            <div className={classes.itemContent}>
                <div className={classes.songText}>
                    <Typography noWrap variant='h6'>{song.song}</Typography>
                    <Typography noWrap variant='caption'>{song.artist}</Typography>
                </div>
                <div className={classes.songVal}>
                    <ListVal label='reached #1' value={song.top_year} color='primary'/>
                </div>
                <div className={classes.songVal}>
                    <ListVal label='weeks at #1' value={song.weeks} color='secondary'/>
                </div>
            </div>
        </ListItem>
    )
}

function ListVal({ label, value, color }){
    return (
        <>
        <Typography variant='caption' color={color}>{label}</Typography>
        <Typography variant='h6' color={color}>{value}</Typography>
        </>
    )
}

const noHorizontalScroll = props => <div {...props} style={{display: 'none'}} className="track-horizontal"/>