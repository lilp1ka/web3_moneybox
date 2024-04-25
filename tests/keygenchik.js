const fs = require('fs');
const { Keypair } = require('@solana/web3.js');

const keypair = Keypair.generate();

const publicKey = keypair.publicKey.toString();
const privateKey = keypair.secretKey.toString();


const keys = {
  publicKey,
  privateKey
};

fs.writeFileSync('keys.json', JSON.stringify(keys, null, 2));

console.log('Ключи успешно созданы и сохранены в файле keys.json');
