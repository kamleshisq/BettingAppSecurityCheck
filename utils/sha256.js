const crypto = require('crypto')

function signTextWithPrivateKey(privateKey, text) {
  // console.log(privateKey)
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(text);

  const signature = signer.sign(privateKey, 'base64');
  // console.log(signature)
  return signature;
}

// Example usage
// const privateKey = `-----BEGIN PRIVATE KEY-----
// MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDmvMgN9Z07zfnU
// ...
// z8yHvXJsmY7zSPVTdBZiYkECAwEAAQ==
// -----END PRIVATE KEY-----`;

// const textToSign = 'Hello, World!';
// const signature = signTextWithPrivateKey(privateKey, textToSign);
// console.log('Signature:', signature);

module.exports = signTextWithPrivateKey