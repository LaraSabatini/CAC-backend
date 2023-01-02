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
  accountBlocked: boolean
  subscription: boolean
}

export default Client
