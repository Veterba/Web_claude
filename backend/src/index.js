import express from 'express'

const app = express() // create a server
const PORT = 4000

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

