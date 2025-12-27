import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLogin } from "react-icons/ai";
import InputField from "../shared/InputField";
import { useDispatch } from "react-redux";
import { registerNewUser } from "../../store/action";
import toast from "react-hot-toast";
import { FaUserPlus } from "react-icons/fa";
import Spinner from "../shared/Spinner";


const Register = () => {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        mode: "onTouched",
    });

    const registerHandle = async (data) => {
        console.log("register clicked", data);
        dispatch(registerNewUser(data, toast, reset, navigate, setLoader));
    }

    return (
        <div className="min-h-[calc(100vh-64px)] flex justify-center items-center py-8">
            <form onSubmit={handleSubmit(registerHandle)}
                  className="sm:w-[450px] w-[360px] shadow-custom py-8 sm:px-8 px-4 rounded-md ">
                    <div className="flex flex-col items-center justify-center space-y-4 ">
                        <FaUserPlus className="text-slate-800 text-5xl"/>
                        <h1 className="text-slate-800 text-center font-montserrat lg:text-3xl text-2xl font-bold">Đăng ký tài khoản</h1>
                    </div>
                <hr className="mt-2 mb-5 text-black"/>
                <div className="flex flex-col gap-3">
                    <InputField
                        label="Tên đăng nhập"
                        required
                        id="username"
                        type="text"
                        message="*Tên đăng nhập là bắt buộc"
                        placeHolder="Nhập tên đăng nhập"
                        register={register}
                        errors={errors}
                    />

                    <InputField
                        label="Email"
                        required
                        id="email"
                        type="email"
                        message="*Email là bắt buộc"
                        placeHolder="Nhập email của bạn"
                        register={register}
                        errors={errors}
                    />

                    <InputField
                        label="Mật khẩu"
                        required
                        id="password"
                        type="password"
                        min={6}
                        message="*Mật khẩu là bắt buộc (tối thiểu 6 ký tự)"
                        placeHolder="Nhập mật khẩu"
                        register={register}
                        errors={errors}
                    />

                    {/* Gender Selection */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-slate-700">
                            Giới tính <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register("sex", { required: "*Vui lòng chọn giới tính" })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                        >
                            <option value="">-- Chọn giới tính --</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                        {errors.sex && (
                            <span className="text-red-500 text-xs">{errors.sex.message}</span>
                        )}
                    </div>

                    {/* Age Input */}
                    <InputField
                        label="Tuổi"
                        required
                        id="age"
                        type="number"
                        message="*Tuổi là bắt buộc"
                        placeHolder="Nhập tuổi của bạn"
                        register={register}
                        errors={errors}
                        min={1}
                        max={150}
                    />
                </div>

                <button disabled={loader} 
                        type="submit"
                        className="bg-button-gradient flex gap-2 items-center justify-center font-semibold text-white w-full py-2 hover:text-slate-400 transition-colors duration-100 rounded-sm my-3">
                    {loader ? (<><Spinner/>Đang xử lý...</>) : (<>Đăng ký</>)}
                </button>

                <p className="text-center text-sm text-slate-700 mt-6">
                    Đã có tài khoản?
                    <Link className="font-semibold underline hover:text-black ml-1" to="/login">
                        <span>Đăng nhập</span>
                    </Link>
                </p>
            </form>
        </div>
    )
};

export default Register;