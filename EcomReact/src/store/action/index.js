import api from "../../api/api"

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

export const addToCart = (data, quantity=1, toast) => (dispatch, getState) => {
    const {products} = getState().products;
    const getProduct = products.find((item) => item.productId === data.productId);
    const isQuantityExist = getProduct.quantity >= quantity;
    console.log("quantity", quantity)
    if(isQuantityExist){
        dispatch({type: "ADD_CART", payload: {...data, quantity: quantity}});
        toast.success(`${data?.productName} added tho the cart`);
        localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
    }
    else{
        toast.error("Out of stock")
    }
};

export const increaseCartQuantity = (data, toast, currentQuantity, setCurrentQuantity) => (dispatch, getState) => {
    console.log("full state", getState())
    const {products} = getState().products;
    const getProduct = products.find((item) => item.productId === data.productId);

    const isQuantityExist = getProduct.quantity >= currentQuantity + 1;

    if(isQuantityExist){
        const newQuantiy = currentQuantity + 1;
        setCurrentQuantity(newQuantiy);
        dispatch({
            type: "ADD_CART",
            payload: {...data, quantity: newQuantiy}
        });
        localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
    }
    else{
        toast.error("Quantity reach to limit")
    }
}

export const descreaseCartQuantity = (data, newQuantiy, ) => (dispatch, getState) =>{
    dispatch({
        type: "ADD_CART",
        payload: {...data, quantity: newQuantiy},
    });
    localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart))
}

export const authenticateSignInUser = (sendData, toast, reset, navigate, setLoader) => async (dispatch) =>{
    try {
        setLoader(true);
        const {data} = await api.post("/auth/signin", sendData)
        dispatch({type: "LOGIN_USER", payload: data});
        localStorage.setItem("auth", JSON.stringify(data));
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

export const logoutUser = (navigate) => (dispatch) => {
    dispatch({type: "LOG_OUT"})
    localStorage.removeItem("auth");
    navigate("/login")
};