import React from 'react'

const Notification = ({ info }) => {
    if (!info) {
        return null
    }

    const style = {
        color: info.type === 'error' ? 'red' : 'green',
        fontSize: 20,
        padding: 10,
        marginBottom: 10
    }

    return (
        <div style={style}>
            {info.message}
        </div>
    )
}

export default Notification