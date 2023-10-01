import { readFile, writeFile, opendir } from "node:fs/promises";
import crypto from "node:crypto";
import { resolve } from "path";
import { promisify } from "node:util";

const TRAIN_DATA_URL =
  "https://maps.amtrak.com/services/MapDataService/trains/getTrainsData";

const keyId = "69af143c-e8cf-47f8-bf09-fc1f61e5cc33";
const salt = "9a3686ac";
const iv = "c6eb2f7f5c4740c1a2f708fefd947d39";
const ivBuffer = Buffer.from(iv, 'hex');

const SECRET_KEY_STRING_LENGTH = 88;

async function main() {
  const encryptedDir = './tmp/AmHack_encrypted';
  const decryptedDir = './tmp/AmHack_decrypted';

  const derivedPublicKey = crypto.pbkdf2Sync(keyId, Buffer.from(salt, 'hex'), 1e3, 16, 'sha1'); // 071e283e782b8827396d6486dfb87027

  const dir = await opendir(encryptedDir);

  for await (const file of dir) {
    try {
      //const response = await (await fetch(TRAIN_DATA_URL)).text();
      const response = await (await readFile(resolve(encryptedDir, file.name))).toString();
      const trainDataEncrypted = response.slice(0, -SECRET_KEY_STRING_LENGTH)
      const secretKeyEncrypted = response.slice(-SECRET_KEY_STRING_LENGTH);


      const privateKeyDecipher = crypto.createDecipheriv('aes-128-cbc', derivedPublicKey, ivBuffer);

      // TODO: streams would be cleaner here, maybe
      let secretKeyDecrypted = privateKeyDecipher.update(secretKeyEncrypted, 'base64', 'utf8');
      secretKeyDecrypted += privateKeyDecipher.final('utf8');
      // console.log(secretKeyEncrypted);
      // console.log(secretKeyDecrypted);

      const derivedSecretKey = await promisify(crypto.pbkdf2)(secretKeyDecrypted.split('|')[0], Buffer.from(salt, 'hex'), 1e3, 16, 'sha1');
      // console.log(`derivedSecretKey: ${derivedSecretKey.toString('hex')}`);
      const dataDecipher = crypto.createDecipheriv('aes-128-cbc', derivedSecretKey, ivBuffer);

      let dataDecrypted = dataDecipher.update(trainDataEncrypted, 'base64', 'utf-8');
      dataDecrypted += dataDecipher.final('utf-8');

      await writeFile(resolve(decryptedDir, file.name), JSON.stringify(JSON.parse(dataDecrypted), undefined, 2), 'utf-8');
      console.log(`Completed file ${file.name}`);
    } catch (e) {
      console.error(`Failed to decrypt file ${file.name}`, e);
    }
  }

}

main();
