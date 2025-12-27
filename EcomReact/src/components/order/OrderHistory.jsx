import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye, Calendar, Package, DollarSign, X, MapPin, Phone, User, CreditCard, Truck, ShoppingBag, AlertTriangle } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import api from '../../api/api';
import toast from 'react-hot-toast';

// Modal xác nhận hủy đơn
const CancelOrderModal = ({ order, onClose, onConfirm, isLoading }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            Xác nhận hủy đơn
          </h3>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Bạn có chắc chắn muốn hủy đơn hàng <strong>#{order.orderId}</strong>?
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              ⚠️ Lưu ý: Sau khi hủy, đơn hàng sẽ không thể khôi phục lại.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Không, giữ lại
            </button>
            <button
              onClick={() => onConfirm(order.orderId)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang xử lý...
                </>
              ) : (
                'Xác nhận hủy'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal Chi tiết đơn hàng
const OrderDetailModal = ({ order, onClose, formatCurrency, formatDate, getStatusText, getStatusColor }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Chi tiết đơn hàng #{order.orderId}</h3>
            <p className="text-blue-100 text-sm">Mã đơn: {order.orderCode || order.vnpayTxnRef}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          {/* Trạng thái & Thông tin chung */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Ngày đặt:</span>
              </div>
              <p className="font-semibold text-gray-800">{formatDate(order.orderDate)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {order.paymentMethod === 'COD' ? (
                  <Truck className="w-5 h-5 text-orange-500" />
                ) : (
                  <CreditCard className="w-5 h-5 text-blue-500" />
                )}
                <span className="text-gray-600">Thanh toán:</span>
              </div>
              <p className="font-semibold text-gray-800">
                {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'VNPay'}
              </p>
            </div>
          </div>

          {/* Địa chỉ giao hàng */}
          {order.shippingAddress && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Địa chỉ giao hàng
              </h4>
              <div className="space-y-2 text-gray-700">
                <p className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  {order.shippingAddress.receiverName}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {order.shippingAddress.phoneNumberReceiver}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {order.shippingAddress.buildingName}, {order.shippingAddress.street}, {order.shippingAddress.ward}, {order.shippingAddress.city}
                </p>
              </div>
            </div>
          )}

          {/* Danh sách sản phẩm */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-green-600" />
              Sản phẩm đã đặt ({order.items?.length || order.orderItems?.length || 0} sản phẩm)
            </h4>
            <div className="space-y-3">
              {(order.items || order.orderItems || []).map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                  {/* Hình ảnh sản phẩm */}
                  <div className="w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden border">
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.productName}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Thông tin sản phẩm */}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-800 truncate">
                      {item.product?.productName || 'Sản phẩm'}
                    </h5>
                    <p className="text-sm text-gray-500">
                      Số lượng: <span className="font-medium">{item.quantity}</span>
                    </p>
                    {item.discount > 0 && (
                      <p className="text-sm text-green-600">Giảm giá: {item.discount}%</p>
                    )}
                  </div>
                  
                  {/* Giá */}
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {formatCurrency(item.orderedProductPrice * item.quantity)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(item.orderedProductPrice)} / sản phẩm
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tổng cộng */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Trạng thái:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.orderStatus)}`}>
                {getStatusText(order.orderStatus)}
              </span>
            </div>
            <div className="border-t border-gray-200 my-3"></div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">Tổng cộng:</span>
              <span className="text-2xl font-bold text-blue-600">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [cancelOrder, setCancelOrder] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Lấy đơn hàng của người dùng hiện tại
        const data = await api.get("http://localhost:8080/api/order-history/my-orders");
        setOrders(data.data);
      } catch (error) {
        console.error('Error fetching user orders:', error);
        const mockData = await apiService.getOrders();
        setOrders(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  console.log('order user data', orders)
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const orderDate = new Date(order.orderDate);
      const now = new Date();
      const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'today':
          matchesDate = daysDiff === 0;
          break;
        case 'week':
          matchesDate = daysDiff <= 7;
          break;
        case 'month':
          matchesDate = daysDiff <= 30;
          break;
        case 'year':
          matchesDate = daysDiff <= 365;
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesSearch || matchesStatus || matchesDate;
  });

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
      SHIPPING: 'bg-purple-100 text-purple-800 border-purple-200',
      DELIVERED: 'bg-green-100 text-green-800 border-green-200',
      SUCCESS: 'bg-green-100 text-green-800 border-green-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
      FAILED: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status?.toUpperCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      PENDING: 'Chờ xử lý',
      PROCESSING: 'Đang xử lý',
      SHIPPING: 'Đang giao hàng',
      DELIVERED: 'Đã giao hàng',
      SUCCESS: 'Thành công',
      CANCELLED: 'Đã hủy',
      FAILED: 'Thất bại'
    };
    return statusTexts[status?.toUpperCase()] || status;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return dateString;
    }
  };

  // Xem chi tiết đơn hàng
  const handleViewDetail = async (orderId) => {
    setLoadingDetail(true);
    try {
      const response = await api.get(`/order-history/${orderId}`);
      setSelectedOrder(response.data);
    } catch (error) {
      console.error('Error fetching order detail:', error);
      // Nếu API lỗi, thử tìm trong danh sách orders đã load
      const orderFromList = orders.find(o => o.orderId === orderId);
      if (orderFromList) {
        setSelectedOrder(orderFromList);
      }
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeDetailModal = () => {
    setSelectedOrder(null);
  };

  // Hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    setCancelLoading(true);
    try {
      const response = await api.put(`/order-history/${orderId}/cancel`);
      if (response.data.success) {
        toast.success('Hủy đơn hàng thành công!');
        // Cập nhật trạng thái đơn hàng trong danh sách
        setOrders(orders.map(order => 
          order.orderId === orderId 
            ? { ...order, orderStatus: 'CANCELLED' } 
            : order
        ));
        setCancelOrder(null);
      } else {
        toast.error(response.data.message || 'Không thể hủy đơn hàng');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Có lỗi xảy ra khi hủy đơn hàng');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử mua hàng</h1>
        <p className="text-gray-600">Xem lại các đơn hàng bạn đã đặt</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipped">Đã gửi hàng</option>
              <option value="delivered">Đã giao hàng</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm nay</option>
            </select>
          </div>

          {/* Results count */}
          <div className="flex items-center text-sm text-gray-600">
            <Package className="h-4 w-4 mr-2" />
            {filteredOrders.length} đơn hàng
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đơn hàng nào</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
                ? 'Không tìm thấy đơn hàng phù hợp với bộ lọc của bạn.'
                : 'Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.orderId} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Đơn hàng #{order.orderId}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.orderStatus)}`}>
                        {getStatusText(order.orderStatus)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(order.orderDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>{order.totalProducts || order.items?.length || 0} sản phẩm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewDetail(order.orderId)}
                      disabled={loadingDetail}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Xem chi tiết</span>
                    </button>
                    {order.orderStatus === 'DELIVERED' && (
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Đánh giá
                      </button>
                    )}
                    {order.orderStatus === 'PENDING' && (
                      <button 
                        onClick={() => setCancelOrder(order)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Hủy đơn
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Chi tiết đơn hàng */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={closeDetailModal}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          getStatusText={getStatusText}
          getStatusColor={getStatusColor}
        />
      )}

      {/* Modal Xác nhận hủy đơn */}
      {cancelOrder && (
        <CancelOrderModal
          order={cancelOrder}
          onClose={() => setCancelOrder(null)}
          onConfirm={handleCancelOrder}
          isLoading={cancelLoading}
        />
      )}
    </div>
  );
};

export default OrderHistory;
