export interface CreatedByInterface {
  id: number
  email: string
}

export interface ChangesHistoryInterface {
  date: Date
  changedBy: CreatedByInterface
  elementChanged: string
}

export interface ArticleFiltersInterface {
  id: number
  value: string
}

interface ArticleInterface {
  id: number
  title: string
  description: string
  createdBy: JSON // CreatedByInterface
  changesHistory: JSON // ChangesHistoryInterface[]
  portrait: string
  subtitle: string
  regionFilters: JSON // ArticleFiltersInterface[]
  themeFilters: JSON // ArticleFiltersInterface[]
  article: string
  attachments: JSON // string[]
  author: string
  saved: number
  draft: 0 | 1
}

export default ArticleInterface
