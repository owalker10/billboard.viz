import React from 'react'
import { Button } from '@material-ui/core'
import { styled } from '@material-ui/core/styles'

const StyledButton = styled(Button)(({theme}) => (
    {
        textTransform: 'none',
    }   
))

export default function PrimaryButton(props) {
    return (
        <StyledButton color='primary' variant='contained' {...props}>{props.children}</StyledButton>
    )
}
