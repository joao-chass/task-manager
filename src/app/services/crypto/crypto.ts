import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private readonly secretKey = 'secret-key-12345';

  encrypt(text: string): string {
    try {
      return CryptoJS.AES.encrypt(text, this.secretKey).toString();
    } catch (error) {
      console.error('Erro ao criptografar:', error);
      return text; 
    }
  }

  decrypt(ciphertext: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Erro ao descriptografar:', error);
      return ciphertext; 
    }
  }
}
