import * as repo from '../repository/tarefas.repository.js'

export async function listarTarefas(req, res) {
  try {
    res.json(await repo.listar())
  } catch (erro) {
    console.error(erro)
    res.status(500).json({ erro: 'Erro interno no servidor.' })
  }
}

export async function criarTarefa(req, res) {
  try {
    const { titulo, descricao, prazo, prioridade, categoria, usuarioId } = req.body

    if (!titulo || !usuarioId) {
      return res.status(400).json({ erro: 'Título e usuarioId são obrigatórios.' })
    }

    const nova = await repo.criar({
      titulo,
      descricao,
      prazo: prazo ? new Date(prazo) : null,
      prioridade,
      categoria,
      usuarioId
    })
    res.status(201).json(nova)
  } catch (erro) {
    console.error(erro)
    res.status(500).json({ erro: 'Erro interno no servidor.' })
  }
}

export async function atualizarTarefa(req, res) {
  try {
    const { titulo, descricao, prazo, prioridade, categoria, concluida } = req.body
    const dados = { titulo, descricao, prioridade, categoria, concluida }
    if (prazo !== undefined) dados.prazo = prazo ? new Date(prazo) : null

    const atualizada = await repo.atualizar(req.params.id, dados)
    if (!atualizada) return res.status(404).json({ erro: 'Tarefa não encontrada.' })
    res.json(atualizada)
  } catch (erro) {
    console.error(erro)
    res.status(500).json({ erro: 'Erro interno no servidor.' })
  }
}

export async function excluirTarefa(req, res) {
  try {
    const removida = await repo.excluir(req.params.id)
    if (!removida) return res.status(404).json({ erro: 'Tarefa não encontrada.' })
    res.status(204).send()
  } catch (erro) {
    console.error(erro)
    res.status(500).json({ erro: 'Erro interno no servidor.' })
  }
}