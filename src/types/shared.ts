export interface Category {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface File {
  id: string
  userId: string
  description: string
  path: string
  status: string
  categories: Category[]
  createdAt: string
  updatedAt: string
}
