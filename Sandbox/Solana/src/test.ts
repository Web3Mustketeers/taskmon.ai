
import * as fs from 'fs';
import 'dotenv/config'
import { Keypair,PublicKey } from "@solana/web3.js";
import {mint} from "./mint_nft.ts"
import {transfer_nft,get_nft_detail} from "./transfer_nft.ts"


(async () => {
  let secret = process.env.secret.split(',').map(a=>parseInt(a));
  const wallet = Keypair.fromSecretKey(new Uint8Array(secret));
  const toKey = new PublicKey("8qEt8FhkBvcBAcZrk6P9nyCpjC9zwZhrw17qCea54BkW");
  
  let config = JSON.parse(fs.readFileSync("./src/nft_config/config_fp_h.json", "utf-8"))
  //config.attributes[0].value=9;
  console.log(config);
  const tokenMint = await mint(config,wallet);
  console.log(tokenMint);
  let ret = await transfer_nft(tokenMint,toKey,wallet);
  console.log(ret);
})();
