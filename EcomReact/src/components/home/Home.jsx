import Banner from "./Banner";
import { useEffect, useState } from "react";
import ProductCart from '../shared/ProductCart';
import Loader from "../shared/Loader";
import api from "../../api/api";


const Home = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchRecommendProduct = async () => {
            try {
                const auth = localStorage.getItem('auth');
                if (auth) {
                    const userId = JSON.parse(auth).id;
                    const responseData = await api.get(`/public/recommend/${userId}`);
                    setProducts(responseData.data);
                } else {
                    // Fallback: lấy sản phẩm công khai nếu chưa đăng nhập
                    const responseData = await api.get('/public/products');
                    setProducts(responseData.data.content || []);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchRecommendProduct();
    }, []);

    console.log('products', products)
    return (
        <div className="lg:px-14 sm:px-8 px-4">
            <div className="py-6">
                <Banner/>
            </div>

            <div className="py-5 ">
                <div className="flex flex-col justify-center items-center space-y-2">
                    <h1 className="text-slate-800 text-4xl font-bold">Sản phẩm</h1>
                        <span className="text-slate-700">
                            Khám phá bộ sưu tập sản phẩm được chọn lọc dành riêng cho bạn!
                        </span>
                </div>
            </div>

            <div className="pb-6 pt-14  grid  2xl:grids-cols-4 lg:grid-cols-4 sm:grid-cols-2 gap-x-6 gap-y-6">
                    {products && products.slice(0,10).map((item, index) => {
                        return <ProductCart key={index} 
                        image={item.image} productName={item.productName}
                        productId={item.productId} description={item.description}
                        quantity={item.quantity} price={item.price}
                        discount={item.discount} specialPrice={item.specialPrice}
                        sizes={item.sizes}/>
                    })}
            </div>
        </div>
    )
};

export default Home;