import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

const Login = lazy(() => import('./screens/Login'))
const Layout = lazy(() => import('./layouts/Layout'))
const Dashboard = lazy(() => import('./screens/Dashboard'))
const Users = lazy(() => import('./screens/Users'))
const Other = lazy(() => import('./screens/Other'))

function App() {
  // TODO: handle log in status properly
  const [loggedIn, setLoggedIn] = React.useState(false)
  if (!loggedIn) {
    return (
      <Suspense fallback={<p>loading login form...</p>}>
        <Login onLogin={() => setLoggedIn(true)} />
      </Suspense>
    )
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<p>loading...</p>}>
        <Layout>
          <button onClick={() => setLoggedIn(false)}>Log Out</button>
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/users" component={Users} />
            <Route path="/other" component={Other} />
          </Switch>
        </Layout>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
