import { useState } from "react";
import { FaShoppingBag, FaShoppingCart, FaTimes } from "react-icons/fa";
import ProductViewModal from "./ProductViewModal";
import { truncateText } from "../utils/truncateText";
import { formatPrice } from "../utils";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/action";
import toast from "react-hot-toast"

// Size Selection Modal Component
const SizeSelectionModal = ({ open, onClose, sizes, onSelectSize, productName }) => {
    const [selectedSize, setSelectedSize] = useState(null);

    if (!open) return null;

    const handleConfirm = () => {
        if (selectedSize) {
            onSelectSize(selectedSize);
            setSelectedSize(null);
            onClose();
        } else {
            toast.error("Vui lòng chọn size!");
        }
    };

    const handleAddWithoutSize = () => {
        onSelectSize(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Chọn Size</h3>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>
                
                <div className="p-6">
                    <p className="text-gray-600 mb-4 text-center">
                        Chọn size cho <span className="font-semibold text-gray-800">{productName}</span>
                    </p>
                    
                    {sizes && sizes.length > 0 ? (
                        <>
                            <div className="flex flex-wrap gap-3 justify-center mb-6">
                                {sizes.map(size => (
                                    <button
                                        key={size.id}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all duration-200 min-w-[60px] ${
                                            selectedSize?.id === size.id
                                                ? 'bg-blue-600 text-white border-blue-600 scale-105 shadow-lg'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                        }`}
                                    >
                                        {size.sizeName}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={!selectedSize}
                                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                                        selectedSize
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    <FaShoppingCart />
                                    Thêm vào giỏ
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-500 mb-4">Sản phẩm này không có size</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleAddWithoutSize}
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    <FaShoppingCart />
                                    Thêm vào giỏ
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProductCart = ({
      productId,
      productName,
      image,
      description,
      quantity,
      price,
      discount,
      specialPrice,
      sizes: rawSizes,
}) => {
    // Chuyển đổi sizes thành array nếu cần (hỗ trợ cả Set và Array)
    const sizes = rawSizes ? (Array.isArray(rawSizes) ? rawSizes : Object.values(rawSizes)) : [];
    
    const [openProductModalView, setOpenProductViewModal] = useState(false);
    const [openSizeModal, setOpenSizeModal] = useState(false);
    const btnLoader = false;
    const [selectedViewProduct, setSelectedViewProduct] = useState("");
    const isAvailable = quantity && Number(quantity) > 0;
    const dispatch = useDispatch();

    const handleProductView = (product) => {
        setSelectedViewProduct(product);
        setOpenProductViewModal(true);
    };

    const handleAddToCartClick = () => {
        if (sizes && sizes.length > 0) {
            setOpenSizeModal(true);
        } else {
            addToCartHandle(null);
        }
    };

    const addToCartHandle = (selectedSize) => {
        const cartItems = {
            image,
            productName,
            description,
            specialPrice,
            price,
            productId,
            quantity,
            selectedSize,
        };
        dispatch(addToCart(cartItems, 1, toast));
    }

    return (
        <div className="border rounded-lg shadow-xl overflow-hidden transition-shadow duration-300 flex flex-col h-full">
            <div onClick={() => {
                handleProductView({
                    id: productId,
                    productName,
                    image,
                    description,
                    quantity,
                    price,
                    discount,
                    specialPrice,
                    sizes,
                });
            }} 
            className="w-full overflow-hidden aspect-[3/2]">
                <img 
                className="w-full h-full cursor-pointer transition-transform duration-300 transform hover:scale-105 object-cover"
                crossOrigin="anonymous"
                src = {image}
                alt = {productName}>
                </img>
            </div>
            <div className="p-4 flex flex-col flex-1">
                {/* Tên sản phẩm - cố định 2 dòng */}
                <h2 onClick={() => {
                handleProductView({
                    id: productId,
                    productName,
                    image,
                    description,
                    quantity,
                    price,
                    discount,
                    specialPrice,
                    sizes,
                });
            }}
                    className="text-lg font-semibold mb-2 cursor-pointer h-14 line-clamp-2">
                    {productName}
                </h2>
                
                {/* Mô tả - cố định chiều cao */}
                <div className="h-16 overflow-hidden mb-3">
                    <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
                </div>

                {/* Size badges - cố định chiều cao */}
                <div className="h-7 mb-2">
                    {sizes && sizes.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {sizes.map(size => (
                                <span 
                                    key={size.id} 
                                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                                >
                                    {size.sizeName}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Giá và nút - luôn ở dưới cùng */}
                <div className="flex items-center justify-between mt-auto pt-2">
                    {specialPrice ? (
                        <div className="flex flex-col">
                            <span className="text-gray-400 line-through text-sm">
                                {formatPrice(price)}
                            </span>
                            <span className="text-lg font-bold text-slate-700">
                                {formatPrice(specialPrice)}
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <span className="text-sm invisible">-</span>
                            <span className="text-lg font-bold text-slate-700">
                                {formatPrice(price)}
                            </span>
                        </div>
                    )}
                    <button 
                        className={`${isAvailable ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400"} 
                        text-white p-3 rounded-lg transition-colors duration-300 flex items-center justify-center`}
                        onClick={handleAddToCartClick}
                        disabled={!isAvailable || btnLoader}
                        title={isAvailable ? "Thêm vào giỏ" : "Hết hàng"}
                    >
                        <FaShoppingCart size={18} />
                    </button>
                </div>
                
            </div>
            <ProductViewModal
                open={openProductModalView}
                setOpen={setOpenProductViewModal}
                product={selectedViewProduct}
                isAvailable={isAvailable} 
            />
            
            <SizeSelectionModal
                open={openSizeModal}
                onClose={() => setOpenSizeModal(false)}
                sizes={sizes}
                onSelectSize={addToCartHandle}
                productName={productName}
            />
        </div>
    )
}

export default ProductCart;