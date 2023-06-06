const crypto = require('crypto');
// const { func } = require('joi');

// Replace the following variables with your own values
function verify(sig, pub, body){
const signature = sig; // The signature you want to decrypt and verify
const publicKey = pub; // The public key for verification
let x = JSON.stringify(body)
console.log(x)
// Convert the signature and public key from base64 to buffers
const signatureBuffer = Buffer.from(signature, 'base64');
// console.log(signatureBuffer)
// Create a verifier object using the public key
const verifier = crypto.createVerify('RSA-SHA256');
verifier.update(x); // Replace 'data to verify' with the actual data you want to verify against the signature

// Verify the signature using the public key
const isSignatureValid = verifier.verify(publicKey, signatureBuffer);

return isSignatureValid;
}

module.exports = verify