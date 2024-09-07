import pkg from 'elliptic'
const { ec: EC } = pkg
const ec = new EC('secp256k1')
import { keyPairs } from '../keymap.mjs'


function verifyTransaction(transaction, signature, publicKey) {
  const key = ec.keyFromPublic(publicKey, 'hex')
  const transactionString = JSON.stringify(transaction)

  const hash = ec.hash().update(transactionString).digest('hex')
  console.log(hash,transactionString,key)
  return key.verify(hash, signature)
}

function updateBalances(transaction) {
  const sender = keyPairs.find((kp) => kp.publicKey === transaction.from)
  const receiver = keyPairs.find((kp) => kp.publicKey === transaction.to)

  if (!sender || !receiver) {
    throw new Error('Sender or receiver not found')
  }

  if (sender.balance < transaction.amount) {
    throw new Error('Insufficient funds')
  }

  sender.balance -= transaction.amount
  receiver.balance += transaction.amount
  return sender.balance;
}

export { verifyTransaction, updateBalances, keyPairs }

