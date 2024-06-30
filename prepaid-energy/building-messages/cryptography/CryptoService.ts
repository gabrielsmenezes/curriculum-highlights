import * as CryptoJS from "crypto-js";
import { createCipheriv } from "crypto";

export class CryptoService {
  public encrypt(packetHex: string, key: string) {
    const hmac = this.hmac(packetHex, key);
    const blowfish = this.blowfish((packetHex + hmac), key);
    return blowfish;
  }

  public blowfish(hexMessage: string, hexKey: string) {
    let response = "";
    let halfMessage = "";
    let index = 0;
    const key = Buffer.from(hexKey, "utf8");
    let message;
    do {
      halfMessage = hexMessage.substring(index, index + 16);
      message = Buffer.from(halfMessage, "hex");
      response = response + this.encipher(key, message);
      index = index + 16;
    } while (hexMessage.length - index >= 16);
    halfMessage = hexMessage.substring(index);
    halfMessage = halfMessage.padEnd(16, "0");
    message = Buffer.from(halfMessage, "hex");
    response = response + this.encipher(key, message);
    return response;
  }

  private encipher(key: Buffer, data: Buffer) {
    const cipher = createCipheriv("bf-ecb", key, "").setAutoPadding(false);
    const response = cipher.update(data);
    return response.toString("hex").toUpperCase();
  }

  public hmac(hexMessage: string, hexKey: string): string {
    const message = CryptoJS.enc.Hex.parse(hexMessage);
    const key = CryptoJS.enc.Utf8.parse(hexKey);
    const hmac = CryptoJS.HmacSHA256(message, key);
    return hmac.toString(CryptoJS.enc.Hex).toUpperCase();
  }

  public generateKey() {
    const sha256 = CryptoJS.algo.SHA256.create();
    const energypay = "energypay";
    const now = Date.now().toString();
    const energypayNow = energypay + now;
    const sha = sha256.finalize(energypayNow).toString();
    return sha.slice(0, 32).toUpperCase();
  }
}
