import * as anchor from "@coral-xyz/anchor";
import { Program} from "@coral-xyz/anchor";
import { Sukasuka } from "../target/types/sukasuka";
import { Connection, Keypair, MessageAccountKeys, PublicKey} from "@solana/web3.js";
const assert = require("assert");

// const url = "https://api.devnet.solana.com"
// const programId = new PublicKey('BBWxojjkikdbGWPQThCDSC7tHP5AYc6GMPcsNRPvzAjP')

describe("sukasuka", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const moneyBox = anchor.web3.Keypair.generate();
  const program = anchor.workspace.Sukasuka as Program<Sukasuka>;


  it("create func", async () => { 
  const tx = await program.methods
    .create("my dream", new anchor.BN(2),)
    .accounts({
              moneyBox: moneyBox.publicKey,
              user: provider.wallet.publicKey,
              systemProgram: anchor.web3.SystemProgram.programId,
            }).signers([moneyBox]).rpc();

  const account = await program.account.moneyBox.fetch(moneyBox.publicKey);
  console.log("<create> transaction signature: ", tx)
  assert.ok(account.name === "my dream")
  })



  it("donate func", async () => {
    const donater = anchor.web3.Keypair.fromSecretKey(new Uint8Array([56,237,238,216,117,64,28,61,23,28,177,154,222,16,200,1,228,87,133,250,189,155,25,148,41,29,85,10,169,218,149,46,149,59,197,143,192,92,82,68,232,183,123,149,157,217,82,29,109,253,132,46,49,47,111,168,176,87,71,135,177,134,114,12]))
    const tx = await program.methods.donate(new anchor.BN(10000000))
    .accounts({
      moneyBox: moneyBox.publicKey,
      donater: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId

    }).signers([donater]).rpc().catch(e => console.error(e));
    console.log("<donate> func:", tx)
  })



it("withdraw func", async () => {

  const tx = await program.methods.withdraw(new anchor.BN(1000000))
  .accounts({
    moneyBox: moneyBox.publicKey,
    reciver: provider.wallet.publicKey,
    
  }).rpc()
  console.log("<withdraw> func: ", tx)
})

})

// Add your test here.
//     console.log("user wallet\n", userWallet, "public key\n", userWallet.publicKey.toString(), "secret key\n", userWallet.secretKey.toString())
//     const tx = await program.methods.create("my dream", new anchor.BN(2)).accounts( {
//       accounts: {
//         moneyBox: moneyBox.publicKey,
//         user: userWallet.publicKey,
//         systemProgram: anchor.web3.SystemProgram.programId,
//       }).signers: [userWallet]
//     }).rpc;
//     console.log("Your transaction signature", tx);
//   });
// });
