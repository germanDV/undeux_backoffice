import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Roles, User } from 'lib/models'
import * as auth from 'lib/auth'
import { me } from 'api'

const anonymousUser: User = {
  id: 0,
  email: '',
  name: '',
  role: Roles.nn,
}

export type AuthCtxType = {
  user: User
  login: (email: string, password: string) => Promise<User>
  logout: () => void
  loading: boolean
}

const emptyCtx: AuthCtxType = {
  user: anonymousUser,
  login: (_email: string, _password: string) => Promise.resolve(anonymousUser),
  logout: () => {},
  loading: true,
}

const AuthCtx = createContext<AuthCtxType>(emptyCtx)
AuthCtx.displayName = 'AuthContext'

export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<User>(anonymousUser)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const [u, err] = await me()
      if (!err) {
        setUser(u.user)
      }
      setLoading(false)
    }
    loadUser()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const u = await auth.login(email, password)
      setUser(u)
      return u
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [])

  const logout = useCallback(() => {
    auth.logout()
    setUser(anonymousUser)
  }, [])

  const value = useMemo(() => {
    return { user, login, logout, loading }
  }, [user, login, logout, loading])

  return (
    <AuthCtx.Provider value={value}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (ctx === undefined) {
    throw new Error('useAuth must be used within a AuthProvider.')
  }
  return ctx
}
