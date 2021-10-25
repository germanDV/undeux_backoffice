import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { AuthProvider } from './lib/hooks/use-auth'
import MuiThemeProvider from './providers/MuiThemeProvider'
import ToastProvider from './providers/ToastProvider'
import ReactQueryProvider from './providers/ReactQueryProvider'

ReactDOM.render(
  <React.StrictMode>
    <MuiThemeProvider>
      <ToastProvider>
        <ReactQueryProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ReactQueryProvider>
      </ToastProvider>
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
