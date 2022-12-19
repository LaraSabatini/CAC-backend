export interface PaymentInterface {
  id: number
  clientId: number
  mpUser: string
  paymentExpireDate: Date
  itemId: number
  pricePaid: number
}

export interface PreferenceInterface {
  items: {
    id?: string
    title: string
    currency_id?: string
    picture_url?: string
    description?: string
    category_id?: string
    quantity: number
    unit_price: number
  }[]
  payer?: {
    name: string
    surname: string
    email: string
    phone: {
      area_code: string
      number: string
    }
    identification: {
      type: string
      number: string
    }
    address: {
      street_name: string
      street_number: number
      zip_code: string
    }
  }
  back_urls: {
    success: string
    failure: string
    pending: string
  }
  auto_return: "approved" | "all" | undefined
  payment_methods?: {
    excluded_payment_methods: {
      id: string
    }[]
    excluded_payment_types: {
      id: string
    }[]
    installments: number
  }
  notification_url?: string
  statement_descriptor?: string
  external_reference?: string
  expires?: boolean
  expiration_date_from?: Date
  expiration_date_to?: Date
}
