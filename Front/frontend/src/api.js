// Tudo que fala com o backend fica neste arquivo.
const BASE = '/api.'
const CHAVE_TOKEN = 'taskquest-token'
const CHAVE_USUARIO = 'taskquest-usuario'

export function getToken() {
  try {
    return localStorage.getItem(CHAVE_TOKEN)
  } catch {
    return null
  }
}

export function lerUsuario() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_USUARIO))
  } catch {
    return null
  }
}

export function salvarSessao(token, usuario) {
  try {
    localStorage.setItem(CHAVE_TOKEN, token)
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario))
  } catch {
    /* sem armazenamento: o login vale só até recarregar a página */
  }
}

export function limparSessao() {
  try {
    localStorage.removeItem(CHAVE_TOKEN)
    localStorage.removeItem(CHAVE_USUARIO)
  } catch {
    /* nada a fazer */
  }
}

async function pedir(caminho, { metodo = 'GET', corpo, auth = true } = {}) {
  const headers = {}
  if (corpo) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let resposta
  try {
    resposta = await fetch(BASE + caminho, {
      method: metodo,
      headers,
      body: corpo ? JSON.stringify(corpo) : undefined
    })
  } catch {
    throw new Error('Não foi possível falar com o servidor. Confira se a API está rodando.')
  }

  if (resposta.status === 204) return null

  const dados = await resposta.json().catch(() => ({}))
  if (!resposta.ok) {
    const padrao =
      resposta.status >= 500
        ? 'Servidor indisponível. Confira se a API está rodando e o banco conectado.'
        : 'Algo deu errado. Tente de novo.'
    const erro = new Error(dados.erro || padrao)
    erro.status = resposta.status
    throw erro
  }
  return dados
}

export function cadastrar(nome, email, senha) {
  return pedir('/usuarios', { metodo: 'POST', corpo: { nome, email, senha }, auth: false })
}

export function entrar(email, senha) {
  return pedir('/login', { metodo: 'POST', corpo: { email, senha }, auth: false })
}

export function listarTarefas() {
  return pedir('/tarefas')
}

export function criarTarefa(dados) {
  return pedir('/tarefas', { metodo: 'POST', corpo: dados })
}

export function atualizarTarefa(id, dados) {
  return pedir(`/tarefas/${id}`, { metodo: 'PATCH', corpo: dados })
}

export function excluirTarefa(id) {
  return pedir(`/tarefas/${id}`, { metodo: 'DELETE' })
}
