export interface Article {
  id: number
  title: string
  description: string
  categories: number[]
  picture: Blob
  attachment: Blob
  createdBy: number
  changesHistory: JSON
}
