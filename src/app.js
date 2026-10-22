import 'dotenv/config'
import express from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import usuariosRouter from './routes/usuarios.routes.js'
import tarefasRouter from './routes/atividades.routes.js'

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Gerenciador de Tarefas',
      version: '1.0.0',
      description: 'API do TCC: gerenciador de tarefas.'
    }
  },
  apis: ['./src/routes/*.routes.js']
}

const loggerAuditoria = (req, res, next) => {
  const hora = new Date().toLocaleTimeString('pt-BR')
  console.log(`[AUDITORIA - ${hora}] ${req.method} ${req.url}`)
  next()
}

const app = express()

app.use(loggerAuditoria)
app.use(express.json())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerOptions)))

app.use('/usuarios', usuariosRouter)
app.use('/tarefas', tarefasRouter)

app.listen(3000, () => console.log('Servidor rodando na porta 3000'))