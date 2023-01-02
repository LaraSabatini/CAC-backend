export interface PaymentInterface {
  id: number
  clientId: number
  mpUser: string
  paymentExpireDate: Date
  itemId: number
  pricePaid: number
}
