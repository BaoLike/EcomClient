import { Skeleton } from "@mui/material";
import React, { useState } from "react";
import { FaAddressBook } from 'react-icons/fa';
import { AddressInforModal } from "./AddressInforModal";
import { AddAddressForm } from "./AddAddressForm";
import { useSelector, useDispatch } from "react-redux";
import AddressSelector from "./AddressCart";
import { fetchLocationsAddress } from "../../store/reducers/LocationReducer";

const AddressInfor = ({onNext}) => {
    
    const listAddress = useSelector((state) => state.location.list);
    const noAddressExist = listAddress.length === 0;
    console.log('list Address user', listAddress)
    const isLoading = false;
    const [openAddressModal, setOpenAddressModal] = useState(false);
    const [selectedAddress, setAddressSelected] = useState("");
    const dispatch = useDispatch();

    const addNewAddressHandle = () => {
        setAddressSelected("");
        setOpenAddressModal(true)
    };

    // Xử lý khi thêm địa chỉ thành công
    const handleAddAddressSuccess = () => {
        setOpenAddressModal(false); // Đóng modal
        dispatch(fetchLocationsAddress()); // Refresh danh sách địa chỉ từ API
    };

    return (
        <div className="pt-4">
            {noAddressExist ? (
                <div className="p-6 rounded-lg max-w-md mx-auto flex  flex-col items-center justify-center">
                    <FaAddressBook size={50}  className="text-gray-500 mb-4"/>
                    <h1 className="mb-2 text-slate-900 font-semibold text-center text-2xl ">
                        Chưa có địa chỉ nào
                    </h1>

                    <p className="mb-6 text-slate-900 text-center">
                        Vui lòng thêm địa chỉ để hoàn tất đơn hàng
                    </p>

                    <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-all"
                            onClick={addNewAddressHandle}>
                        Thêm địa chỉ giao hàng
                    </button>
                </div>
            ) : (
                <div className="relative p-6 rounded-lg max-w-lg mx-auto">
                    {isLoading ? (
                        <div className="px-4 py-8">
                            <Skeleton/>
                        </div>
                    ) : (
                        <AddressSelector onNext={onNext} />
                    )}
                </div>

                
            )}

            <AddressInforModal setIsOpen={setOpenAddressModal} isOpen={openAddressModal}>
                <AddAddressForm onSuccess={handleAddAddressSuccess} />
            </AddressInforModal>
        </div>
    )
}

export default AddressInfor;