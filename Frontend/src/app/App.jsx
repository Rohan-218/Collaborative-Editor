import './App.css'
import {Editor} from '@monaco-editor/react'
import { MonacoBinding } from 'y-monaco'
import { useRef, useMemo, useState, useEffect } from 'react'
import * as Y from 'yjs'
import { SocketIOProvider } from 'y-socket.io'

function App() {

  const editorRef = useRef(null)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [users, setUsers] = useState([])
  const [username, setUsername] = useState(() => {
    return new URLSearchParams(window.location.search).get('username')
  })
  

  const ydoc = useMemo(() => new Y.Doc(), [])

  const yText = useMemo(() => ydoc.getText('monaco'), [ydoc])


  const handleMount = (editor) => {
    editorRef.current = editor
    setIsEditorReady(true)

    const monacoBinding = new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set([editorRef.current])
    )
  }

  const handleJoin = (e) => {
    e.preventDefault()
    setUsername(e.target.username.value)
    window.history.pushState({}, '', `?username=${e.target.username.value}`)
  }

  useEffect(() => {
    console.log(username, editorRef.current)
    if (username && editorRef.current) {
      const provider = new SocketIOProvider('http://localhost:3000', 'monaco', ydoc, {
        autoConnect: true,
      })

      provider.awareness.setLocalStateField('user', { username })

      const states = Array.from(provider.awareness.getStates().values())
      setUsers(
        states
          .filter(state => state.user && state.user.username)
          .map(state => state.user)
      )

      provider.awareness.on('change', () => {
        const states = Array.from(provider.awareness.getStates().values())
        setUsers(
        states
          .filter(state => state.user && state.user.username)
          .map(state => state.user)
        )
      })

      function handleBeforeUnload() {
        provider.awareness.setLocalStateField('user', null)
      }

      window.addEventListener('beforeunload', handleBeforeUnload)

      

      return () => {
        provider.disconnect()
        window.removeEventListener('beforeunload', handleBeforeUnload)
      }
    }
  },[
    isEditorReady,
    username
  ])

  if (!username) {
    return (
      <main className="h-screen w-full bg-gray-950 flex gap-4 p-4 items-center justify-center">
        <form
          onSubmit={handleJoin}
          className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Enter your name"
            className="p-2 rounded-md bg-gray-800 text-white"
            name="username"
          />
          <button 
          className="p-2 rounded-md bg-amber-50 text-gray-950 font-bold"
          >
            JOIN
          </button>
        </form>
      </main>
    )
  }
  return (
  <main
    className="h-screen w-full bg-gray-950 flex gap-4 p-4"
  >
    <aside
      className="w-1/5 h-full bg-amber-50 rounded-md"
    >
      <h2 className="text-2xl font-bold p-4 border-b border-gray-300" align="center">
        Users
      </h2>
      <ul className="p-4">
        {users.map((user, index) => (
          <li key={index} className=" p-2 text-white bg-gray-950 rounded-md mb-2">
            {user.username}
          </li>
        ))}
      </ul>
    </aside>
    <section
      className="w-4/5 h-full bg-neutral-800 rounded-md overflow-hidden"
    >
      <Editor
        height="100%"
        language="javascript"
        theme="vs-dark"
        onMount={handleMount}
      />
    </section>

  </main>
  )
}

export default App
