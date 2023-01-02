interface Client {
  id: number
  userName: string
  email: string
  password: string
  phone: {
    area_code: string
    number: string
  }
  identification: {
    type: string
    number: string
  }
  preferences: number[]
  accountBlocked: 0 | 1
  subscription: 0 | 1
}

export default Client
