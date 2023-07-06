
import * as fs from 'fs';
import 'dotenv/config'
import { Keypair } from "@solana/web3.js";
import {mint} from "./mint_nft.ts"

( async () => {
  let secret = process.env.secret.split(',').map(a=>parseInt(a));
  const WALLET = Keypair.fromSecretKey(new Uint8Array(secret));
  console.log(WALLET);
  let config = JSON.parse(fs.readFileSync("./src/nft_config/config_fp_h.json", "utf-8"))
  config.attributes[0].value=5;
  console.log(config);
  mint(config,WALLET);
})();

