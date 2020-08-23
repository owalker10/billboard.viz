import React, { useState } from 'react'
import theme from '../styles/theme'
import { FormControlLabel, withStyles, Checkbox, Dialog, Typography, IconButton, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import InfoIcon from'@material-ui/icons/Info'

import featureDescriptions from '../data/featureDescriptions'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        flex: '1',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-around'
    },
    col: {
        display: 'flex',
        flexDirection: 'column',
        flex: '0 1 auto',
    },
    checkbox: {

    },
    label: {
        fontSize: theme.typography.pxToRem(18),
    },
    infoIcon: {
        fontSize: '.7em',
        verticalAlign: 'text-top',
        color: theme.palette.secondary.light,
    },
    modalContent: {
        padding: '20px',
        '& h1': {
            textTransform: 'capitalize'
        },
        '& h2': {
            color: theme.palette.grey[700],
        },
        '& img': {
            width: '100%'
        },
        '& hr': {
            margin: theme.spacing(2,0,3)
        }
    }
}))

const getColoredCheckbox = color => (withStyles({
    root: {
        color: color,
        '&$checked': {
            color: color,
        },
    },
    checked: {},
})((props) =>
    <Checkbox 
        color="default"
        icon={<CheckBoxOutlineBlankIcon style={{fontSize: '0.7em'}} />}
        checkedIcon={<CheckBoxIcon style={{fontSize: '0.7em'}} />}
        {...props}
    />
))

function FeatureCheckboxLegend({ features, ncols, checks, setCheck }) {
    const classes = useStyles()
    const n = ncols || 2
    const featureQueue = [...features]
    
    

    return (
        <div className={classes.root}>
            {
                getColLengths(features.length, n).map((l,idx) => (
                    <div className={classes.col} key={idx}>
                    {
                        [...Array(l)].map((n,i) => {
                            const feature = featureQueue.shift()
                            const index = features.indexOf(feature)
                            return (
                            <LegendItem
                                i={index}
                                key={index}
                                feature={feature}
                                checked={checks[feature]}
                                setCheck={setCheck}
                            />
                            )
                        })
                    }
                    </div>
    ))
            }
        </div>
    )
}

export default FeatureCheckboxLegend

const LegendItem = ({ i, feature, checked, setCheck }) => {
    const classes = useStyles()
    const ColoredCheckbox = getColoredCheckbox(colors(i))
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <div>
            <FormControlLabel
                control={
                    <ColoredCheckbox
                        checked={checked}
                        onChange={setCheck}
                        name={feature}
                    />
                }
                style={{ marginRight: '5px' }}
                label={<span className={classes.label}>
                    {feature}
                    
                </span>}
            />
            <IconButton size='small' edge='start'  onClick={()=>{setModalOpen(true)}}>
                <InfoIcon className={classes.infoIcon}/>
            </IconButton>
            <InfoModal
                open={modalOpen}
                onClose={()=>{setModalOpen(false)}}
                feature={feature}
                contentClass={classes.modalContent}
            />
            
        </div>
    )

}

const InfoModal = ( { open, onClose, feature, contentClass } ) => {
    
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <div className={contentClass}>
                <Typography variant='h4' component='h1'>{feature}</Typography>
                <Typography variant='h6' component='h2'>Audio Feature</Typography>
                <Divider/>
                <Typography variant='body1' paragraph>
                    Notes From Spotify:
                </Typography>
                <Typography variant='body1' paragraph>
                   {featureDescriptions[feature]}
                </Typography>
                <img src={require(`../assets/featureDistributions/${feature}.png`)} alt='distribution'/>
            </div>
        </Dialog>
    )
}


const colors = n => {
    return theme.palette.dataColors[n]
}


const getColLengths = (nItems, nCols) => {
    const lengths = [...Array(nCols)].map((n,i) => {
        let l = Math.floor(nItems/nCols)
        if (i < nItems % nCols)
            l++
        return l
    })
    return lengths
}