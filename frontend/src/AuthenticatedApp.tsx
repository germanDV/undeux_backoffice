import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Layout from 'layouts/Layout'
import FullPageLoader from 'components/Loader/FullPageLoader'

const Dashboard = lazy(() => import('screens/Dashboard/Dashboard'))
const Users = lazy(() => import('screens/Users/Users'))
const Other = lazy(() => import('screens/Other/Other'))

const AuthenticatedApp = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<FullPageLoader />}>
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/loading" exact component={FullPageLoader} />
            <Route path="/users" component={Users} />
            <Route path="/other" component={Other} />
            <Route component={() => <h2>404</h2>} />
          </Switch>
        </Suspense>
      </Layout>
    </BrowserRouter>
  )
}

export default AuthenticatedApp
