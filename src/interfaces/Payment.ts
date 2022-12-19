interface PaymentInterface {
	  id: number
    clientId: number
		mpUser: string
    paymentExpireDate: Date
		item: number
		pricePaid: number
}
    
export default PaymentInterface;