import React, { useEffect, useRef, useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { apiService } from '../services/apiService';

const UpdateProductForm = ({ product, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: product?.productName || '',
    description: product?.description || '',
    price: product?.price || 0,
    stock: product?.quantity || 0,
    category: product?.category || '',
    images: product?.images || []
  });

  const [categories,setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
      const fecthData = async () => {
        const data = await apiService.getCategory();
        setCategories(data);
      }
      fecthData();
  }, []);

  console.log('categories', categories)


  const [previewImages, setPreviewImages] = useState(product?.images || []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
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
      console
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      image: undefined,
    }));
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Cập Nhật Sản Phẩm</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên Sản Phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên sản phẩm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô Tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Mô tả chi tiết về sản phẩm..."
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Giá ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số Lượng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Danh Mục <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                  required
                >
                    {categories.map((category) => (
                        <option key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                        </option>
                    ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hình Ảnh Sản Phẩm
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                    <Upload className="w-8 h-8 text-blue-500" />
                  </div>
                  <span className="text-blue-600 font-semibold mb-1">
                    Chọn ảnh từ máy
                  </span>
                  <span className="text-sm text-gray-500">
                    Thêm hình ảnh để giới thiệu sản phẩm
                  </span>
                </label>
              </div>

                <div className="mt-4 border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-3">
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
          <div className="mt-8 pt-6 border-t flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
            >
              Cập Nhật Sản Phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductForm;