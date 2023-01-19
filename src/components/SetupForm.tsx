import { invoke } from "@tauri-apps/api";
import { FunctionComponent, useState } from "react";

export const SetupForm: FunctionComponent = () => {
  const [instanceUrl, setInstanceUrl] = useState('');
  const [apiToken, setAPIToken] = useState('');

  async function validateAndSetAPIToken () {
    try {
      await invoke('save_connection_details', {
        instanceUrl,
        apiToken
      });
    } catch(error) {
      // TODO: Display some sort of toast message here if an error occurs
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <label htmlFor="instanceUrl" className="font-bold">URL</label>
        <input 
          id="apiToken" 
          className="p-1 border border-gray-300 rounded-md mb-4" 
          value={instanceUrl} 
          onChange={(ev) => setInstanceUrl((ev.target as HTMLInputElement).value)}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="apiToken" className="font-bold">API Token</label>
        <input 
          id="apiToken" 
          className="p-1 border border-gray-300 rounded-md mb-4" 
          placeholder="Token:" 
          value={apiToken} 
          onChange={(ev) => setAPIToken((ev.target as HTMLInputElement).value)}
        />
      </div>
      <button className="p-4 bg-blue-500 hover:bg-blue-700 text-white rounded-md" onClick={validateAndSetAPIToken}>Submit</button>
    </div>
  );
}
