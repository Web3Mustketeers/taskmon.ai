import { Connection, PublicKey } from "@solana/web3.js";
import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile, toBigNumber } from "@metaplex-foundation/js";
import * as fs from 'fs';
const SOLANA_CONNECTION = new Connection(
  "https://api.devnet.solana.com",
  "confirmed"
);

let METAPLEX;

async function uploadImage(filePath: string,fileName: string): Promise<string>  {
  console.log(`Step 1 - Uploading Image`);
  const imgBuffer = fs.readFileSync(filePath+fileName);
  const imgMetaplexFile = toMetaplexFile(imgBuffer,fileName);
  const imgUri = await METAPLEX.storage().upload(imgMetaplexFile);
  console.log(`   Image URI:`,imgUri);
  return imgUri;  
}

async function uploadMetadata(imgUri: string, imgType: string, nftName: string, description: string, attributes: {trait_type: string, value: string}[]) {
  console.log(`Step 2 - Uploading Metadata`);
  const { uri } = await METAPLEX
  .nfts()
  .uploadMetadata({
      name: nftName,
      description: description,
      image: imgUri,
      attributes: attributes,
      properties: {
          files: [
              {
                  type: imgType,
                  uri: imgUri,
              },
          ]
      }
  });
  console.log('   Metadata URI:',uri);
  return uri;  
}

async function mintNft(metadataUri: string, name: string, sellerFee: number, symbol: string, creators: {address: PublicKey, share: number}[]) {
  console.log(`Step 3 - Minting NFT`);
  const { nft } = await METAPLEX
  .nfts()
  .create({
      uri: metadataUri,
      name: name,
      sellerFeeBasisPoints: sellerFee,
      symbol: symbol,
      creators: creators,
      isMutable: false,
  });
  console.log(`   Success!🎉`);
  console.log(`   Minted NFT: https://explorer.solana.com/address/${nft.address}?cluster=devnet`);  
  return nft.address;
}

export async function mint(CONFIG, WALLET) {
  console.log(`Minting ${CONFIG.imgName} to an NFT in Wallet ${WALLET.publicKey.toBase58()}.`);
  CONFIG.creators = [
    {address: WALLET.publicKey, share: 100}
  ];
  METAPLEX = Metaplex.make(SOLANA_CONNECTION)
  .use(keypairIdentity(WALLET))
  .use(bundlrStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: "https://api.devnet.solana.com",
      timeout: 60000,
  }));  
  //Step 1 - Upload Image
  const imgUri = await uploadImage(CONFIG.uploadPath, CONFIG.imgFileName);
  //Step 2 - Upload Metadata
  const metadataUri = await uploadMetadata(imgUri, CONFIG.imgType, CONFIG.imgName, CONFIG.description, CONFIG.attributes); 
  //Step 3 - Mint NFT
  const result = await mintNft(metadataUri, CONFIG.imgName, CONFIG.sellerFeeBasisPoints, CONFIG.symbol, CONFIG.creators);
  return result;
}
