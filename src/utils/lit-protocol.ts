//import * as LitJsSdk from '@lit-protocol/lit-node-client'
import {
  LitNodeClient,
  ethConnect,
  uint8arrayToString,
  base64StringToBlob,
  blobToBase64String,
  checkAndSignAuthMessage,
  encryptString,
  decryptString,
} from '@lit-protocol/lit-node-client'
import { AccessControlConditions } from '@lit-protocol/types'

export type EncryptStringArgs = {
  text: string
  accessControlConditions: AccessControlConditions
}

export type DecryptStringArgs = {
  encryptedString: string
  encryptedSymmetricKey: string
  accessControlConditions: AccessControlConditions
}

// const client = new LitJsSdk.LitNodeClient({})
// const chain = import.meta.env.VITE_DEFAULT_LINEAGE_CHAIN

class LitProtocol {
  public litNodeClient: LitNodeClient
  private client: LitNodeClient
  private _chain: string

  constructor(chain: string) {
    this.client = new LitNodeClient({ debug: false })
    this.litNodeClient = {} as LitNodeClient
    this._chain = chain
  }

  async connect() {
    await this.client.connect()
    this.litNodeClient = this.client
  }

  async encryptString({ text, accessControlConditions }: EncryptStringArgs) {
    if (!this.litNodeClient) await this.connect()

    const authSig = await checkAndSignAuthMessage({ chain: this._chain })

    const { encryptedString, symmetricKey } = await encryptString(text)

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain: this._chain,
    })

    return {
      encryptedString: await blobToBase64String(encryptedString),
      encryptedSymmetricKey: uint8arrayToString(encryptedSymmetricKey, 'base16'),
      authSig,
    }
  }

  async decryptString({ encryptedString, encryptedSymmetricKey, accessControlConditions }: DecryptStringArgs) {
    if (!this.litNodeClient) await this.connect()

    console.log(
      `%c ${JSON.stringify({ accessControlConditions, encryptedSymmetricKey, chain: this._chain }, null, 2)}`,
      'background: #222; color: #bada55'
    )

    const authSig = await checkAndSignAuthMessage({ chain: this._chain })

    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      authSig,
      chain: this._chain,
    })

    const decryptedString = await decryptString(base64StringToBlob(encryptedString), symmetricKey)
    return decryptedString
  }

  async generateAuthSign(provider: any, address: string, chainId: number) {
    return await ethConnect.signAndSaveAuthMessage({
      web3: provider,
      account: address.toLowerCase(),
      chainId,
    } as any)
  }
}

export default LitProtocol
