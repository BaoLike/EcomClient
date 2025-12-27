import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { apiService } from '../services/apiService';
import api from '../api/api';



interface ProductForm {
  productName: string;
  description: string;
  price: number;
  discount: number;
  quantity: number;
  specialPrice: number,
  image: File | undefined,
}

interface Category{
  categoryId: number,
  categoryName: string,
}

interface Size {
  id: number;
  sizeName: string;
}

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState<ProductForm>({
    productName: '',
    description: '',
    price: 0,
    quantity: 0,
    specialPrice: 0,
    discount: 0,
    image: undefined
  });

  const listDataForm = []


  const [selectedCategoryId, handleSelectedCategory] = useState(0);
  const [categories, fetchCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [selectedSizeIds, setSelectedSizeIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const categoryData = await apiService.getCategory();
      fetchCategories(categoryData);
      
      const sizeData = await apiService.getSizes();
      setSizes(sizeData);
    }
    fetchData();
  }, []);

  const handleSizeToggle = (sizeId: number) => {
    setSelectedSizeIds(prev => 
      prev.includes(sizeId) 
        ? prev.filter(id => id !== sizeId)
        : [...prev, sizeId]
    );
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value
    }));
  };

  const onChangeCategory = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>{
    const categoryId = parseInt(e.target.value, 10);
    handleSelectedCategory(categoryId);
  }

  const handleImageAdd = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const newObjectFile = URL.createObjectURL(file);
    setImagePreview(newObjectFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = typeof reader.result === 'string' ? reader.result : '';
      setFormData(prev => ({
        ...prev,
        image: file,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      image: undefined,
    }));
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await apiService.addProductWithSizes(
      formData,  
      selectedCategoryId,
      selectedSizeIds,
      formData.image 
    );
    navigate('/products');
  } catch (error) {
    console.error('Error adding product:', error);
    alert('Error adding product. Please try again. ' + error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <div className="mb-8">
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thêm sản phẩm mới</h1>
        <p className="text-gray-600">Tạo sản phẩm mới cho cửa hàng của bạn</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  id="name"
                  name="productName"
                  required
                  value={formData.productName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tên sản phẩm"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mô tả chi tiết sản phẩm..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Giá (VNĐ) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0"
                    step="1000"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng tồn kho *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="quantity"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={selectedCategoryId}
                    onChange={onChangeCategory}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(category => (
                      <option key={category.categoryId} value={category.categoryId}>{category.categoryName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kích cỡ có sẵn
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => handleSizeToggle(size.id)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                        selectedSizeIds.includes(size.id)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {size.sizeName}
                    </button>
                  ))}
                </div>
                {selectedSizeIds.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Đã chọn: {sizes.filter(s => selectedSizeIds.includes(s.id)).map(s => s.sizeName).join(', ')}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh sản phẩm
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <button
                    type="button"
                    onClick={handleImageAdd}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                  Chọn ảnh từ máy
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    Thêm hình ảnh để giới thiệu sản phẩm
                  </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="relative group">
                        <img
                          src={imagePreview}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          onClick={() => handleImageRemove(0)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                  </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Đang thêm...' : 'Thêm sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;