import jwt from 'jsonwebtoken'

export function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization // formato: "Bearer TOKEN"

  if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não enviado.' })
  }

  const token = cabecalho.slice(7)

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET)
    req.usuarioId = dados.id
    next()
  } catch {
    res.status(401).json({ erro: 'Token inválido ou expirado.' })
  }
}