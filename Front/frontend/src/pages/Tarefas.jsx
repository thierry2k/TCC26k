import { useEffect, useRef, useState } from 'react'
import Trilha from '../components/Trilha.jsx'
import { atualizarTarefa, criarTarefa, excluirTarefa, listarTarefas } from '../api.js'

const XP_POR_PRIORIDADE = { baixa: 10, media: 20, alta: 30 }
const NOME_PRIORIDADE = { baixa: 'Baixa', media: 'Média', alta: 'Alta' }

function formatarPrazo(prazo) {
  if (!prazo) return ''
  return new Date(prazo).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

function estaAtrasada(tarefa) {
  if (!tarefa.prazo || tarefa.concluida) return false
  return new Date(tarefa.prazo).getTime() < Date.now() - 24 * 60 * 60 * 1000
}

export default function Tarefas({ usuario, onSair }) {
  const [tarefas, setTarefas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [filtro, setFiltro] = useState('pendentes')
  const [titulo, setTitulo] = useState('')
  const [prioridade, setPrioridade] = useState('media')
  const [prazo, setPrazo] = useState('')
  const [aviso, setAviso] = useState('')

  // XP provisório: soma o valor das tarefas concluídas.
  // Quando o backend guardar o XP, é só trocar esta conta pelo valor que vier da API.
  const xp = tarefas
    .filter((t) => t.concluida)
    .reduce((soma, t) => soma + (XP_POR_PRIORIDADE[t.prioridade] ?? 0), 0)
  const nivel = Math.floor(xp / 100) + 1
  const dentroDoNivel = xp % 100

  // Avisa quando o nível sobe (ignora a primeira carga da lista).
  const nivelAnterior = useRef(null)
  useEffect(() => {
    if (carregando) return
    if (nivelAnterior.current !== null && nivel > nivelAnterior.current) {
      setAviso(`Nível ${nivel}!`)
      const sumir = setTimeout(() => setAviso(''), 2600)
      nivelAnterior.current = nivel
      return () => clearTimeout(sumir)
    }
    nivelAnterior.current = nivel
  }, [nivel, carregando])

  function tratarErro(e) {
    if (e.status === 401) {
      onSair() // token inválido ou vencido: volta para o login
      return
    }
    setErro(e.message)
  }

  useEffect(() => {
    let ativo = true
    listarTarefas()
      .then((lista) => ativo && setTarefas(lista))
      .catch((e) => ativo && tratarErro(e))
      .finally(() => ativo && setCarregando(false))
    return () => {
      ativo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function adicionar(evento) {
    evento.preventDefault()
    const texto = titulo.trim()
    if (!texto) return
    setErro('')
    try {
      const dados = { titulo: texto, prioridade }
      if (prazo) dados.prazo = prazo
      const nova = await criarTarefa(dados)
      setTarefas((atuais) => [nova, ...atuais])
      setTitulo('')
      setPrazo('')
      setFiltro('pendentes')
    } catch (e) {
      tratarErro(e)
    }
  }

  async function alternar(tarefa) {
    setErro('')
    try {
      const atualizada = await atualizarTarefa(tarefa.id, { concluida: !tarefa.concluida })
      setTarefas((atuais) => atuais.map((t) => (t.id === tarefa.id ? atualizada : t)))
    } catch (e) {
      tratarErro(e)
    }
  }

  async function remover(tarefa) {
    setErro('')
    try {
      await excluirTarefa(tarefa.id)
      setTarefas((atuais) => atuais.filter((t) => t.id !== tarefa.id))
    } catch (e) {
      tratarErro(e)
    }
  }

  const visiveis = tarefas.filter((t) => {
    if (filtro === 'pendentes') return !t.concluida
    if (filtro === 'concluidas') return t.concluida
    return true
  })

  const mensagemVazia =
    filtro === 'pendentes'
      ? 'Nenhuma tarefa pendente. Adicione uma para continuar a caminhada.'
      : filtro === 'concluidas'
        ? 'Você ainda não concluiu nenhuma tarefa.'
        : 'Nenhuma tarefa ainda. Adicione a primeira acima.'

  return (
    <main className="pagina">
      <header className="topo">
        <h1 className="marca">
          Task<span>Quest</span>
        </h1>
        <div className="usuario">
          <span>{usuario.nome}</span>
          <button className="link" onClick={onSair}>
            Sair
          </button>
        </div>
      </header>

      <div className="cena-externa">
        <Trilha xp={xp} />
        {aviso && <div className="aviso-nivel">{aviso}</div>}
      </div>

      <section className="estatisticas" aria-label="Seu progresso">
        <div className="estatistica nivel">
          <p className="rotulo">Nível</p>
          <p className="valor">{nivel}</p>
          <div className="barra" role="progressbar" aria-label="Progresso para o próximo nível" aria-valuemin={0} aria-valuemax={100} aria-valuenow={dentroDoNivel}>
            <i style={{ width: `${dentroDoNivel}%` }} />
          </div>
          <p className="nota">{dentroDoNivel} de 100 XP para o nível {nivel + 1}</p>
        </div>
        <div className="estatistica">
          <p className="rotulo">XP total</p>
          <p className="valor">{xp}</p>
        </div>
        <div className="estatistica">
          <p className="rotulo">Concluídas</p>
          <p className="valor">{tarefas.filter((t) => t.concluida).length}</p>
        </div>
      </section>

      <section className="painel" aria-labelledby="titulo-tarefas">
        <h2 id="titulo-tarefas">Suas tarefas</h2>

        <form className="adicionar" onSubmit={adicionar}>
          <input
            type="text"
            placeholder="Nova tarefa"
            aria-label="Título da tarefa"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            maxLength={150}
          />
          <input type="date" aria-label="Prazo" value={prazo} onChange={(e) => setPrazo(e.target.value)} />
          <select aria-label="Prioridade" value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
            <option value="baixa">Baixa · 10 XP</option>
            <option value="media">Média · 20 XP</option>
            <option value="alta">Alta · 30 XP</option>
          </select>
          <button className="botao" type="submit">
            Adicionar
          </button>
        </form>

        {erro && (
          <p className="erro" role="alert">
            {erro}
          </p>
        )}

        <div className="abas">
          {['pendentes', 'concluidas', 'todas'].map((f) => (
            <button key={f} className="aba" aria-pressed={filtro === f} onClick={() => setFiltro(f)}>
              {f === 'pendentes' ? 'Pendentes' : f === 'concluidas' ? 'Concluídas' : 'Todas'}
            </button>
          ))}
        </div>

        {carregando ? (
          <p className="vazio">Carregando tarefas...</p>
        ) : visiveis.length === 0 ? (
          <p className="vazio">{mensagemVazia}</p>
        ) : (
          <ul className="lista">
            {visiveis.map((t) => (
              <li key={t.id} className="item">
                <button
                  className="caixa"
                  role="checkbox"
                  aria-checked={t.concluida}
                  aria-label={`Concluir: ${t.titulo}`}
                  onClick={() => alternar(t)}
                >
                  {t.concluida ? '✓' : ''}
                </button>
                <div className="corpo">
                  <p className={`titulo ${t.concluida ? 'feita' : ''}`}>{t.titulo}</p>
                  <div className="meta">
                    <span className={`xp ${t.prioridade}`}>{XP_POR_PRIORIDADE[t.prioridade] ?? 0} XP</span>
                    <span>prioridade {NOME_PRIORIDADE[t.prioridade]?.toLowerCase()}</span>
                    {t.prazo && <span>prazo {formatarPrazo(t.prazo)}</span>}
                    {estaAtrasada(t) && <span className="atrasada">atrasada</span>}
                  </div>
                </div>
                <button className="remover" aria-label={`Remover: ${t.titulo}`} onClick={() => remover(t)}>
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
