import React from 'react'
import { useForm } from 'react-hook-form';
import { AiOutlineLogin } from 'react-icons/ai';
import InputField from '../shared/InputField';
import { useSelector } from 'react-redux';
import { FaAddressCard } from 'react-icons/fa';

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

    return (
    <div className="">
            <form onSubmit={handleSubmit(onSaveAddAddressHandle)}
                  className="">
                    <div className="flex justify-center items-center mb-4  font-semibold text-2xl text-slate-800 py-2 px-4">
                        <FaAddressCard className="mr-2 text-2xl"/>
                        Add Address
                    </div>
                <div className="flex flex-col gap-4">
                    <InputField
                        label="Building Name"
                        required
                        id="buidling"
                        type="text"
                        message="*Building Name is required"
                        placeHolder="Enter your Bulding Name"
                        register={register}
                        errors={errors}
                    />

                    <InputField
                        label="City"
                        required
                        id="city"
                        type="text"
                        message="*City is required"
                        placeHolder="Enter your City"
                        register={register}
                        errors={errors}
                    />

                    <InputField
                        label="Ward"
                        required
                        id="ward"
                        type="text"
                        message="*Ward is required"
                        placeHolder="Enter your Ward"
                        register={register}
                        errors={errors}
                    />
                </div>

                <button disabled={btnLoader} 
                        type="submit"
                        className="bg-button-gradient flex gap-2 items-center justify-center font-semibold text-white w-full py-2 hover:text-slate-400 transition-colors duration-100  rounded-sm my-3">
                    {btnLoader ? (<><Spinner/>Loading...</>) : (<>Save</>)}
                    
                </button>
            </form>
        </div>
  )
}
