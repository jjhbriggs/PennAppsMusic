//John Briggs, 2021
import React, {useContext} from 'react';

const CredentialContext = React.createContext({});

export const CredentialProvider = ({children}) => {
  const [cred, setCred] = React.useState({});
  return (
    <CredentialContext.Provider value={{cred, setCred}}>
      {children}
    </CredentialContext.Provider>
  )
}
export const useCred = () => useContext(CredentialContext)

export default CredentialContext
