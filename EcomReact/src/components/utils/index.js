// Format giá tiền theo kiểu Việt Nam
export const formatPrice = (price) => {
    if (price === null || price === undefined) return '0₫';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);
};

// Format giá không có ký hiệu tiền tệ
export const formatNumber = (number) => {
    if (number === null || number === undefined) return '0';
    return new Intl.NumberFormat('vi-VN').format(number);
};

const bannerList = [
    {
    id: 1,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    title: "Bộ Sưu Tập Mới",
    subtitle: "Thời Trang Nữ",
    description: "Khám phá xu hướng thời trang mới nhất - Giảm đến 30%",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&q=80",
    title: "Phong Cách Năng Động",
    subtitle: "Thời Trang Nam",
    description: "Áo thun, quần jeans - Phong cách trẻ trung hiện đại",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
    title: "Hot Trend 2024",
    subtitle: "Streetwear",
    description: "Hoodie, Sneakers - Thời trang đường phố sành điệu",
  }
]

export default bannerList;