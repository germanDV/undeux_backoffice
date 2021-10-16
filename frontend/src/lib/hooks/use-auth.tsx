import {
  useState,
  useContext,
  createContext,
  FC,
  useMemo,
  useCallback,
  useEffect,
} from 'react'
import { User } from 'lib/models'
import * as auth from 'lib/auth'
import { me } from 'api'

export type AuthCtxType = {
  user: User | null
  login: (email: string, password: string) => Promise<User>
  logout: () => void
}

const AuthCtx = createContext<AuthCtxType | null>(null)
AuthCtx.displayName = 'AuthContext'

export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    async function loadUser(token: string) {
      const [u, err] = await me(token)
      if (!err) {
        setUser(u.user)
      }
    }

    const token = auth.getToken()
    if (token) {
      console.log('Found a token, fetching user data...')
      loadUser(token)
    } else {
      console.log('No token in localStorage')
    }
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
    setUser(null)
  }, [])

  const value = useMemo(() => {
    return { user, login, logout }
  }, [user, login, logout])

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

