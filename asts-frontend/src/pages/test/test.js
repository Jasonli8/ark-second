import React, {useState} from 'react'
import ErrorModal from '../../components/Error/ErrorModal'

function Test() {
    const [error, setError] = useState('test error message');
    const clearError = () => {
        setError();
    }
    return (
        <ErrorModal error={error} clearError={clearError} />
    )
}

export default Test
