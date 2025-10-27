import { useState } from 'react';
import { CreditCard, Truck } from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../../api/api';

export default function PaymentMethodComponent({onNext}) {
  const [selectedMethod, setSelectedMethod] = useState('transfer');
  const addressSelectedId = useSelector((state) => state.location.selectedAddressId);
  const listAddress = useSelector((state) => state.location.list);
  const listAddressData = listAddress.data;
  const addressSelected = listAddressData.filter(addr => addr.addressId === addressSelectedId)[0];
  const userInfor = JSON.parse(localStorage.getItem('auth'))
  console.log('selected address id', addressSelectedId)
  console.log('address infor',addressSelected)
  console.log('list address use', listAddressData)
  console.log('email user', userInfor.email)
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


  const handlePatmentWithVNPay = async () =>{
    const getTotalPrice = () => {
        const data = localStorage.getItem('cartItemList') ? JSON.parse(localStorage.getItem('cartItemList')) : []
        let totalPrice = 0;
        data.forEach((item) => totalPrice += item.specialPrice*item.quantity);
        return totalPrice;
    }
    const amount = getTotalPrice();
    const listProductItems = JSON.parse(localStorage.getItem("cartItemList"));
    
    const dataPayment = {
              "amount": amount,
              "orderInfo": "Thanh toan don hang #12345",
              "orderType": "billpayment",
              "bankCode": "NCB",
              "language": "vn",
              "billingMobile": addressSelected.phoneNumberReceiver,
              "billingEmail": userInfor.email,
              "billFullName": addressSelected.receiverName,
              "billAddress": addressSelected.street + ', ' + addressSelected.ward,
              "billCity": addressSelected.city,
              "billCountry": "VN",
              "billState": "1000",
              "invMobile": addressSelected.phoneNumberReceiver,
              "invEmail": userInfor.email,
              "invCustomer": addressSelected.receiverName,
              "invCompany": "",
              "invTaxcode": "",
              "invType": "I",
              "invAddr": "",
              "products": listProductItems, 
    }
    const responseVNPay = await api.post("http://localhost:8080/api/payment/create-payment", 
      dataPayment
    )
    console.log("Response:", responseVNPay.data);
    if (responseVNPay.data.paymentUrl) {
      window.open(responseVNPay.data.paymentUrl, '_blank');
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
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
          onClick={() => {
            if(selectedMethod === 'vnpay'){
              console.log("payment with vnpay")
              handlePatmentWithVNPay();
            }
          }}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
}