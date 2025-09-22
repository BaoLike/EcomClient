import { useDispatch, useSelector } from "react-redux";
import Banner from "./Banner";
import { useEffect } from "react";
import { fetchProducts } from "../../store/action";
import ProductCart from '../shared/ProductCart';
import Loader from "../shared/Loader";


const Home = () => {
    const dispatch = useDispatch();
    const {products} = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts())
    })
    return (
        <div className="lg:px-14 sm:px-8 px-4">
            <div className="py-6">
                <Banner/>
            </div>

            <div className="py-5 ">
                <div className="flex flex-col justify-center items-center space-y-2">
                    <h1 className="text-slate-800 text-4xl font-bold">Products</h1>
                        <span className="text-slate-700">
                            Discover our handpicked selection  of top-rated items just for you!
                        </span>
                </div>
            </div>

            <div className="pb-6 pt-14  grid  2xl:grids-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-6 gap-y-6">
                    {products && products.slice(0,8).map((item, index) => {
                        return <ProductCart key={index} 
                        image={item.image} productName={item.productName}
                        productId={item.productId} description={item.description}
                        quantity={item.quantity} price={item.price}
                        discount={item.discount} specialPrice={item.specialPrice}/>
                    })}
            </div>
        </div>
    )
};

export default Home;