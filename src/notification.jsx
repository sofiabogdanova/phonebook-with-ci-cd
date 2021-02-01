import React from 'react'

import './styles.css'

const Notification = ({ message, isError }) => {
    if (message === null) {
        return null
    }

    let className = isError ? 'error' : 'success'
    return (
        <div className={className}>
            {message}
        </div>
    )
}

export default Notification
