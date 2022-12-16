interface Client {
  id: number
  user_name: string
  email: string
  password: string
  payment_info: {
    mp_user: string
    payment_expire_date: Date
    previous_payments: {
      date: Date,
      item: number,
      state: string // current | expired
    }[]
  }
  contact_info: {
    phone: number
    address: {
      street: string
      street_number: number
      neighbourhood: string
      state: string
      country: string
    }
  }
  preferences: number[]
  account_blocked: boolean
  subscription: boolean // active | inactive
}
  
export default Client;