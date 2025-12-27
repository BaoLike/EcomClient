import { Swiper, SwiperSlide } from 'swiper/react';
import {Navigation, Autoplay, EffectFade, Pagination} from 'swiper/modules';
import bannerList from "../../../src/components/utils/index.js";

// Import Swiper styles
import 'swiper/css';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const colors = ["bg-banner-color1", "bg-banner-color2", "bg-banner-color3"]

const Banner = () => {
  return (
    <div className='py-2 rounded-md overflow-hidden'>
        <Swiper grabCursor = {true} autoplay={{delay: 4000, disableOnInteraction: false,}}
                navigation
                modules={[Pagination, EffectFade, Navigation, Autoplay]}
                pagination={{clickable: true}}
                scrollbar= {{draggable: true}}
                slidesPerView={1}>
                    {bannerList.map((item, i) => (
                        <SwiperSlide key={item.id}>
                            <div className={`carousel-item rounded-xl sm:h-[500px] h-96 ${colors[i]} relative overflow-hidden`}>
                                {/* Background overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
                                
                                {/* Background image */}
                                <div className="absolute inset-0">
                                    <img 
                                        src={item.image} 
                                        alt={item.subtitle}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                
                                {/* Content */}
                                <div className='relative z-20 flex items-center h-full px-8 lg:px-16'>
                                    <div className='max-w-xl'>
                                        <span className='inline-block bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full mb-4'>
                                            {item.title}
                                        </span>
                                        <h1 className='text-4xl lg:text-6xl text-white font-bold mb-4 drop-shadow-lg'>
                                            {item.subtitle}
                                        </h1>
                                        <p className='text-white/90 text-lg mb-6 drop-shadow'>
                                            {item.description}
                                        </p>
                                        <Link 
                                            className='inline-flex items-center gap-2 bg-white text-gray-900 font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105'
                                            to="/products"
                                        >
                                            Mua ngay
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
    </div>
  );
};

export default Banner;