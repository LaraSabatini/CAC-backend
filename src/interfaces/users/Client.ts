interface Client {
  id: number
  name: string
  lastName: string
  email: string
  identificationType: string
  identificationNumber: string
  phoneAreaCode: string
  phoneNumber: string
  password: string
  preferences: number[]
  accountBlocked: 1 | 0
  subscription: 1 | 0
  dateCreated: string
  loginAttempts: number
}

export default Client
