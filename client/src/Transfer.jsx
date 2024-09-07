import { useState } from 'react'

import axios from 'axios'
import { signTransaction } from '../utils/transaction'
import { keyPairs } from '../../keymap'

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState('')
  const [recipient, setRecipient] = useState('')

  const setValue = (setter) => (evt) => setter(evt.target.value)

  function getPrivateKeyForTransaction(publicKey) {
    const index = keyPairs.findIndex((el) => el.publicKey === publicKey)

    return keyPairs[index].privateKey
  }

  const transaction = {}

  async function transfer(evt) {
    evt.preventDefault()
    transaction.to = recipient
    transaction.from = address
    transaction.amount = parseInt(sendAmount)

    try {
      const privateKey = getPrivateKeyForTransaction(transaction.from)

      if (!privateKey) {
        alert('private key not found')
      }

      const signature = signTransaction(transaction, privateKey)
      
      const response = await axios.post('http://localhost:3042/send', {
        transaction,
        signature,
      })
      const { balance } = response.data

      setBalance(balance)
    } catch (ex) {
      console.log(ex)
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  )
}

export default Transfer
