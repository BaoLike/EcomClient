import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { AiOutlineLogin } from 'react-icons/ai';
import InputField from '../shared/InputField';
import { useSelector } from 'react-redux';
import { FaAddressCard } from 'react-icons/fa';
import { MenuItem, Select, InputLabel } from '@mui/material';
import api from '../../api/api';

export const AddAddressForm = () => {

    const {btnLoader} = useSelector((state) => state.errors)

    const {
            register,
            handleSubmit,
            reset,
            formState: {errors}
        } = useForm({
            mode: "onTouched",
        });
    
        const onSaveAddAddressHandle = async (data) => {
            console.log("login clicked");
    }
    
    const listLocation = useSelector((state) => state.location.list);


    const [selectedLocation, setSelectedLocation] = useState(0);

    const handleChange = (event) => {
    setSelectedLocation(event.target.value);
    console.log("Người dùng đã chọn:", event.target.value);
    };

    console.log("list location",)

    return (
    <div className="max-w-4xl mx-auto px-6">
        <form onSubmit={handleSubmit(onSaveAddAddressHandle)} className="">
          <div className="flex justify-center items-center mb-4 font-semibold text-2xl text-slate-800 py-2 px-4">
            <FaAddressCard className="mr-2 text-2xl"/>
            Thêm thông tin nhận hàng
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 gap-y-7">
            <div className="flex flex-col gap-6 mb-4">
              <InputField
                
                label="Tên người nhận"
                required
                id="name"
                type="text"
                message="*Tên người nhận là bắt buộc"
                placeHolder="Nhập tên người nhận"
                register={register}
                errors={errors}
              />

              <InputField
                label="Số điện thoại"
                required
                id="phoneNumber"
                type="text"
                message="*Số điện thoại là bắt buộc"
                placeHolder="Nhập số điện thoại"
                register={register}
                errors={errors}
              />

              <div>
                <InputLabel id="city-select-label">Tỉnh/Thành</InputLabel>
                <Select 
                  labelId="city-select-label"
                  label="City"
                  value={selectedLocation}
                  onChange={handleChange}
                  className="min-w-full text-slate-800 border-slate-700"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        width: 'auto',
                      },
                    },
                  }}
                >
                  {listLocation.map((item) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.full_name}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
              
            <div className="flex flex-col gap-6">
              <InputField
                label="Tên tòa nhà/Số nhà"
                required
                id="buidling"
                type="text"
                message="*Tên tòa nhà là bắt buộc"
                placeHolder="Nhập tên tòa nhà/số nhà"
                register={register}
                errors={errors}
              />

              <InputField
                label="Tên đường"
                required
                id="street"
                type="text"
                message="*Tên đường là bắt buộc"
                placeHolder="Nhập tên đường"
                register={register}
                errors={errors}
              />

              <div>
                <InputLabel id="ward-select-label">Phường/Xã</InputLabel>
                <Select 
                  labelId="ward-select-label"
                  label="Wards"
                  className="min-w-full text-slate-800 border-slate-700"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        width: 'auto',
                      },
                    },
                  }}
                >
                  {selectedLocation !== 0 && listLocation[selectedLocation-11].wards.map((item) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>
              
          <button 
            disabled={btnLoader}
            type="submit"
            className="bg-button-gradient flex gap-2 items-center justify-center font-semibold text-white w-full py-2 hover:text-slate-400 transition-colors duration-100 rounded-sm mt-6"
          >
            {btnLoader ? (
              <>
                <Spinner/>
                Loading...
              </>
            ) : (
              <>Save</>
            )}
          </button>
        </form>
</div>
  )
}
