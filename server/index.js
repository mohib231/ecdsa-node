import express from 'express'
const app = express()
import cors from 'cors'
const port = 3042

import { keyPairs, verifyTransaction, updateBalances } from './generator.js'

app.use(cors())
app.use(express.json())

app.get('/balance/:address', (req, res) => {
  const { address } = req.params
  const balance = keyPairs.filter((el) => el.publicKey === address) || 0
  res.json({ balance: balance[0].balance })
})

app.post('/send', async (req, res) => {
  const { transaction, signature } = req.body

  const senderPublicKey = transaction.from
  console.log(transaction)

  if (verifyTransaction(transaction, signature, senderPublicKey)) {
    console.log(signature)
    try {
      const remainingBalance = updateBalances(transaction)
      res.json({
        status: 'success',
        message: 'Transaction completed',
        balance: remainingBalance,
      })
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message })
    }
  } else {
    console.log('failed')
    res.status(400).json({ status: 'error', message: 'Invalid signature' })
  }

})

app.listen(port, () => {
  console.log(`Listening on port ${port}!`)
})

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0
  }
}
