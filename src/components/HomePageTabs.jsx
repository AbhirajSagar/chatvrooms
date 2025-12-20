// Tabs on Home Page
// Add more properties to extend functionality

import { useRouter } from "next/navigation";
import { useState } from "react";

const TABS = 
[
  {
    name: "Create Container",
    content: <CreateWorkSpace/>
  },
  {
    name: "Join Container",
    content: <JoinWorkSpace/>
  }
]

export default TABS;


function CreateWorkSpace()
{
    const router = useRouter();
    const [workspaceName, setWorkspaceName] = useState(null);

    return (
      <div className="p-4">
        <h2 className="text-xl text-muted font-bold mb-4">Create a New Container</h2>
        <form onSubmit={(e) => 
        {
          e.preventDefault();
          launchWorkSpace(router,workspaceName);
        }}>
          <input type="text" placeholder="Name" className="border p-2 rounded text-muted focus:outline-1 focus:outline-orange-300 w-full mb-3" onChange={(e) => setWorkspaceName(e.target.value)} required/>
          <input type="submit" value="Create Container" className="dark:bg-background-dark bg-muted text-white mb-4 cursor-pointer dark:text-muted px-4 py-2 rounded float-right duration-300 transition-colors hover:bg-orange-500 hover:text-white"/>
        </form>
      </div>
    )
}

function JoinWorkSpace()
{
    const router = useRouter();
    const [workspaceId, setWorkspaceId] = useState(null);
    const [name, setName] = useState(null);

    return (
      <div className="p-4">
        <h2 className="text-xl text-muted font-bold mb-4">Join a Container</h2>
        <form onSubmit={(e) => 
          {
            e.preventDefault();
            joinWorkSpace(router, workspaceId, name);
          }}>
          <input type="text" placeholder="Container Name" onChange={(e) => setWorkspaceId(e.target.value)} className="border p-2 rounded text-muted focus:outline-1 focus:outline-orange-300 w-full mb-3" required/>
          <input type="text" placeholder="Your Name" onChange={(e) => setName(e.target.value)} className="border p-2 rounded text-muted focus:outline-1 focus:outline-orange-300 w-full mb-3" required/>
          <input type="submit" value="Join Container" className="dark:bg-background-dark bg-muted text-white mb-4 cursor-pointer dark:text-muted px-4 py-2 rounded float-right duration-300 transition-colors hover:bg-orange-500 hover:text-white"/>
        </form>
      </div>
    )
}

function launchWorkSpace(router, workspaceName) 
{
  router.push(`/editor/host?name=${encodeURIComponent(workspaceName)}`);
}

function joinWorkSpace(router, workspaceId, name)
{
  router.push(`/editor/client?id=${encodeURIComponent(workspaceId)}&name=${encodeURIComponent(name)}`);
}
