import { useDispatch } from "react-redux";
import api from "../../api/api";

export const fetchProducts = (queryString) => async (dispatch) => {
    try{
        dispatch({type: "IS_FETCHING"})
        const {data} = await api.get(`/public/products?${queryString}`)
        console.log("DATA FROM BACKEND:", data);
        dispatch({
            type: "FETCH_PRODUCTS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage
        })
        dispatch({type: "IS_SUCCESS"})
    }catch(error){
        console.log(error);
        dispatch({
            type:"IS_ERROR",
            payload: error?.response?.data?.message || 'failed to fetch products data',
        })
    }
}

export const fetchCategories = (queryString) => async (dispatch) => {
    try{
        dispatch({type: "CATEGORY_LOADER"})
        const {data} = await api.get(`/public/categories`)
        dispatch({
            type: "FETCH_CATEGORIES",
            payload: data.content, 
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage
        })
        dispatch({type: "CATEGORY_SUCCESS"})
    }catch(error){
        console.log(error);
        dispatch({
            type:"IS_ERROR",
            payload: error?.response?.data?.message || 'failed to fetch categories data',
        })
    }
}

export const addToCart = (data, quantity=1, toast) => async (dispatch, getState) => {
    const {products} = getState().products;
    // Tìm trong Redux store, nếu không có thì dùng data được truyền vào
    const getProduct = products.find((item) => item.productId === data.productId) || data;
    const listCartItem = localStorage.getItem('cartItemList') ? JSON.parse(localStorage.getItem('cartItemList')) : [];
    
    // Check if same product with same size already exists in cart
    const selectedSizeId = data.selectedSize?.id || null;
    const existingItem = listCartItem.find((product) => 
        product.productId === data.productId && 
        (product.selectedSize?.id || null) === selectedSizeId
    );
    
    if(existingItem){
        const sizeText = data.selectedSize ? ` (Size: ${data.selectedSize.sizeName})` : '';
        toast.error(`Sản phẩm này${sizeText} đã có trong giỏ hàng!`);
        return;
    }
    
    // Kiểm tra số lượng tồn kho
    const stockQuantity = getProduct.quantity || data.quantity;
    const isQuantityExist = stockQuantity >= quantity;
    
    if(isQuantityExist){
        try{
            const sizeText = data.selectedSize ? ` (Size: ${data.selectedSize.sizeName})` : '';
            toast.success(`${data?.productName}${sizeText} đã thêm vào giỏ hàng`);
            const productToAdd = { 
                ...getProduct, 
                quantity,
                selectedSize: data.selectedSize || null 
            };
            const updatedCart = [...listCartItem, productToAdd];
            localStorage.setItem('cartItemList', JSON.stringify(updatedCart));
            dispatch({type: 'ADD_CART', payload: updatedCart});
            
            // Build API URL with optional sizeId query parameter
            let apiUrl = `/cart/products/${data.productId}/quantity/${quantity}`;
            if (data.selectedSize?.id) {
                apiUrl += `?sizeId=${data.selectedSize.id}`;
            }
            const reponse = await api.post(apiUrl);
        }catch(e){
            toast.error("Lỗi khi thêm vào giỏ hàng", e);
        }
    }
    else{
        toast.error("Hết hàng")
    }
};

export const increaseCartQuantity = (data, toast, currentQuantity, setCurrentQuantity) => async (dispatch, getState) => {
    const {products} = getState().products;
    // Tìm trong Redux store, nếu không có thì dùng data được truyền vào
    const getProduct = products.find((item) => item.productId === data.productId) || data;
    const listCartItem = JSON.parse(localStorage.getItem('cartItemList'));
    
    // Lấy số lượng tồn kho từ product hoặc từ data
    const stockQuantity = getProduct.quantity || data.quantity;
    const isQuantityExist = stockQuantity >= currentQuantity + 1;

    if(isQuantityExist){
        const newQuantiy = currentQuantity + 1;
        setCurrentQuantity(newQuantiy);
        const selectedSizeId = data.selectedSize?.id || null;
        listCartItem.map((product) => {
            if(data.productId === product.productId && 
               (product.selectedSize?.id || null) === selectedSizeId){
                product.quantity = newQuantiy;
            }
        });
        localStorage.setItem('cartItemList', JSON.stringify(listCartItem));
        
        // Build API URL with optional sizeId query parameter
        let apiUrl = `/card/products/${data.productId}/quantity/add`;
        if (data.selectedSize?.id) {
            apiUrl += `?sizeId=${data.selectedSize.id}`;
        }
        const response = await api.post(apiUrl);
    }
    else{
        toast.error("Quantity reach to limit")
    }
}

export const descreaseCartQuantity = async (productId, sizeId = null) =>{
    let apiUrl = `/card/products/${productId}/quantity/delete`;
    if (sizeId) {
        apiUrl += `?sizeId=${sizeId}`;
    }
    const response = await api.post(apiUrl);
}

export const authenticateSignInUser = (sendData, toast, reset, navigate, setLoader) => async (dispatch) =>{
    try {
        setLoader(true);
        const {data} = await api.post("/auth/signin", sendData)
        dispatch({type: "LOGIN_USER", payload: data});
        localStorage.setItem("auth", JSON.stringify(data));
        fetchCart();
        reset()
        toast.success("Login success");
        navigate("/")
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Internal server error")
    } finally {
        setLoader(false)
    }
}

export const registerNewUser = (sendData, toast, reset, navigate, setLoader) => async (dispatch) =>{
    try {
        setLoader(true);
        const {data} = await api.post("/auth/signup", sendData)
        reset()
        toast.success(data?.message || "Register Successfully");
        navigate("/login")
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Internal server error")
    } finally {
        setLoader(false)
    }
}

export const fetchCart = async () => {
    try{
        console.log('fetch cart success');
        const response = await api.get('/card/user');
        localStorage.setItem('cartId', response.data.cartId);
        localStorage.setItem('cartItemList', JSON.stringify(response.data.products))
        return await response.data;
    }catch(error){
        console.log(error);
    }
    
}

export const deleteProductFromCart = async (productId, sizeId = null) => {
    const cartId = localStorage.getItem('cartId');
    try{
        const listCartItem = JSON.parse(localStorage.getItem('cartItemList'));
        const newListCartItem = listCartItem.filter(product => 
            !(product.productId === productId && 
              (product.selectedSize?.id || null) === sizeId)
        );
        localStorage.setItem('cartItemList', JSON.stringify(newListCartItem));
        
        let apiUrl = `/carts/${cartId}/product/${productId}`;
        if (sizeId) {
            apiUrl += `?sizeId=${sizeId}`;
        }
        const response = await api.delete(apiUrl);
    }catch(error){
        console.log("error from delete product", error)
    }
}

export const logoutUser = (navigate) => (dispatch) => {
    dispatch({type: "LOG_OUT"})
    localStorage.clear()
    navigate("/login")
};