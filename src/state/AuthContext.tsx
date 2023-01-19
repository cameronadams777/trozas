import { createContext, FunctionComponent, ReactNode, useContext, useState } from 'react';

interface IAuthContext {
  apiToken: string;
  setAPIToken: (token: string) => void;
}

const AuthContext = createContext<IAuthContext>({
  apiToken: '',
  setAPIToken: (_token: string) => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({ children }) => {
  const [apiToken, setAPIToken] = useState('');

  return (
    <AuthContext.Provider value={{ apiToken, setAPIToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
