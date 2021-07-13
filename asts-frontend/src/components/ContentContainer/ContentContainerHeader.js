import React from 'react'
import './ContentContainer.css'

function ContentContainerHeader(props) {
    return (
        <span className={`pt-3 content-header ${props.addClass}`}>
            {props.children}
        </span>
    )
}

export default ContentContainerHeader
