import axios from 'axios'

const API_BASE_URL = 'https://3h2odg2ty1.execute-api.us-east-1.amazonaws.com'

export interface Product {
  id?: string
  name: string
  description: string
  price: number
  imageUrl: string // S3 URL for the image
  thumbnailUrl?: string // Optional thumbnail image
  createdAt?: string
  updatedAt?: string
}

export interface CreateProductRequest {
  name: string
  description: string
  price: number
  imageFile: File | null
}

export interface CreateProductResponse {
  message: string
  product: Product
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const productsApi = {
  createProduct: async (
    product: CreateProductRequest
  ): Promise<CreateProductResponse> => {
    if (!product.imageFile) {
      throw new Error('Image file is required')
    }

    // Convert image file to base64
    const imageData = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject(new Error('Failed to read image file'))
        }
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(product.imageFile!)
    })

    const requestData = {
      name: product.name,
      description: product.description,
      price: Number(product.price), // ensure it's a number
      imageData: imageData,
    }

    const response = await api.post<CreateProductResponse>(
      '/products',
      requestData
    )
    console.log(response.data)
    return response.data
  },

  getProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products')
    return response.data
  },

  removeProduct: async (
    productId: string
  ): Promise<{ message: string; productId: string }> => {
    const response = await api.delete<{ message: string; productId: string }>(
      `/products/${productId}`
    )
    return response.data
  },
}
