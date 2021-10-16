import React, { lazy, Suspense } from 'react'
import FullPageLoader from 'components/Loader/FullPageLoader'
import { useAuth, AuthCtxType } from 'lib/hooks/use-auth'

const Login = lazy(() => import('screens/Login/Login'))
const AuthenticatedApp = lazy(() => import('./AuthenticatedApp'))

function App() {
  const { user } = useAuth() as AuthCtxType

  return (
    <Suspense fallback={<FullPageLoader />}>
      {user?.id ? <AuthenticatedApp /> : <Login />}
    </Suspense>
  )
}

export default App
