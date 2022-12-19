import bcrypt from "bcryptjs"

const encrypt = async (textPlain: string): Promise<string> => {
  const hash = await bcrypt.hash(textPlain, 10)
  return hash
}

const compare = async (
  passwordPlain: string,
  hashPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(passwordPlain, hashPassword)
}

export { encrypt, compare }
