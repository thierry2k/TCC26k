import { useState } from 'react'
import { cadastrar, entrar, salvarSessao } from '../api.js'

export default function Login({ onEntrar }) {
  const [modo, setModo] = useState('entrar') // 'entrar' ou 'cadastrar'
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const cadastrando = modo === 'cadastrar'

  async function enviar(evento) {
    evento.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      if (cadastrando) await cadastrar(nome, email, senha)
      const { token, usuario } = await entrar(email, senha)
      salvarSessao(token, usuario)
      onEntrar(usuario)
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  function trocarModo() {
    setModo(cadastrando ? 'entrar' : 'cadastrar')
    setErro('')
  }

  return (
    <main className="login">
      <h1 className="marca">
        Task<span>Quest</span>
      </h1>
      <p className="subtitulo">Conclua tarefas, ganhe XP e leve o aventureiro até o castelo.</p>

      <form className="painel formulario" onSubmit={enviar}>
        <h2>{cadastrando ? 'Criar conta' : 'Entrar'}</h2>

        {cadastrando && (
          <label>
            Nome
            <input value={nome} onChange={(e) => setNome(e.target.value)} required maxLength={100} />
          </label>
        )}

        <label>
          E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>
          Senha
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </label>

        {cadastrando && (
          <p className="dica">Use 8 ou mais caracteres, com uma maiúscula, um número e um símbolo.</p>
        )}

        {erro && (
          <p className="erro" role="alert">
            {erro}
          </p>
        )}

        <button className="botao" type="submit" disabled={carregando}>
          {carregando ? 'Aguarde...' : cadastrando ? 'Criar conta e entrar' : 'Entrar'}
        </button>

        <button className="link" type="button" onClick={trocarModo}>
          {cadastrando ? 'Já tenho conta' : 'Ainda não tenho conta'}
        </button>
      </form>
    </main>
  )
}
