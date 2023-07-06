import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile, toBigNumber, tryOrNull } from "@metaplex-foundation/js";
import { Connection, Transaction, PublicKey,sendAndConfirmTransaction } from "@solana/web3.js";

const connection = new Connection(
  "https://api.devnet.solana.com",
  "confirmed"
  );
  export async function get_nft_detail(nftOrSft,toPubKey, wallet) {
    let ata = await getAssociatedTokenAddress(
      nftOrSft, // mint
      wallet.publicKey // owner
    );
    console.log(`ATA: ${ata.toBase58()}`);    
    let tokenAccount = await getAccount(connection, ata);    
    console.log("tokenAccount",tokenAccount);
  };

  export async function transfer_nft(nftOrSft,toPubKey, wallet) {
    //let tmp = await createAssociatedTokenAccount(
  //  connection,wallet,nftOrSft,toPubKey);
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    wallet,
    nftOrSft,
    wallet.publicKey
  );  
  const associatedDestinationTokenAddr = await getOrCreateAssociatedTokenAccount(
    connection,
    wallet, 
    nftOrSft,
    toPubKey
  );

  const receiverAccount = await connection.getAccountInfo(associatedDestinationTokenAddr.address);
  console.log(receiverAccount);
  
  let transaction = new Transaction();
  const transfer = createTransferInstruction(
    fromTokenAccount.address,
    associatedDestinationTokenAddr.address,
    wallet.publicKey,
    1
  );
  transaction.add(transfer);
  transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
  //console.log(transaction.instructions[0].keys);
  await sendAndConfirmTransaction(connection, transaction, [wallet]);  
}

export async function transfer_nft2(nftOrSft,owner,toPubKey, WALLET) {

  let METAPLEX = Metaplex.make(connection)
  .use(keypairIdentity(WALLET))
  .use(bundlrStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: "https://api.devnet.solana.com",
      timeout: 60000,
  }));  
  await METAPLEX.nfts().transfer({
      nftOrSft,
      authority: owner,
      fromOwner: owner.publicKey,
      toOwner: toPubKey
  });
}

import secret = require('/Users/takehararyuuji/ryu-solana-wallet/my-keypair.json');
import { Keypair } from "@solana/web3.js";
import { createAssociatedTokenAccount, getOrCreateAssociatedTokenAccount,createTransferInstruction, getAccount, getAssociatedTokenAddress } from "@solana/spl-token";

const wallet = Keypair.fromSecretKey(new Uint8Array(secret));
const toKey = new PublicKey("8qEt8FhkBvcBAcZrk6P9nyCpjC9zwZhrw17qCea54BkW");
const tokenMint = new PublicKey("8A5UtHiWpa87kXgbPwznhJ8zWKzdnQuzeGcjE8yTp4fS");
//const sourceNft = new PublicKey("5yVjDN4673TqRvrXM1rgjcqmVUU3AdtRsFcCDrBC4iFX");
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';


const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);
const tmp = PublicKey.findProgramAddressSync(
  [
      toKey.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      tokenMint.toBuffer(),
  ],
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
)[0];
console.log("Sync:",tmp);
(async () => {
  await transfer_nft(tokenMint,toKey,wallet);
})();