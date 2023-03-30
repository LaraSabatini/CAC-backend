export interface DBPaymentInterface {
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

export interface PreferenceInterface {
  binary_mode: boolean
  items: any
  payer: any
  back_urls: {
    success: string
    failure: string
    pending: string
  }
  auto_return: "approved" | "all" | undefined
  notification_url: string
}

export interface PaymentNotificationInterface {
  action: string
  api_version: string
  data: { id: string } // purchase ID
  date_created: string
  id: number
  live_mode: boolean
  type: string
  user_id: string
}

export interface MPPaymentInterface {
  accounts_info: any
  acquirer_reconciliation: any[]
  additional_info: {
    authentication_code: any
    available_balance: any
    ip_address: string
    items: {
      category_id: number
      description: number
      id: string
      picture_url: string
      quantity: string
      title: string
      unit_price: string
    }[]

    nsu_processadora: any
    payer: {
      first_name: string
      last_name: string
    }
  }
  authorization_code: any
  binary_mode: boolean
  brand_id: any
  build_version: "2.138.1"
  call_for_authorize_id: any
  captured: boolean
  card: any
  charges_details: any
  collector_id: number
  corporation_id: any
  counter_currency: any
  coupon_amount: number
  currency_id: string
  date_approved: string
  date_created: string
  date_last_updated: string
  date_of_expiration: any
  deduction_schema: any
  description: string
  differential_pricing_id: any
  external_reference: any
  fee_details: {
    amount: number
    fee_payer: string
    type: string
  }[]

  financing_group: any
  id: number
  installments: number
  integrator_id: any
  issuer_id: any
  live_mode: boolean
  marketplace_owner: any
  merchant_account_id: any
  merchant_number: any
  metadata: any
  money_release_date: string
  money_release_schema: any
  money_release_status: any
  notification_url: string
  operation_type: string
  order: {
    id: string
    type: string
  }
  payer: {
    first_name: any
    last_name: any
    email: string
    identification: {
      number: string
      type: string
    }
    phone: {
      area_code: any
      number: any
      extension: any
    }
    type: any
    entity_type: any
    id: string
  }
  payment_method: {
    id: string
    type: string
  }
  payment_method_id: string
  payment_type_id: string
  platform_id: any
  point_of_interaction: {
    business_info: {
      sub_unit: string
      unit: string
    }
    type: string
  }
  pos_id: any
  processing_mode: string
  refunds: any[]
  shipping_amount: number
  sponsor_id: any
  statement_descriptor: any
  status: string
  status_detail: string
  store_id: any
  tags: any
  taxes_amount: number
  transaction_amount: number
  transaction_amount_refunded: number
  transaction_details: {
    acquirer_reference: any
    external_resource_url: any
    financial_institution: any
    installment_amount: number
    net_received_amount: number
    overpaid_amount: number
    payable_deferral_period: any
    payment_method_reference_id: any
    total_paid_amount: number
  }
}

export interface MPPreferenceInterface {
  additional_info: string
  auto_return: string
  back_urls: {
    failure: string
    pending: string
    success: string
  }
  binary_mode: false
  client_id: string
  collector_id: number
  coupon_code: any
  coupon_labels: any
  date_created: string
  date_of_expiration: any
  expiration_date_from: any
  expiration_date_to: any
  expires: false
  external_reference: string
  id: string
  init_point: string
  internal_metadata: any
  items: {
    id: string
    category_id: string
    currency_id: string
    description: string
    title: string
    quantity: number
    unit_price: number
  }[]
  marketplace: string
  marketplace_fee: number
  metadata: any
  notification_url: any
  operation_type: string
  payer: {
    phone: {
      area_code: string
      number: string
    }
    address: {
      zip_code: string
      street_name: string
      street_number: any
    }
    email: string
    identification: {
      number: string
      type: string
    }
    name: string
    surname: string
    date_created: any
    last_purchase: any
  }
  payment_methods: {
    default_card_id: any
    default_payment_method_id: any
    excluded_payment_methods: {
      id: string
    }[]
    excluded_payment_types: {
      id: string
    }[]
    installments: any
    default_installments: any
  }
  processing_modes: any
  product_id: any
  redirect_urls: {
    failure: string
    pending: string
    success: string
  }
  sandbox_init_point: string
  site_id: string
  shipments: {
    default_shipping_method: any
    receiver_address: {
      zip_code: string
      street_name: string
      street_number: any
      floor: string
      apartment: string
      city_name: any
      state_name: any
      country_name: any
    }
  }
  total_amount: any
  last_updated: any
}
