import { useState } from 'react'
import Login from './pages/Login.jsx'
import Tarefas from './pages/Tarefas.jsx'
import { getToken, lerUsuario, limparSessao } from './api.js'

export default function App() {
  // Se já existe um token guardado, entra direto na tela de tarefas.
  const [usuario, setUsuario] = useState(() => (getToken() ? lerUsuario() : null))

  function sair() {
    limparSessao()
    setUsuario(null)
  }

  if (!usuario) return <Login onEntrar={setUsuario} />
  return <Tarefas usuario={usuario} onSair={sair} />
}
