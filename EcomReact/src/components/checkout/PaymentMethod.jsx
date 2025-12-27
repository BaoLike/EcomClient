import { useState } from 'react';
import { CreditCard, Truck, CheckCircle, Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import toast from 'react-hot-toast';

export default function PaymentMethodComponent({onNext}) {
  const [selectedMethod, setSelectedMethod] = useState('vnpay');
  const [isLoading, setIsLoading] = useState(false);
  const addressSelectedId = useSelector((state) => state.location.selectedAddressId);
  const listAddress = useSelector((state) => state.location.list);
  const listAddressData = listAddress.data;
  const addressSelected = listAddressData?.filter(addr => addr.addressId === addressSelectedId)[0];
  const userInfor = JSON.parse(localStorage.getItem('auth'))
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  console.log('selected address id', addressSelectedId)
  console.log('address infor',addressSelected)
  console.log('list address use', listAddressData)
  console.log('email user', userInfor?.email)
  const paymentMethods = [
    {
      id: 'vnpay',
      name: 'Thanh toán qua VNPay',
      description: 'Thanh toán trực tuyến qua cổng VNPay',
      icon: CreditCard
    },
    {
      id: 'cod',
      name: 'Thanh toán khi nhận hàng (COD)',
      description: 'Thanh toán bằng tiền mặt khi nhận hàng',
      icon: Truck
    }
  ];


  const getTotalPrice = () => {
    const data = localStorage.getItem('cartItemList') ? JSON.parse(localStorage.getItem('cartItemList')) : []
    let totalPrice = 0;
    data.forEach((item) => totalPrice += (item.specialPrice || item.price) * item.quantity);
    return totalPrice;
  }

  const getPaymentData = () => {
    const amount = getTotalPrice();
    const listProductItems = JSON.parse(localStorage.getItem("cartItemList")) || [];
    
    return {
      "amount": amount,
      "orderInfo": "Thanh toan don hang",
      "orderType": "billpayment",
      "bankCode": "",
      "language": "vn",
      "billingMobile": addressSelected?.phoneNumberReceiver || "",
      "billingEmail": userInfor?.email || "",
      "billingFullname": addressSelected?.receiverName || "",
      "billAddress": addressSelected ? `${addressSelected.street}, ${addressSelected.ward}` : "",
      "billCity": addressSelected?.city || "",
      "billCountry": "VN",
      "billState": "",
      "invMobile": addressSelected?.phoneNumberReceiver || "",
      "invEmail": userInfor?.email || "",
      "invCustomer": addressSelected?.receiverName || "",
      "invCompany": "",
      "invTaxcode": "",
      "invType": "I",
      "products": listProductItems, 
    };
  }

  const handlePaymentWithVNPay = async () => {
    setIsLoading(true);
    try {
      const dataPayment = getPaymentData();
      const responseVNPay = await api.post("/payment/create-payment", dataPayment);
      
      console.log("Response:", responseVNPay.data);
      if (responseVNPay.data.paymentUrl) {
        // Xóa giỏ hàng sau khi tạo đơn thành công
        localStorage.removeItem('cartItemList');
        window.location.href = responseVNPay.data.paymentUrl;
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Có lỗi xảy ra khi tạo thanh toán VNPay");
    } finally {
      setIsLoading(false);
    }
  }

  const handlePaymentWithCOD = async () => {
    setIsLoading(true);
    try {
      const dataPayment = getPaymentData();
      const response = await api.post(`/payment/create-cod-order?addressId=${addressSelectedId}`, dataPayment);
      
      console.log("COD Response:", response.data);
      
      if (response.data.code === "00") {
        // Xóa giỏ hàng sau khi đặt hàng thành công
        localStorage.removeItem('cartItemList');
        
        toast.success("Đặt hàng thành công!");
        
        // Chuyển đến trang thông báo thành công
        navigate('/payment', {
          state: {
            status: 'success',
            orderId: response.data.orderCode,
            amount: response.data.totalAmount,
            paymentMethod: 'COD',
            message: response.data.message
          }
        });
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Có lỗi xảy ra khi đặt hàng COD");
    } finally {
      setIsLoading(false);
    }
  }

  const handlePayment = () => {
    if (selectedMethod === 'vnpay') {
      handlePaymentWithVNPay();
    } else if (selectedMethod === 'cod') {
      handlePaymentWithCOD();
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Chọn phương thức thanh toán</h2>
      
      <div className="space-y-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          
          return (
            <div
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center h-5 mt-1">
                <input
                  type="radio"
                  name="payment-method"
                  checked={isSelected}
                  onChange={() => setSelectedMethod(method.id)}
                  className="w-4 h-4 text-blue-600 cursor-pointer"
                />
              </div>
              
              <div className="ml-4 flex-1 flex items-start">
                <div className={`p-3 rounded-lg mr-4 ${
                  isSelected ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isSelected ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${
                    isSelected ? 'text-blue-700' : 'text-gray-800'
                  }`}>
                    {method.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {method.description}
                  </p>
                  
                  {method.id === 'cod' && isSelected && (
                    <div className="mt-4 p-4 bg-white border border-blue-200 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng từ nhân viên giao hàng.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handlePayment}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              {selectedMethod === 'cod' ? 'Đặt hàng' : 'Thanh toán'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}