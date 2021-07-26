import React from 'react'
import './ContentContainer.css'

function ContentContainerSecondary(props) {
    return (
        <>
        <span className={`content-secondary ${props.addClass}`}>
            {props.children}
        </span>
        </>
    )
}

export default ContentContainerSecondary
