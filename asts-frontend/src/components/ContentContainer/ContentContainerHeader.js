import React from 'react'
import './ContentContainer.css'

function ContentContainerHeader(props) {
    return (
        <>
        <span className={`pt-3 content-header ${props.addClass}`} style={{
            position: "absolute",
            display: "flex",
            width: "100%",
            "z-index": "100",
          }}>
            {props.children}
        </span>
        <div style={{height: "50px"}} />
        </>
    )
}

export default ContentContainerHeader
