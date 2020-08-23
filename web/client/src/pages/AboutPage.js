import React, { useState } from 'react'
import { makeStyles, Typography, Divider, Button, IconButton, Snackbar,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Radio, RadioGroup, FormControlLabel, TextField } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close'
import ContentPage from '../layouts/ContentPage'
import PrimaryButton from '../components/PrimaryButton'
import { Spacer } from '../components/utils'
import useSessionState from '../context/useSessionState'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        padding: '60px',
        minHeight: '80vh',
        '& p': {
            fontSize: '18px'
        }
    },
    title: {
        marginBottom: theme.spacing(6),
        fontWeight: 800,
        transform: 'scale(1.2, 1)',
        transformOrigin: 'left'
    },
    bottom: {
        marginTop: 'auto'
    },
    contactContainer: {
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',    
    },
    dialog: {
        width: '500px',
        maxWidth: '85vw'
    },
    closeButton: {
        marginLeft: 'auto',
        color: theme.palette.grey[500],
        marginTop: '-7px',
        marginRight: '-15px'
    }
}))

export const AboutPage = () => {
    const classes = useStyles()
    const [open, setOpen] = useSessionState('openSendMessage',false)
    const [sent, setSent] = useState(false)
    const handleSend = (name,email,messageType,message) => {
        console.log('send')
        console.log(JSON.stringify({
            name,
            email,
            messageType,
            message
        }))
        fetch('/sendMessage',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                messageType,
                message
            })
        }).then(res=>{
            setOpen(false)
            setSent(true)
        })
    }
    const onSnackbarClose = (e, reason) => {
        if (reason !== 'clickaway')
            setSent(false)
    }
    return (
        <ContentPage>
            <div className={classes.root}>
                <Typography variant='h3' component='h1' className={classes.title}>About billboard.viz</Typography>
                <Typography paragraph>billboard.viz is a passion project created in an effort to use data to explore the musical trends across decades.</Typography>
                <Typography paragraph>The audio feature data used in the visualizations are from Spotify’s <a target="_blank" href='https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/'>Developer API</a>.
                    The web application is built on React using <a target='_blank' href='https://material-ui.com/'>Material-UI</a> and <a target='_blank' href='https://nivo.rocks/'>nivo.rocks</a>.</Typography>
                <Spacer height={3}/>
                <div className={classes.bottom}>
                    <Divider variant='middle'/>
                    <Spacer height={2}/>
                    <div className={classes.contactContainer}>
                        <Typography>Want to leave a comment, suggest a feature, or report a bug?</Typography>
                        <Spacer height={2}/>
                        <PrimaryButton variant='contained' onClick={()=>{setOpen(true)}}>click here!</PrimaryButton>
                    </div>
                </div>
            </div>
            <MessageDialog open={open} handleClose={()=>{setOpen(false)}} handleSend={handleSend}/>
            <Snackbar open={sent} autoHideDuration={3000} onClose={onSnackbarClose}>
                <Alert elevation={6} variant="filled" onClose={onSnackbarClose} severity="success">
                    Sent a message to the creator of billboard.viz, thanks!
                </Alert>
            </Snackbar>
        </ContentPage>
    )
}

const MessageDialog = ({open, handleClose, handleSend}) => {
    const classes = useStyles()
    const [name,setName] = useSessionState('messageName','')
    const [email, setEmail] = useSessionState('email','')
    const [messageType, setMessageType] = useSessionState('messageState','comment')
    const [otherText, setOtherText] = useSessionState('otherText', '')
    const [message, setMessage] = useSessionState('message','')
    const clear = () => {
        setName('')
        setEmail('')
        setMessageType('comment')
        setOtherText('')
        setMessage('')
    }
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            classes={{paper: classes.dialog}}
        >
            <DialogTitle>
                <div style={{display:'flex'}}>
                    <Typography variant='h5'>Leave a message</Typography>
                    <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <TextField color='secondary' value={name} onChange={e=>{setName(e.target.value)}} label='name (optional)' style={{width: '250px'}}/>
                <Spacer height={1}/>
                <TextField color='secondary' value={email} onChange={e=>{setEmail(e.target.value)}} label='email (optional)' style={{width: '250px'}}/>
                <Spacer height={3}/>
                <Divider/>
                <Spacer height={1}/>
                <RadioGroup aria-label="type" name="type" value={messageType} onChange={e=>{setMessageType(e.target.value)}}>
                    <FormControlLabel value="comment" control={<Radio />} label="comment" />
                    <FormControlLabel value="suggestion" control={<Radio />} label="suggestion" />
                    <FormControlLabel value="bug" control={<Radio />} label="bug" />
                    <span>
                        <FormControlLabel value="other" control={<Radio />} label="other:" />
                        <TextField color='secondary' disabled={messageType!=='other'} value={otherText} onChange={e=>{setOtherText(e.target.value)}}/>
                    </span>
                </RadioGroup>
                <Spacer height={2}/>
                <Divider/>
                <Spacer height={3}/>
                <TextField
                    color='secondary'
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Leave your message here"
                    value={message}
                    onChange={e=>{setMessage(e.target.value)}}
                    style={{width:'100%'}}
                />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>
                Cancel
            </Button>
            <PrimaryButton onClick={()=>{handleSend(name,email,messageType==='other'?otherText:messageType,message);clear()}} disabled={!message}>
                Send
            </PrimaryButton>
            </DialogActions>
        </Dialog>
    )
}
