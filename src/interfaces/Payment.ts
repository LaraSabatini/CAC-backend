interface PaymentInterface {
  id: number
  clientId: number
  mpUser: string
  paymentExpireDate: Date
  itemId: number
  pricePaid: number
}

export default PaymentInterface
