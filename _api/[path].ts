import Fastify from 'fastify'

const app = Fastify({
  logger: true,
})

app.get('/api/jeremi', async (req, res) => {
  return res.status(200).send("jeremi api rocks")
})

app.get('/api/hello', async (req, res) => {
  return res.status(200).send({ hello: "world" })
})

export default async function handler(req: any, res: any) {
  await app.ready()
  app.server.emit('request', req, res)
}