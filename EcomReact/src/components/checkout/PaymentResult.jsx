import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Truck, CreditCard } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function PaymentResult() {
  const [paymentInfo, setPaymentInfo] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Kiểm tra nếu có state từ navigate (cho COD)
    if (location.state) {
      setPaymentInfo({
        status: location.state.status,
        orderId: location.state.orderId,
        amount: location.state.amount,
        paymentMethod: location.state.paymentMethod,
        message: location.state.message
      });
      return;
    }

    // Lấy query params từ URL (cho VNPay)
    const urlParams = new URLSearchParams(window.location.search);
    
    const info = {
      status: urlParams.get('status'),
      orderId: urlParams.get('orderId'),
      amount: urlParams.get('amount'),
      transactionNo: urlParams.get('transactionNo'),
      bankCode: urlParams.get('bankCode'),
      payDate: urlParams.get('payDate'),
      orderInfo: urlParams.get('orderInfo'),
      responseCode: urlParams.get('responseCode'),
      message: urlParams.get('message'),
      paymentMethod: 'VNPAY'
    };
    
    setPaymentInfo(info);
  }, [location]);

  if (!paymentInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Đang tải...</div>
      </div>
    );
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    // Format: yyyyMMddHHmmss -> DD/MM/YYYY HH:mm:ss
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = dateStr.substring(8, 10);
    const minute = dateStr.substring(10, 12);
    const second = dateStr.substring(12, 14);
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  const isSuccess = paymentInfo.status === 'success';
  const isError = paymentInfo.status === 'error';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {isSuccess && (
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          )}
          {paymentInfo.status === 'failed' && (
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          )}
          {isError && (
            <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-yellow-600" />
            </div>
          )}
          
          <h1 className={`text-3xl font-bold mb-2 ${
            isSuccess ? 'text-green-600' : 'text-red-600'
          }`}>
            {isSuccess 
              ? (paymentInfo.paymentMethod === 'COD' ? 'Đặt hàng thành công!' : 'Thanh toán thành công!')
              : (paymentInfo.paymentMethod === 'COD' ? 'Đặt hàng thất bại' : 'Thanh toán thất bại')
            }
          </h1>
          
          {paymentInfo.message && (
            <p className="text-gray-600">{decodeURIComponent(paymentInfo.message)}</p>
          )}
          
          {isSuccess && paymentInfo.paymentMethod === 'COD' && !paymentInfo.message && (
            <p className="text-gray-600">Đơn hàng của bạn đã được tiếp nhận. Bạn sẽ thanh toán khi nhận hàng.</p>
          )}
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
            Thông tin đơn hàng
          </h2>
          
          <div className="space-y-3">
            {paymentInfo.orderId && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-semibold">{paymentInfo.orderId}</span>
              </div>
            )}
            
            {paymentInfo.amount && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tổng tiền:</span>
                <span className="font-semibold text-lg text-blue-600">
                  {formatAmount(paymentInfo.amount)}
                </span>
              </div>
            )}

            {/* Phương thức thanh toán */}
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Phương thức thanh toán:</span>
              <span className="font-semibold flex items-center gap-2">
                {paymentInfo.paymentMethod === 'COD' ? (
                  <>
                    <Truck className="w-5 h-5 text-orange-500" />
                    <span className="text-orange-600">Thanh toán khi nhận hàng</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 text-blue-500" />
                    <span className="text-blue-600">VNPay</span>
                  </>
                )}
              </span>
            </div>
            
            {paymentInfo.transactionNo && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Mã giao dịch VNPAY:</span>
                <span className="font-mono text-sm">{paymentInfo.transactionNo}</span>
              </div>
            )}
            
            {paymentInfo.bankCode && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Ngân hàng:</span>
                <span className="font-semibold">{paymentInfo.bankCode}</span>
              </div>
            )}
            
            {paymentInfo.payDate && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Thời gian thanh toán:</span>
                <span>{formatDate(paymentInfo.payDate)}</span>
              </div>
            )}
            
            {paymentInfo.orderInfo && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Nội dung:</span>
                <span className="text-right">{decodeURIComponent(paymentInfo.orderInfo)}</span>
              </div>
            )}
            
            {paymentInfo.responseCode && paymentInfo.responseCode !== '00' && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Mã lỗi:</span>
                <span className="text-red-600 font-mono">{paymentInfo.responseCode}</span>
              </div>
            )}
          </div>
        </div>

        {/* COD Notice */}
        {isSuccess && paymentInfo.paymentMethod === 'COD' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Truck className="w-6 h-6 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-800">Thanh toán khi nhận hàng</h3>
                <p className="text-orange-700 text-sm mt-1">
                  Đơn hàng của bạn đang được xử lý. Vui lòng chuẩn bị {formatAmount(paymentInfo.amount)} để thanh toán khi nhận hàng.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Về trang chủ
          </button>
          
          {isSuccess && (
            <button
              onClick={() => window.location.href = '/orders'}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Xem đơn hàng
            </button>
          )}
          
          {!isSuccess && (
            <button
              onClick={() => window.location.href = '/payment'}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Thử lại
            </button>
          )}
        </div>

        {/* Support Info */}
        {!isSuccess && (
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Gặp vấn đề? Liên hệ hỗ trợ:</p>
            <p className="font-semibold text-gray-700">Hotline: 1900-xxxx</p>
          </div>
        )}
      </div>
    </div>
  );
}