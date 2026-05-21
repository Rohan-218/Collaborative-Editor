import './App.css'
import {Editor} from '@monaco-editor/react'

function App() {

  return (
  <main
    className="h-screen w-full bg-gray-950 flex gap-4 p-4"
  >
    <aside
      className="w-1/5 h-full bg-amber-50 rounded-md"
    ></aside>
    <section
      className="w-4/5 h-full bg-neutral-800 rounded-md overflow-hidden"
    >
      <Editor
        height="100%"
        language="javascript"
        theme="vs-dark"
      />
    </section>

  </main>
  )
}

export default App
