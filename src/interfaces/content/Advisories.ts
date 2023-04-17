export interface AdvisoryInterface {
  id: number
  adminId: number
  clientId: number
  clientName: string
  date: string
  hour: string
  month: number
  brief: string
  eventURL: string
  status: "pending" | "confirmed" | "cancelled"
}

export interface AdvisoryAvailavilityInterface {
  id: number
  adminId: number
  availability: string
}

export interface PublicEventsInterface {
  id: number
  title: string
  description: string
  date: string
  hour: string
  month: number
  eventURL: string
  attendant: string // JSON id[]
  createdBy: number
}
