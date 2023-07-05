
import * as fs from 'fs';
import secret = require('/Users/takehararyuuji/ryu-solana-wallet/my-keypair.json');
import { Keypair } from "@solana/web3.js";
import {mint} from "./mint_nft"

const WALLET = Keypair.fromSecretKey(new Uint8Array(secret));
let config = JSON.parse(fs.readFileSync("./src/nft_config/config_fp_h.json", "utf-8"))
config.attributes[0].value=5;
console.log(config);
mint(config,WALLET);

