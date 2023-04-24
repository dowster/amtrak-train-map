use aes::cipher::{block_padding::Pkcs7, BlockDecryptMut, KeyIvInit};
use base64::{engine::general_purpose, Engine as _};
use generic_array::{typenum::U16, GenericArray};
use hex_literal::hex;
use pbkdf2::pbkdf2_hmac;
use sha1::Sha1;
use std::io;
use std::str;

type Aes128CbcDec = cbc::Decryptor<aes::Aes128>;
type InitVector = [u8; 16];

const IV: InitVector = hex!("c6eb2f7f5c4740c1a2f708fefd947d39");
const PUBLIC_KEY: &[u8; 36] = b"69af143c-e8cf-47f8-bf09-fc1f61e5cc33";
const SALT: [u8; 4] = hex!("9a3686ac");

fn get_derived_key(key_id: &[u8; 36]) -> GenericArray<u8, U16> {
    let mut derived_key = GenericArray::from([0u8; 16]);
    pbkdf2_hmac::<Sha1>(key_id, &SALT, 1000, &mut derived_key);

    return derived_key;
}

fn get_private_key(encryption_data: &str) -> [u8; 36] {
    let mut buffer = [0u8; 88];
    let buffer_bytes = general_purpose::STANDARD
        .decode_slice(encryption_data, &mut buffer)
        .unwrap();

    let buffer_small = &mut buffer[..buffer_bytes];

    // println!("Encoded encryption data is {encryption_data}");
    // println!("Decoded {buffer_bytes} bytes from encryption_data");

    let private_key = Aes128CbcDec::new(&get_derived_key(PUBLIC_KEY).into(), &IV.into())
        .decrypt_padded_mut::<Pkcs7>(buffer_small)
        .unwrap();

    let private_key = match str::from_utf8(&private_key) {
        Ok(v) => v,
        Err(e) => panic!("Invalid UTF-8 Sequence decoded from encryption data: {}", e),
    };

    let v: Vec<&str> = private_key.split('|').collect();
    let bytes = v.first().unwrap().clone().as_bytes();
    let mut result = [0u8; 36];
    result.copy_from_slice(bytes);
    return result;
}

fn get_data_parts(data: &str) -> (&str, &str) {
    data.split_at(data.len() - 88)
}

struct TrainData {
    public_key: String,
    private_key: String,
    data: String,
}

fn decrypt_train_data(encoded_data: &str) -> TrainData {
    let (train_data, encryption_data) = get_data_parts(&encoded_data);
    let private_key = get_private_key(encryption_data);
    let derived_private_key = get_derived_key(&private_key);

    let mut train_data = general_purpose::STANDARD.decode(train_data).unwrap();

    let train_data = Aes128CbcDec::new(&derived_private_key.into(), &IV.into())
        .decrypt_padded_mut::<Pkcs7>(train_data.as_mut())
        .unwrap();

    // Convert it all to strings
    let public_key_used = match str::from_utf8(PUBLIC_KEY) {
        Ok(v) => v,
        Err(e) => panic!("Invalid UTF-8 Sequence decoded from encryption data: {}", e),
    };

    let private_key = match str::from_utf8(&private_key) {
        Ok(v) => v,
        Err(e) => panic!("Invalid UTF-8 Sequence decoded from encryption data: {}", e),
    };

    let train_data = match str::from_utf8(&train_data) {
        Ok(v) => v,
        Err(e) => panic!("Invalid UTF-8 Sequence decoded from encryption data: {}", e),
    };

    TrainData {
        public_key: String::from(public_key_used),
        private_key: String::from(private_key),
        data: String::from(train_data),
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_line(&mut input).unwrap();

    let decrypted_data = decrypt_train_data(&input);
    let train_data = decrypted_data.data;
    println!("{train_data}");
}
