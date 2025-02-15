import * as crypto from "crypto"
import * as fs from "fs"
import { config } from "dotenv"

config()

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
	? crypto.scryptSync(process.env.ENCRYPTION_KEY, "salt", 32)
	: undefined

export const encrypt = (text: string) => {
	if (!ENCRYPTION_KEY) return
	const iv = crypto.randomBytes(16)
	const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv)
	let encrypted = cipher.update(text)
	encrypted = Buffer.concat([encrypted, cipher.final()])
	return iv.toString("hex") + ":" + encrypted.toString("hex")
}

export const decrypt = (text: string) => {
	if (!ENCRYPTION_KEY) return
	const textParts = text.split(":")
	const iv = Buffer.from(textParts.shift()!, "hex")
	const encryptedText = Buffer.from(textParts.join(":"), "hex")
	const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv)
	let decrypted = decipher.update(encryptedText)
	decrypted = Buffer.concat([decrypted, decipher.final()])
	return decrypted.toString()
}

const encryptEnvFile = () => {
	const envContent = fs.readFileSync(".env", "utf8")
	const encryptedContent = encrypt(envContent)
	if (!encryptedContent) return
	fs.writeFileSync(".env.encrypted", encryptedContent)
	console.log("Encrypted .env file created as .env.encrypted")
}

const decryptEnvFile = () => {
	const encryptedContent = fs.readFileSync(".env.encrypted", "utf8")
	const decryptedContent = decrypt(encryptedContent)
	if (!decryptedContent) return
	fs.writeFileSync(".env", decryptedContent)
	console.log(".env file created from decrypted content")
}

const command = process.argv[2]
if (process.env.ENCRYPTION_KEY === "" || process.env.ENCRYPTION_KEY === "github-action") {
	console.log("Skipping encryption and decryption.")
} else if (command === "encrypt") {
	encryptEnvFile()
} else if (command === "decrypt") {
	decryptEnvFile()
} else {
	console.log("Usage: tsx env:encrypt or npm run env:decrypt")
}
