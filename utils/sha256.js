const crypto = require('crypto')

function signTextWithPrivateKey(privateKey, text) {
  // console.log(privateKey)
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(text);

  const signature = signer.sign(privateKey, 'base64');
  // console.log(signature)
  return signature;
}
module.exports = signTextWithPrivateKey