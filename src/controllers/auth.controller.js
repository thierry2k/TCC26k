import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as repo from '../repository/usuarios.repository.js'

export async function login(req, res) {
  try {
    const { email, senha } = req.body

    if (!email || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' })
    }

    const usuario = await repo.buscarPorEmail(email)

  
    const senhaCorreta = usuario && (await bcrypt.compare(senha, usuario.senha))
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' })
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
    })
  } catch (erro) {
    console.error(erro)
    res.status(500).json({ erro: 'Erro interno no servidor.' })
  }
}