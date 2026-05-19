import { EmblaCarousel } from '@/components/layouts/EmblaCarousel'
import Header from '@/components/ui/header'
import MainHeader from '@/components/ui/main_header'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-black">
      <Header />
      <div className='relative'>
        <div className='absolute z-10 w-full'>
        <MainHeader />

        </div>
        <EmblaCarousel/>
      </div>


    </div>
  )
}