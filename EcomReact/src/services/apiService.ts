// Mock API service for e-commerce admin dashboard
// In a real application, replace these with actual API endpoints

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  totalCustomers: number;
}

interface Order {
  id: string;
  customerName: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  items: number;
}

interface Product {
  productId: number
  productName: string;
  description: string;
  price: number;
  discount: number;
  quantity: number;
  specialPrice: number,
  image: string,
}

interface ProductForm {
  productName: string;
  description: string;
  price: number;
  discount: number;
  quantity: number;
  specialPrice: number,
  image: string,

}

interface Category{
  categoryId: number,
  categoryName: string
}

class ApiService {
  private baseURL: string = 'http://localhost:8080'; // Replace with your actual API URL

  // Simulate API delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Dashboard Stats API
  async getDashboardStats(): Promise<DashboardStats> {
    await this.delay(500);
    
    // Mock data - replace with actual API call
    return {
      totalOrders: 1247,
      totalProducts: 156,
      totalRevenue: 47580.00,
      totalCustomers: 892
    };
  }

  // Orders API
  async getOrders(): Promise<Order[]> {
    await this.delay(800);
    
    // Mock data - replace with actual API call
    const mockOrders: Order[] = [
      {
        id: '1001',
        customerName: 'John Smith',
        email: 'john.smith@email.com',
        total: 299.99,
        status: 'delivered',
        orderDate: '2024-01-15T10:30:00Z',
        items: 3
      },
      {
        id: '1002',
        customerName: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        total: 159.50,
        status: 'shipped',
        orderDate: '2024-01-14T15:45:00Z',
        items: 2
      },
      {
        id: '1003',
        customerName: 'Mike Davis',
        email: 'mike.davis@email.com',
        total: 89.99,
        status: 'processing',
        orderDate: '2024-01-14T09:20:00Z',
        items: 1
      },
      {
        id: '1004',
        customerName: 'Emily Brown',
        email: 'emily.brown@email.com',
        total: 449.99,
        status: 'pending',
        orderDate: '2024-01-13T14:10:00Z',
        items: 4
      },
      {
        id: '1005',
        customerName: 'Alex Wilson',
        email: 'alex.wilson@email.com',
        total: 199.99,
        status: 'cancelled',
        orderDate: '2024-01-12T11:00:00Z',
        items: 2
      },
      {
        id: '1006',
        customerName: 'Lisa Thompson',
        email: 'lisa.t@email.com',
        total: 329.50,
        status: 'delivered',
        orderDate: '2024-01-12T16:30:00Z',
        items: 3
      },
      {
        id: '1007',
        customerName: 'David Miller',
        email: 'david.miller@email.com',
        total: 75.00,
        status: 'shipped',
        orderDate: '2024-01-11T13:45:00Z',
        items: 1
      },
      {
        id: '1008',
        customerName: 'Jennifer Lee',
        email: 'jennifer.lee@email.com',
        total: 259.99,
        status: 'processing',
        orderDate: '2024-01-11T10:15:00Z',
        items: 2
      }
    ];

    return mockOrders;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    await this.delay(300);
    
    // In a real API, this would be:
    // const response = await fetch(`${this.baseURL}/orders/${orderId}/status`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status })
    // });
    // 
    // if (!response.ok) throw new Error('Failed to update order status');
    
    console.log(`Order ${orderId} status updated to ${status}`);
  }

  // Products API
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${this.baseURL}/api/public/products`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    })
    if (!response.ok) throw new Error('Failed to featch product');
    const data = await response.json();
    return data['content'];
  }

  async addProduct(productData: ProductForm, categoryId): Promise<Product> {
    const response = await fetch(`${this.baseURL}/api/admin/categories/${categoryId}/product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) throw new Error('Failed to add product');
    return await response.json();
  }

  async deleteProduct(productId: number): Promise<void> {
    await this.delay(500);
    
    // In a real API, this would be:
    // const response = await fetch(`${this.baseURL}/products/${productId}`, {
    //   method: 'DELETE'
    // });
    // 
    // if (!response.ok) throw new Error('Failed to delete product');
    
    console.log(`Product ${productId} deleted`);
  }

  async updateProduct(productId: string, productData: Partial<Product>): Promise<Product> {
    await this.delay(800);
    
    // In a real API, this would be:
    // const response = await fetch(`${this.baseURL}/products/${productId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(productData)
    // });
    // 
    // if (!response.ok) throw new Error('Failed to update product');
    // return await response.json();

    console.log(`Product ${productId} updated with:`, productData);
    return { id: productId, ...productData } as Product;
  }

  async getCategory(): Promise<Category[]>{
    const response = await fetch(`${this.baseURL}/api/public/categories`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    });
    if(!response.ok) throw new Error('Failed to fetch category data');
    const data = await response.json();
    console.log('data raw', data["content"]);
    return data["content"];
    
  }
}

export const apiService = new ApiService();