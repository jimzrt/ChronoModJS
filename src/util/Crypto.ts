export const generateKey = (keybuffer: Uint32Array, chrono_binary: Uint8Array) => {
  const blowfish_s_init = chrono_binary.slice(0x39a738);
  const blowfish_p_init = chrono_binary.slice(0x39b738);
  const blowfish_key = chrono_binary.slice(0x398ee8);
  blowfish(keybuffer, blowfish_s_init, blowfish_p_init, blowfish_key);
};

const blowfish = (
  keybuffer: Uint32Array,
  blowfish_s_init: Uint8Array,
  blowfish_p_init: Uint8Array,
  blowfish_key: Uint8Array
) => {
  keybuffer.set(new Uint32Array(blowfish_s_init.buffer.slice(0, 0x1000)), 18);

  let crypt = 0;
  for (let step = 0; step < 18; step++) {
    const crypt_xor =
      blowfish_key[(crypt + 3) % 8] |
      ((blowfish_key[(crypt + 2) % 8] |
        ((blowfish_key[(crypt + 1) % 8] | (blowfish_key[crypt] << 8)) << 8)) <<
        8);
    keybuffer[step] =
      crypt_xor ^
      new Uint32Array(blowfish_p_init.buffer.slice(step * 4, step * 4 + 4))[0];
    crypt = (crypt + 4) % 8;
  }

  let crypt1 = new Uint32Array([0]);
  let crypt2 = new Uint32Array([0]);
  for (let step = 0; step < 18; step += 2) {
    encrypt32bitPair(keybuffer, crypt1, crypt2);
    keybuffer[step] = crypt1[0];
    keybuffer[step + 1] = crypt2[0];
  }

  let currentKeybuffer = keybuffer.subarray(18);
  for (let i = 0; i < 512; i++) {
    encrypt32bitPair(keybuffer, crypt1, crypt2);
    currentKeybuffer[0] = crypt1[0];
    currentKeybuffer[1] = crypt2[0];
    currentKeybuffer = currentKeybuffer.subarray(2);
  }
};

const encrypt32bitPair = (
  key_buffer: Uint32Array,
  encrypted_1: Uint32Array,
  encrypted_2: Uint32Array
) => {
  let tmp1 = 0;
  let tmp2 = encrypted_1[0];
  let tmp3 = encrypted_2[0];
  for (let i = 0; i < 0x10; ++i) {
    tmp1 = tmp2 ^ key_buffer[i];
    tmp2 =
      (((key_buffer[(tmp1 >>> 0x18) + 0x12] +
        key_buffer[((tmp1 >>> 0x10) & 0xff) + 0x112]) ^
        key_buffer[((tmp1 >>> 8) & 0xff) + 0x212]) +
        key_buffer[(tmp1 & 0xff) + 0x312]) ^
      tmp3;
    tmp3 = tmp1;
  }
  encrypted_1[0] = key_buffer[0x11] ^ tmp1;
  encrypted_2[0] = key_buffer[0x10] ^ tmp2;
};


const decrypt32bitPair = (
  key_buffer: Uint32Array,
  decrypted_1: Uint32Array,
  decrypted_2: Uint32Array
) => {
  let tmp1 = 0;
  let tmp2 = decrypted_1[0];
  let tmp3 = decrypted_2[0];
  for (let i = 0; i < 0x10; ++i) {
    tmp1 = tmp2 ^ key_buffer[0x11 - i];
    tmp2 =
      (((key_buffer[(tmp1 >>> 0x18) + 0x12] +
        key_buffer[((tmp1 >>> 0x10) & 0xff) + 0x112]) ^
        key_buffer[((tmp1 >>> 8) & 0xff) + 0x212]) +
        key_buffer[(tmp1 & 0xff) + 0x312]) ^
      tmp3;
    tmp3 = tmp1;
  }
  decrypted_1[0] = key_buffer[0] ^ tmp1;
  decrypted_2[0] = key_buffer[1] ^ tmp2;
};


const crypt64bit = (
  key_buffer: Uint32Array,
  should_encrypt: boolean,
  crypt_in: Uint8Array,
  crypt_out: Uint8Array
) => {
  let crypt_in_1: Uint32Array = new Uint32Array([
    (crypt_in[0] << 0x18) +
      (crypt_in[1] << 0x10) +
      (crypt_in[2] << 0x8) +
      crypt_in[3],
  ]);
  let crypt_in_2: Uint32Array = new Uint32Array([
    (crypt_in[4] << 0x18) +
      (crypt_in[5] << 0x10) +
      (crypt_in[6] << 0x8) +
      crypt_in[7],
  ]);

  if (should_encrypt) {
    encrypt32bitPair(
      key_buffer,
      crypt_in_1,
      crypt_in_2
    );

  } else {
    decrypt32bitPair(
      key_buffer,
      crypt_in_1,
      crypt_in_2
    );
  }

  crypt_out[0] = crypt_in_1[0] >>> 0x18;
  crypt_out[1] = crypt_in_1[0] >>> 0x10;
  crypt_out[2] = crypt_in_1[0] >>> 8;
  crypt_out[3] = crypt_in_1[0];
  crypt_out[4] = crypt_in_2[0] >>> 0x18;
  crypt_out[5] = crypt_in_2[0] >>> 0x10;
  crypt_out[6] = crypt_in_2[0] >>> 8;
  crypt_out[7] = crypt_in_2[0];
};


const cryptChunk = (
  key_buffer: Uint32Array,
  should_encrypt: boolean,
  buffer_size: number,
  header: Uint8Array,
  encData: Uint8Array
) => {
  const out_buffer = new Uint8Array(8);
  let buffer_index = 0;
  buffer_size = buffer_size / 8;
  for (let i = 0; i < buffer_size; ++i) {
    const buffer_chunk = encData.subarray(buffer_index);
    if (should_encrypt) {
      for (let j = 0; j < 8; ++j) {
        out_buffer[j] = buffer_chunk[j] ^ header[j];
      }
      crypt64bit(key_buffer, should_encrypt, out_buffer, out_buffer);
      header.set(out_buffer);
      buffer_chunk.set(out_buffer);
    } else {
      crypt64bit(key_buffer, should_encrypt, buffer_chunk, out_buffer);
      for (let j = 0; j < 8; ++j) {
        out_buffer[j] = out_buffer[j] ^ header[j];
      }

      header.set(buffer_chunk.slice(0, 8));
      buffer_chunk.set(out_buffer);
    }
    buffer_index += 8;
  }
};

const header_magic = (header: Uint8Array) => {
  header[0] ^= 0x75;
  header[1] ^= 0xfa;
  header[2] ^= 0x29;
  header[3] ^= 0x95;
  header[4] ^= 0x05;
  header[5] ^= 0x4d;
  header[6] ^= 0x41;
  header[7] ^= 0x5f;
};

export const decryptFile = (key: Uint32Array, encrypted: Uint8Array) => {
    header_magic(encrypted);

    const header = encrypted.slice(0, 8);
    // data is a view of the encrypted data
    const data = encrypted.subarray(8);
    cryptChunk(key, false, data.length, header, data);
    return data;
}