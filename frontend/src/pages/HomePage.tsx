import { EmblaCarousel } from '@/components/layouts/EmblaCarousel'
import Header from '@/components/ui/header'
import ProductGrid from '@/components/ui/products_grid'
import MainHeader from '@/components/ui/main_header'

const products = [
  {
    "id": 1,
    "name": "Khuvsgul Sunflower Stud Helios Silver",
    "slug": "",
    "price": 395000,
    "status": "NEW_IN",
    "thumbnail": "https://helios.vn/cdn/shop/files/khuyen-tai-bac-khuvsgul-2.jpg?v=1778638082",
    "hoverThumbnail": "https://helios.vn/cdn/shop/files/lentaiKhuvsgul.jpg?v=1778582395"
  },
  {
    "id": 2,
    "name": "Khuvsgul Sunflower Stud Helios Silver",
    "slug": "",
    "price": 395000,
    "status": "NEW_IN",
    "thumbnail": "https://helios.vn/cdn/shop/files/khuyen-tai-bac-khuvsgul-2.jpg?v=1778638082",
    "hoverThumbnail": "https://helios.vn/cdn/shop/files/lentaiKhuvsgul.jpg?v=1778582395"
  },
  {
    "id": 3,
    "name": "Khuvsgul Sunflower Stud Helios Silver",
    "slug": "",
    "price": 395000,
    "status": "NEW_IN",
    "thumbnail": "https://helios.vn/cdn/shop/files/khuyen-tai-bac-khuvsgul-2.jpg?v=1778638082",
    "hoverThumbnail": "https://helios.vn/cdn/shop/files/lentaiKhuvsgul.jpg?v=1778582395"
  },
  {
    "id": 4,
    "name": "Khuvsgul Sunflower Stud Helios Silver",
    "slug": "",
    "price": 395000,
    "status": "NEW_IN",
    "thumbnail": "https://helios.vn/cdn/shop/files/khuyen-tai-bac-khuvsgul-2.jpg?v=1778638082",
    "hoverThumbnail": "https://helios.vn/cdn/shop/files/lentaiKhuvsgul.jpg?v=1778582395"
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-black">
      <Header />
      <div className='relative'>
        <div className='absolute z-10 w-full'>
          <MainHeader />
        </div>
        <EmblaCarousel />
        <ProductGrid products={products}/>
      </div>


    </div>
  )
}