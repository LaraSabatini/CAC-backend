const generatePassword = () => {
  return Math.random().toString(36).slice(-8)
}

export default generatePassword
