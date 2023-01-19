import { Fragment, FunctionComponent, useState } from "react";
import { useAuthContext } from "src/state/AuthContext";

export const AuthTokenForm: FunctionComponent = () => {
  const { setAPIToken } = useAuthContext();

  const [token, setToken] = useState('');

  function validateAndSetAPIToken () {
    // TODO: Check to see if the token can actually be used to make an api call
    localStorage.setItem("token", token);
    setAPIToken(token);
  }

  return (
    <Fragment>
      <label htmlFor="apiToken" className="block font-bold">API Token</label>
      <input 
        id="apiToken" 
        className="p-1 block border border-gray-300 rounded-md mb-4" 
        placeholder="Token:" 
        value={token} 
        onChange={(ev) => setToken((ev.target as HTMLInputElement).value)}
      />
      <button className="p-4 bg-blue-500 hover:bg-blue-700 text-white rounded-md" onClick={validateAndSetAPIToken}>Submit</button>
    </Fragment>
  );
}
