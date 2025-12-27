import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye, Package, Calendar, DollarSign, User, MapPin, Phone, X, Truck, CreditCard, ShoppingBag, RefreshCw, XCircle, AlertTriangle } from 'lucide-react';
import api from '../api/api';
import toast from 'react-hot-toast';

interface ProductDTO {
  productId: number;
  productName: string;
  image: string;
  price: number;
}

interface OrderItem {
  orderItemId: number;
  product: ProductDTO;
  quantity: number;
  discount: number;
  orderedProductPrice: number;
}

interface ShippingAddress {
  street: string;
  buildingName: string;
  city: string;
  ward: string;
  receiverName: string;
  phoneNumberReceiver: string;
}

interface Order {
  orderId: number;
  orderCode: string;
  orderDate: string;
  orderStatus: string;
  orderStatusLabel: string;
  totalProducts: number;
  totalAmount: number;
  paymentMethod: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  vnpayTxnRef: string;
}

// Modal Chi tiết đơn hàng
const OrderDetailModal: React.FC<{
  order: Order | null;
  onClose: () => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
  getStatusText: (status: string) => string;
  getStatusColor: (status: string) => string;
}> = ({ order, onClose, formatCurrency, formatDate, getStatusText, getStatusColor }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Chi tiết đơn hàng #{order.orderId}</h3>
            <p className="text-blue-100 text-sm">Mã đơn: {order.orderCode || order.vnpayTxnRef}</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
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

          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-green-600" />
              Sản phẩm ({order.items?.length || 0} sản phẩm)
            </h4>
            <div className="space-y-3">
              {(order.items || []).map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                  <div className="w-16 h-16 flex-shrink-0 bg-white rounded-lg overflow-hidden border">
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.productName}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-800 truncate">{item.product?.productName || 'Sản phẩm'}</h5>
                    <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{formatCurrency(item.orderedProductPrice * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Trạng thái:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
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

// Modal xác nhận hủy đơn
const CancelOrderModal: React.FC<{
  order: Order | null;
  onClose: () => void;
  onConfirm: (orderId: number) => void;
  isLoading: boolean;
}> = ({ order, onClose, onConfirm, isLoading }) => {
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
              ⚠️ Lưu ý: Đơn hàng sẽ chuyển sang trạng thái "Đã hủy" và không thể khôi phục.
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

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [cancelOrder, setCancelOrder] = useState<Order | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/order-history/admin/all');
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      await api.put(`/order-history/admin/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(order =>
        order.orderId === orderId ? { ...order, orderStatus: newStatus } : order
      ));
      toast.success('Cập nhật trạng thái thành công!');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Không thể cập nhật trạng thái');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleViewDetail = async (orderId: number) => {
    try {
      const response = await api.get(`/order-history/${orderId}`);
      setSelectedOrder(response.data);
    } catch (error) {
      console.error('Error fetching order detail:', error);
      const orderFromList = orders.find(o => o.orderId === orderId);
      if (orderFromList) {
        setSelectedOrder(orderFromList);
      }
    }
  };

  // Hủy đơn hàng
  const handleCancelOrder = async (orderId: number) => {
    setCancelLoading(true);
    try {
      const response = await api.put(`/order-history/${orderId}/cancel`);
      if (response.data.success) {
        toast.success('Hủy đơn hàng thành công!');
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

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      order.orderId?.toString().includes(searchLower) ||
      order.orderCode?.toLowerCase().includes(searchLower) ||
      order.vnpayTxnRef?.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === 'all' || order.orderStatus?.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPING: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      SUCCESS: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      FAILED: 'bg-red-100 text-red-800'
    };
    return colors[status?.toUpperCase()] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const statusTexts: { [key: string]: string } = {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý đơn hàng</h1>
          <p className="text-gray-600">Xem và cập nhật trạng thái đơn hàng</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Làm mới
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm theo mã đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="PENDING">Chờ xử lý</option>
                  <option value="PROCESSING">Đang xử lý</option>
                  <option value="SHIPPING">Đang giao hàng</option>
                  <option value="DELIVERED">Đã giao hàng</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Package className="w-4 h-4" />
              {filteredOrders.length} / {orders.length} đơn hàng
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thanh toán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{order.orderId}</div>
                    <div className="text-xs text-gray-500">{order.vnpayTxnRef?.slice(-8)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(order.orderDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {order.paymentMethod === 'COD' ? (
                        <>
                          <Truck className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-orange-600">COD</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-blue-600">VNPay</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-semibold text-gray-900">
                      <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    { order.orderStatus === 'CANCELLED'? <div className='bg-red-500 w-[130px] text-white text-xs font-medium px-3 py-1.5 rounded-full border-0'><p>Đã bị hủy</p></div> : 
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusUpdate(order.orderId, e.target.value)}
                      disabled={updatingStatus === order.orderId}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full border-0 focus:ring-2 focus:ring-offset-1 cursor-pointer ${getStatusColor(order.orderStatus)} ${updatingStatus === order.orderId ? 'opacity-50' : ''}`}
                    >
                      <option value="PENDING">Chờ xử lý</option>
                      <option value="PROCESSING">Đang xử lý</option>
                      <option value="SHIPPING">Đang giao hàng</option>
                      <option value="DELIVERED">Đã giao hàng</option>
                      <option value="CANCELLED">Đã hủy</option>
                    </select>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetail(order.orderId)}
                        className="flex items-center gap-1 px-3 py-1.5 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        Chi tiết
                      </button>
                      {order.orderStatus === 'PENDING' && (
                        <button
                          onClick={() => setCancelOrder(order)}
                          className="flex items-center gap-1 px-3 py-1.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <XCircle className="h-4 w-4" />
                          Hủy
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">Không có đơn hàng nào</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm || statusFilter !== 'all' ? 'Thử điều chỉnh bộ lọc của bạn' : 'Đơn hàng sẽ xuất hiện khi khách hàng đặt mua'}
            </p>
          </div>
        )}
      </div>

      {/* Modal Chi tiết */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
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

export default OrderManagement;
