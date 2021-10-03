import React, { useState } from 'react'
import axios, { AxiosResponse } from 'axios'

const Health = (): JSX.Element => {
  const [status, setStatus] = useState('unknown')

  const handleHealthCheck = async () => {
    try {
      const resp: AxiosResponse<{status: string}> = await axios.get('api/health')
      setStatus(resp.data.status)
    } catch (e) {
      setStatus((e as Error)?.message || JSON.stringify(e))
    }
  }

  return (
    <div style={{ margin: '40px 0', border: '1px solid black' }}>
      <p>Health Status: {status}</p>
      <button onClick={handleHealthCheck}>Check Status</button>
    </div>
  )
}

export default Health
