import React, { useState } from 'react';
import { Building2, MapPin, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { setSelectedAddressIdStore } from '../../store/reducers/LocationReducer';

const AddressCard = ({ address, isSelected, onSelect, onEdit, onDelete }) => {
  return (
    <div
      onClick={onSelect}
      className={`relative p-6 mb-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected
          ? 'bg-green-50 border-green-400'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          {/* Building Name */}
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-800 flex items-center gap-2">
              {address.buildingName}
              {isSelected && (
                <CheckCircle className="w-5 h-5 text-green-600 fill-green-600" />
              )}
            </span>
          </div>
          {/* City, State */}
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 className="w-5 h-5" />
            <span> {address.street}, {address.ward}, {address.city}</span>
          </div>

          {/* Country */}
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>{address.receiverName}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 ml-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(address.id);
            }}
            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
            aria-label="Edit address"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(address.id);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete address"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AddressSelector = ({onNext}) => {
  const listAddress = useSelector((state) => state.location.list);
  console.log('list address card', listAddress.data)
  const [addresses, setAddresses] = useState(listAddress.data);
  const [selectedAddressId, setSelectedAddressId] = useState(0);
  const dispatch = useDispatch();

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
    dispatch(setSelectedAddressIdStore(id));
  };

  const handleEditAddress = (id) => {
    console.log('Edit address:', id);
    // Add your edit logic here
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(addr => addr.addressId !== id));
      if (selectedAddressId === id) {
        setSelectedAddressId(addresses.find(addr => addr.addressId !== id)?.addressId || null);
      }
      console.log('Deleted address:', id);
    }
  };

  return (
  <div className="w-full">
    <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
      Select Address
    </h1>

    <div className="max-h-[500px] overflow-y-auto space-y-4 px-2">
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          isSelected={selectedAddressId === address.addressId}
          onSelect={() => handleSelectAddress(address.addressId)}
          onEdit={handleEditAddress}
          onDelete={handleDeleteAddress}
        />
      ))}
    </div>

    {addresses.length === 0 && (
      <div className="text-center py-12 text-gray-500">
        No addresses found. Add your first address to continue.
      </div>
    )}

    <div className="flex justify-end mt-6">
      <button
        onClick={() => {
          if (selectedAddressId) {
          console.log('Next clicked, selected address:', selectedAddressId);
          onNext();
          } else {
          toast.error('Please select an address first');
        }
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={!selectedAddressId}
      >
        Next
      </button>
    </div>
  </div>
);
};

export default AddressSelector;