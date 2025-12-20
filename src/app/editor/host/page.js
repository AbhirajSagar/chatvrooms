'use client';
import Peer from "peerjs";
import { useEffect,useState,useRef } from "react";
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCopy, faFile, faPersonCircleQuestion, faSearch, faShareAlt } from "@fortawesome/free-solid-svg-icons";
import AnimatedModal from "@/components/AnimatedModal";

export default function EditorPage()
{
    const searchParams = useSearchParams();
    
    const [workspaceName, setWorkspaceName] = useState('Untitled Project'); //Current Workspace Name
    const [peerId, setPeerId] = useState(''); //Your Peer Id
    const peerRef = useRef(null); //This is your own peer 
    const [connections, setConnections] = useState([]); //All clients
    const [messages, setMessages] = useState([]); // chat messages
    const [input, setInput] = useState('');
    
    useEffect(() => 
    {
        if(peerRef.current === null)
        setUpHostPeer();
        
        return clearPeer;
    }, []);

    function clearPeer()
    {
        if(peerRef.current !== null)
        {
            peerRef.current.destroy();
            peerRef.current = null;
        }
    }

    function setUpHostPeer()
    {
        const workspaceNameParam = searchParams.get('name');
        const idToUse = workspaceNameParam || workspaceName;
        if (workspaceNameParam) setWorkspaceName(workspaceNameParam);

        // Use the URL-provided name as the Peer id when available so host id matches the workspace name
        const peer = new Peer(idToUse);
        peerRef.current = peer;

        peer.on('open', (id) => 
        {
            setPeerId(id);
            console.log('Peer connected with ID:', id);
        });

        peer.on('connection', (conn) =>
        {
            console.log('New connection from:', conn.peer);

            const messageToSend = getMessage();

            // Send current code to the newly connected peer and to all existing connections.
            try { conn.send(messageToSend); } catch (e) { /* ignore send errors */ }

            setConnections((prev) => {
                prev.forEach((c) => {
                    try { c.send(messageToSend); } catch (e) { /* ignore send errors */ }
                });
                return [...prev, conn];
            });

            conn.on('data', (data) =>
            {
                console.log('Received data from peer:', data);
                handleReceivedData(data);
            });
        });
    }

    function getMessage()
    {
        return { type: 'chat' };
    }

    function handleReceivedData(data)
    {
        if(data.type === 'chat')
        {
            const content = data.content || {};
            setMessages(prev => [...prev, { sender: content.sender || 'peer',from: 'client',  text: content.text || String(content) }]);
        }

        //can add other types of message and their respective action
        //for example
        // if(data.type === 'cursor')
        // {
        //     //handle cursor position update
        // }
    }

    function handleCodeSync(value)
    {
        // Host sending chat messages
        const text = value;
        const message = { type: 'chat', content: { sender: peerId || 'host', from: 'host',  text } };
        setMessages(prev => [...prev, { sender: message.content.sender, from: 'host', text }]);
        connections.forEach((con) => {
            try { con.send(message); } catch (e) { }
        });

        console.log(messages);
    }

    return (
        <div className="w-full h-[100vh] overflow-hidden">
            <EditorNavbar workspaceName={workspaceName} peerId={peerId}/>
            <div className="w-full h-full flex">
                <div className="w-full bg-background-muted-dark h-full flex flex-col">
                    <div className="flex-1 overflow-auto p-4 space-y-3" id="messages">
                        {messages.length === 0 && <div className="text-muted text-center">No messages yet — say hello 👋</div>}
                        {messages.map((m, i) => (
                            <div key={i} className={`w-full flex ${m.from === 'host' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-md px-3 py-2 rounded-md ${m.from === 'client' ? 'bg-background-dark text-muted' : 'from-amber-500 to-amber-600 bg-gradient-to-r text-black'} `}>
                                    <div className="text-sm opacity-80">{m.sender}</div>
                                    <div className="font-medium">{m.text}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 bg-background-muted-dark flex gap-2 mb-12">
                        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter'){ handleCodeSync(input); setInput(''); } }} className="flex-1 bg-background-dark rounded px-3 py-2 text-muted outline-none" placeholder="Type a message..." />
                        <button onClick={() => { handleCodeSync(input); setInput(''); }} className="bg-amber-600 hover:bg-orange-600 text-white px-4 py-2 rounded">Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Sidebar()
{
    return (
        <div className="w-14 h-full flex flex-col items-center">
            <div className="cursor-pointer hover:bg-background-muted-dark w-full flex justify-center items-center h-14">
                <FontAwesomeIcon icon={faFile} className="text-3xl text-muted"/>
            </div>
            <div className="cursor-pointer hover:bg-background-muted-dark w-full flex justify-center items-center h-14">
                <FontAwesomeIcon icon={faSearch} className="text-3xl text-muted"/>
            </div>
        </div>
    );
}

function EditorNavbar({workspaceName, peerId})
{
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copied, setIsCopied] = useState(false);

    function copyWorkspaceId()
    {
        navigator.clipboard.writeText(`${peerId}@${encodeURIComponent(workspaceName)}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }

    return (
        <div className="w-full h-9 flex justify-center items-center relative">
            <h2 className="text-muted font-extrabold">{workspaceName}</h2>
            <FontAwesomeIcon icon={faShareAlt} onClick={() => setIsModalOpen(true)} className="text-muted absolute top-0 right-0 hover:bg-amber-600 hover:text-white transition-all duration-150 rounded-bl-2xl cursor-pointer p-2 bg-background-muted-dark aspect-square"/>
            <AnimatedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className='p-4 flex flex-col'>
                <h2 className="w-full text-muted font-semibold">Share your workspace</h2>
                <div className="w-full justify-between px-3 items-center flex h-10 mt-3 rounded bg-background-dark">
                    <h2 className="text-muted font-light text-sm">{peerId}@{encodeURIComponent(workspaceName)}</h2>
                    <FontAwesomeIcon icon={copied ? faCheckCircle : faCopy} onClick={() => copyWorkspaceId()} className={`${copied ? 'text-green-600' : 'text-muted'} p-2 hover:bg-background-muted-dark ${copied ? 'hover:text-green-400' : 'hover:text-white'} rounded cursor-pointer`}/>
                </div>
                <div className="h-24 w-full rounded my-2 bg-background-dark flex-1 justify-center items-center flex">
                    <div className="flex justify-center items-center w-full h-full flex-col gap-2">
                        <FontAwesomeIcon icon={faPersonCircleQuestion} className="w-full text-7xl text-muted"/>
                        <h2 className="text-center font-extrabold text-muted">No Connections</h2>
                    </div>
                </div>
                <div>
                    <button className="w-1/4 float-right bg-amber-600 hover:bg-orange-600 py-2 rounded cursor-pointer  text-white" onClick={() => setIsModalOpen(false)}>Close</button>
                </div>
            </AnimatedModal>
        </div>
    );
}