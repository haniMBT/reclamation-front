const secretKey = "MaCléSecrète123!";
import CryptoJS from "crypto-js";

export const crypt = (id) => {
  return CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
}

export const decrypt = (cryptedId) => {
  const bytes = CryptoJS.AES.decrypt(cryptedId, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}
