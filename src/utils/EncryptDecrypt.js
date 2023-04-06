const Keys = JSON.parse(process.env.REACT_APP_ID_KEY);

export function Encrypt(id) {
  // const encryptedAES = CryptoJS.AES.encrypt(String(id), "My Secret Passphrase");
  // const decryptedBytes = CryptoJS.AES.decrypt(encryptedAES, "My Secret Passphrase");
  return ((((Number(id) * Keys[0]) + Keys[1]) * Keys[2]) + Keys[3]) * Keys[4]
}

export function Decrypt(encryptedId) {
  // return decryptedBytes.toString(CryptoJS.enc.Utf8);
  return ((((Number(encryptedId) / Keys[4]) - Keys[3]) / Keys[2]) - Keys[1]) / Keys[0]
}
