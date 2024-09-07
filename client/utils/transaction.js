import pkg from 'elliptic'
const { ec: EC } = pkg
const ec = new EC('secp256k1') 

export function signTransaction(transaction, privateKey) {
  const keyPair = ec.keyFromPrivate(privateKey, 'hex')
  const transactionString = JSON.stringify(transaction)
  const hash = ec.hash().update(transactionString).digest('hex')
  const signature = keyPair.sign(hash)
  return signature.toDER('hex')
}
