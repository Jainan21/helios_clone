import Header from '@/components/ui/header'
import MainHeader from '@/components/ui/main_header'
import Footer from '@/components/ui/footer'

export default function WorldOfHeliosPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="relative">
        <div className="absolute z-10 w-full">
          <MainHeader />
        </div>

        <main className="mx-auto flex min-h-[70vh] w-[90%] items-center py-36">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">Discover</p>
            <h1 className="mt-5 text-4xl font-semibold uppercase tracking-wide">World of Helios</h1>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
