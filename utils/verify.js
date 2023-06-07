const crypto = require('crypto');
// const { func } = require('joi');

function verify(sig, pub, body){
const signature = sig; 
const publicKey = pub; 
let x = JSON.stringify(body)
// console.log(x, 132)

const signatureBuffer = Buffer.from(signature, 'base64');
// console.log(x, 121)
const verifier = crypto.createVerify('RSA-SHA256');
verifier.update(x); 
// console.log(publicKey)
// console.log(verifier)
let isSignatureValid
try{
    isSignatureValid = verifier.verify(publicKey, signatureBuffer);
}catch(err){
    console.log(err)
}
// console.log(isSignatureValid, 456)
return isSignatureValid;
}

module.exports = verify