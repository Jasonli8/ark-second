import React from 'react'
import './ContentContainer.css'

function ContentContainerHeader(props) {
    return (
        <>
        <span className={`${props.sub ? 'sub-header-secondary' : 'content-header'} ${props.addClass}`} style={{
            position: "absolute",
            display: "flex",
            height: props.height,
            width: "100%",
            "z-index": "100",
          }}>
            {props.children}
        </span>
        <div style={{height: props.height}} />
        </>
    )
}

export default ContentContainerHeader
