import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import FullPageLoader from 'components/Loader/FullPageLoader'

const Login = lazy(() => import('screens/Login/Login'))
const AuthenticatedApp = lazy(() => import('./AuthenticatedApp'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<FullPageLoader />}>
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route path="/" component={AuthenticatedApp} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
