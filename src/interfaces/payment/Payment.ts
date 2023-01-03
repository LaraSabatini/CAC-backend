export interface PaymentInterface {
  id: number
  paymentId: string
  collectionId: string
  collectionStatus: string
  status: string
  paymentType: string
  merchantOrderId: string
  preferenceId: string
  pricePaid: number
  clientId: number
  paymentExpireDate: string
  itemId: string
}
