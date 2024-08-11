require('dotenv').config();

const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())

const {GoogleGenerativeAI} = require('@google/generative-ai')
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
app.post('/gemini', async(req,res) => {
    const history = req.body.history || []
    const model = genAI.getGenerativeModel({model: "gemini-1.0-pro"})
    const msg = req.body.message

    const chat = model.startChat({
        history: history.map(item => ({
            role: item.role, // Ensure 'role' is a valid value
            parts: item.parts.map(part => ({
                text: part.text // Ensure 'text' is correctly specified
            }))
        }))
    });

    const result = await chat.sendMessageStream(msg)
    const response = await result.response
    const text = await response.text()
    res.send(text)
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))