import React from 'react'

export const Spacer = ({width, height}) => (
    <div style={{width: `${(width||0)*8}px`, height: `${(height||0)*8}px`}}/>
)