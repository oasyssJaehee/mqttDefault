const crypto = require('crypto');

// const key = process.env.CRYPTO_KEY // 대칭형 키

// 양뱡한
// 암호화 & 복호화

// 암호화 메서드
const cipher = (password, key) => {
	const encrypt = crypto.createCipher('des', key) // des알고리즘과 키를 설정
	const encryptResult = encrypt.update(password, 'utf8', 'base64') // 암호화
		+ encrypt.final('base64') // 인코딩
		
	return encryptResult
}

// 복호화 메서드
const decipher = (password, key) => {
	const decode = crypto.createDecipher('des', key)
	const decodeResult = decode.update(password, 'base64', 'utf8') // 암호화된 문자열, 암호화 했던 인코딩 종류, 복호화 할 인코딩 종류 설정
		+ decode.final('utf8') // 복호화 결과의 인코딩
		
	return decodeResult
}
module.exports = {
    cipher,
    decipher
}