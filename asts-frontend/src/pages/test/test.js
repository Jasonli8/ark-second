import React, {useState} from 'react'
import ErrorNotif from '../../components/Error/ErrorNotif'

function Test() {
    const [error, setError] = useState('test error message');
    const clearError = () => {
        setError();
    }
    return (
        <ErrorNotif error={error} errorDetails="test error details" />
    )
}

export default Test
