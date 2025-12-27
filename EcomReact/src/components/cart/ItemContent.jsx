import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import SetQuantity from "./SetQuantity";
import { useDispatch } from "react-redux";
import { descreaseCartQuantity, fetchProducts, increaseCartQuantity, deleteProductFromCart } from "../../store/action";
import { formatPrice } from "../utils";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

const ConfirmRemoveDialog = ({ open, onClose, onConfirm, productName, sizeName }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Xác nhận xóa</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bạn có chắc muốn xóa <strong>{productName}</strong>
          {sizeName && <span> (Size: <strong>{sizeName}</strong>)</span>} khỏi giỏ hàng? Thao tác này không thể hoàn tác.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ItemContent = ({
  productId,
  productName,
  image,
  description,
  quantity,
  price,
  discount,
  specialPrice,
  cartId,
  selectedSize,
  handleUpdateCartItem,
}) => {
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const [dialogOpen, setDialogOpen] = useState(false);  // <-- THÊM: State mở/đóng dialog
  const [selectedProductId, setSelectedProductId] = useState(null);  // <-- THÊM: Lưu ID product khi confirm
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);  

  const handleRemoveClick = () => {
    setSelectedProductId(productId);
    setDialogOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (selectedProductId) {
      try {
        const sizeId = selectedSize?.id || null;
        deleteProductFromCart(productId, sizeId); 
        const sizeText = selectedSize ? ` (Size: ${selectedSize.sizeName})` : '';
        toast.success(`${productName}${sizeText} đã xóa khỏi giỏ hàng!`); 
        const listCartItems = handleUpdateCartItem()
        dispatch({type: 'DELETE_CART', payload: listCartItems})
      } catch (error) {
        toast.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng");
        console.error("Delete error:", error);
      }
      setDialogOpen(false);
      setSelectedProductId(null);
    }
  };

  // Xử lý close dialog (không xóa)
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProductId(null);
  };

  const handleQuantityIncrease = (cartItems) => {
    dispatch(
      increaseCartQuantity(cartItems, toast, currentQuantity, setCurrentQuantity)
    );
    handleUpdateCartItem();
  };

  const handleQuantityDecrease = (cartItems) => {
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      setCurrentQuantity(newQuantity);
      const listCartItem = JSON.parse(localStorage.getItem('cartItemList'));
      const sizeId = selectedSize?.id || null;
      listCartItem.map((product) => {
            if(productId === product.productId && 
               (product.selectedSize?.id || null) === sizeId){
                product.quantity--;
            }
      });
      localStorage.setItem('cartItemList', JSON.stringify(listCartItem));
      handleUpdateCartItem();
      dispatch(descreaseCartQuantity(productId, sizeId));
    }
  };

  return (
    <div className="grid md:grid-cols-5 grid-cols-4 md:text-md text-sm gap-4 items-center border-[1px] border-slate-200">
      <div className="md:col-span-2 justify-self-start flex flex-col gap-2">
        <div className="flex md:flex-row flex-col lg:gap-4 sm:gap-3 gap-0 items-start">
          <div className="md:w-36 sm:w-24 w-12">
            <img
              src={image}
              alt={productName}
              className="md:h-36 sm:h-24 h-12 w-full object-cover rounded-md"
            />
          </div>
          <div className="flex-1">
            <h3 className="lg:text-[17px] text-sm font-semibold text-slate-600">
              {productName}
            </h3>
            {selectedSize && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Size: {selectedSize.sizeName}
              </span>
            )}
          </div>
        </div>

        {/* Nút Remove - gắn handleRemoveClick */}
        <div className="flex items-start gap-5 mt-3">
          <button
            onClick={handleRemoveClick}
            className="flex items-center font-semibold space-x-2 px-4 py-1 text-xs border-rose-600 text-rose-600 rounded-md hover:bg-red-50 transition-colors duration-200"
          >
            <FaTrash size={20} className="text-rose-600" />
            Xóa khỏi giỏ
          </button>
        </div>
      </div>

      <div className="justify-self-center lg:text-[17px] text-sm text-slate-600 font-semibold">
        <SetQuantity
          quantity={currentQuantity}
          cartCounter={true}
          handleQuantityDecrease={() => {
            handleQuantityDecrease({
              image,
              productName,
              description,
              specialPrice,
              price,
              productId,
              quantity,
              selectedSize,
            });
          }}
          handleQuantityIncrease={() => {
            handleQuantityIncrease({
              image,
              productName,
              description,
              specialPrice,
              price,
              productId,
              quantity,
              selectedSize,
            });
          }}
        />
      </div>

      <div className="justify-self-center">{formatPrice(specialPrice)}</div>

      <div className="justify-self-center lg:text-[17px] text-sm text-slate-600 font-semibold">
        {formatPrice(currentQuantity * specialPrice)}
      </div>

      {/* Dialog - render ở cuối component */}
      <ConfirmRemoveDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmRemove}
        productName={productName}
        sizeName={selectedSize?.sizeName}
      />
    </div>
  );
};

export default ItemContent;