import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Layout from 'layouts/Layout'
import FullPageLoader from 'components/Loader/FullPageLoader'

const Dashboard = lazy(() => import('screens/Dashboard/Dashboard'))
const Users = lazy(() => import('screens/Users/Users'))
const Shareholders = lazy(() => import('screens/Shareholders/Shareholders'))
const Vendors = lazy(() => import('screens/Vendors/Vendors'))
const Customers = lazy(() => import('screens/Customers/Customers'))

const AuthenticatedApp = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<FullPageLoader />}>
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/users" component={Users} />
            <Route path="/customers" component={Customers} />
            <Route path="/vendors" component={Vendors} />
            <Route path="/shareholders" component={Shareholders} />
            <Route component={() => <h2>404</h2>} />
          </Switch>
        </Suspense>
      </Layout>
    </BrowserRouter>
  )
}

export default AuthenticatedApp
