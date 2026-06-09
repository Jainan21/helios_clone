import Header from '@/components/ui/header'
import MainHeader from '@/components/ui/main_header'
import Footer from '@/components/ui/footer'
import { useLanguage } from '@/context/LanguageContext'

export default function AboutHeliosPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="relative">
        <div className="absolute z-10 w-full">
          <MainHeader />
        </div>

        <main className="mx-auto grid w-[90%] justify-center gap-10 py-36">
          <div className="text-center">
            <p className="text-3xl font-extrabold uppercase tracking-[0.35em] text-amber-400">{t('aboutHelios')}</p>
          </div>

          <div className="max-w-3xl space-y-6 text-lg leading-7 text-white/70">
            <p className="text-center text-amber-400">{t('aboutHeliosIntro')}</p>
            <p>{t('aboutHeliosStory1')}</p>
            <p>{t('aboutHeliosStory2')}</p>
            <p>{t('aboutHeliosStory3')}</p>
            <p>{t('aboutHeliosStory4')}</p>
            <p>{t('aboutHeliosClosing')}</p>
            <p>{t('bestRegards')}</p>
            <p>Helios</p>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
