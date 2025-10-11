import { Skeleton } from "@mui/material";
import React, { useState } from "react";
import { FaAddressBook } from 'react-icons/fa';
import { AddressInforModal } from "./AddressInforModal";
import { AddAddressForm } from "./AddAddressForm";

const AddressInfor = () => {
    const noAddressExist = true;
    const isLoading = false;

    const [openAddressModal, setOpenAddressModal] = useState(false);
    const [selectedAddress, setAddressSelected] = useState("");

    const addNewAddressHandle = () => {
        setAddressSelected("");
        setOpenAddressModal(true)
    };

    return (
        <div className="pt-4">
            {noAddressExist ? (
                <div className="p-6 rounded-lg max-w-md mx-auto flex  flex-col items-center justify-center">
                    <FaAddressBook size={50}  className="text-gray-500 mb-4"/>
                    <h1 className="mb-2 text-slate-900 font-semibold text-center text-2xl ">
                        No Address Added Yet
                    </h1>

                    <p className="mb-6 text-slate-900 text-center">
                        Please add your address to  complete purchase
                    </p>

                    <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-all"
                            onClick={addNewAddressHandle}>
                        Add Address
                    </button>
                </div>
            ) : (
                <div className="relative p-6 rounded-lg max-w-md mx-auto">
                    <h1 className="text-slate-800 text-center font-bold text-2xl ">Select Address</h1>
                    
                    {isLoading ? (
                        <div className="px-4 py-8">
                            <Skeleton/>
                        </div>
                    ) : (
                        <div className="space-y-4 pt-6">

                        </div>
                    )}
                </div>

                
            )}

            <AddressInforModal setIsOpen={setOpenAddressModal} isOpen={openAddressModal}>
                <AddAddressForm/>
            </AddressInforModal>
        </div>
    )
}

export default AddressInfor;