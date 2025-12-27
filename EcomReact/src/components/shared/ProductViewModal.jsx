import { Button, Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import { Divider } from '@mui/material'
import { useState } from 'react'
import { MdClose, MdDone, MdShoppingCart } from 'react-icons/md'
import Status from './Status'
import { formatPrice } from '../utils'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/action'
import toast from 'react-hot-toast'

function ProductViewModal({open, setOpen, product, isAvailable}) {
    const [selectedSize, setSelectedSize] = useState(null)
    const dispatch = useDispatch()
    
    // Safe destructuring với giá trị mặc định
    const {id, productName, image, description, quantity, price, discount, specialPrice, sizes: rawSizes} = product || {}
    
    // Chuyển đổi sizes thành array nếu cần (hỗ trợ cả Set và Array)
    const sizes = rawSizes ? (Array.isArray(rawSizes) ? rawSizes : Object.values(rawSizes)) : [];

    const handleAddToCart = () => {
        if (sizes && sizes.length > 0 && !selectedSize) {
            toast.error("Vui lòng chọn size!");
            return;
        }
        
        const cartItems = {
            image,
            productName,
            description,
            specialPrice,
            price,
            productId: id,
            quantity,
            selectedSize,
        };
        dispatch(addToCart(cartItems, 1, toast));
        setOpen(false);
        setSelectedSize(null);
    }

    const handleClose = () => {
        setOpen(false);
        setSelectedSize(null);
    }

    return (
        <>
        <Dialog open={open} as="div" className="relative z-10" onClose={close}>
            <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                    transition
                    className="relative  transform overflow-hidden rounded-lg bg-white shadow-xl transition-all md:max-w-[620px] md:min-w-[620px] w-full"
                    >
                        {image && (
                            <div className = "flex justify-center aspect-[3/2]">
                                <img 
                                    className="w-full h-full cursor-pointer transition-transform duration-300 transform hover:scale-105"
                                    src = {image}
                                    alt = {productName}>
                                </img>
                            </div>
                        )}

                        <div className="px-6 pt-10 pb-2">
                            <DialogTitle as="h1" className="lg:text-3xl  sm:text-2xl text-xl font-semibold leading-6 text-gray-800 mb-4">
                                {productName}
                            </DialogTitle>
                            <div className='space-y-2 text-gray-700 pb-4'>
                                <div className='flex items-center justify-between gap-2 '>
                                    {specialPrice ? (
                                        <div className='flex items-center gap-2'>
                                            <span className='text-gray-400 line-through'>
                                                {formatPrice(price)}
                                            </span>
                                            <span className='sm:text-xl font-semibold text-slate-700'>
                                                {formatPrice(specialPrice)}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className='text-xl font-bold'>
                                            {formatPrice(price)}
                                        </span>
                                    )}

                                    {isAvailable ? (
                                        <Status
                                                text='Còn hàng'
                                                icon={MdDone}
                                                bg='bg-teal-200'
                                                color='text-teal-900'/>
                                    ) : (
                                        <Status text='Hết hàng'
                                                icon={MdClose}
                                                bg='bg-rose-200'
                                                color='text-rose-700'/>
                                    )}                                    
                                </div>
                                <Divider/>
                                <p>{description}</p>
                            </div>
                        </div>

                        {/* Size Selection */}
                        {sizes && sizes.length > 0 && (
                            <div className='px-6 pb-4'>
                                <Divider />
                                <p className='text-sm font-semibold text-gray-700 mt-4 mb-2'>Chọn Size:</p>
                                <div className='flex flex-wrap gap-2'>
                                    {sizes.map(size => (
                                        <button
                                            key={size.id}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                                                selectedSize?.id === size.id
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                                            }`}
                                        >
                                            {size.sizeName}
                                        </button>
                                    ))}
                                </div>
                                {selectedSize && (
                                    <p className='text-sm text-blue-600 mt-2'>
                                        Đã chọn: {selectedSize.sizeName}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className='px-6 py-4 flex justify-end gap-4'>
                            <button onClick={handleClose} type="button" className='px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-700 hover:text-slate-800 hover:border-slate-800 rounded-md'>
                                Đóng
                            </button>
                            {isAvailable && (
                                <button 
                                    onClick={handleAddToCart} 
                                    type="button" 
                                    className='px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-md flex items-center gap-2 transition-colors'
                                >
                                    <MdShoppingCart size={18} />
                                    Thêm vào giỏ
                                </button>
                            )}
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
        </>
    )
}
export default ProductViewModal;