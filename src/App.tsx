import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ScrollManager, TripProvider } from './components/ui'
import HomePage from './pages/HomePage'
import NotFound from './pages/NotFound'
import { DestinationPage, ExplorePage } from './pages/ExplorePages'
import { PackagesPage } from './pages/PackagePages'
import { PackageDetailPage } from './pages/PackageDetail'
import { AiTripPage, PlanTripPage } from './pages/TripPages'
import { CheckoutPage, PassViewPage, VerifyPage } from './pages/PassPages'
import { AdventuresPage, ExperienceHub, FestivalsPage, KnowledgeBankPage } from './pages/ExperiencePages'
import { CircuitPage } from './pages/CircuitPages'
import { HelicopterPage } from './pages/HelicopterPage'
import { ContactPage } from './pages/ContactPage'
import { CartPage } from './pages/CartPage'
import { CartProvider } from './lib/cart'
import BookingStudio from './pages/BookingStudio'
import { TripDetailsProvider } from './lib/tripDetails'
import { AboutPage, EPinddaanPage, InfoPage, TransportPage } from './pages/InfoPages'

export default function App() {
  useTranslation()
  return (
    <TripProvider>
      <TripDetailsProvider>
      <CartProvider>
      <ScrollManager />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/explore/circuits/:id" element={<CircuitPage />} />
          <Route path="/explore/:id" element={<DestinationPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/packages/:id" element={<PackageDetailPage />} />
          <Route path="/packages/:id/book" element={<BookingStudio />} />
          <Route path="/plan-your-trip" element={<PlanTripPage />} />
          <Route path="/ai-trip" element={<AiTripPage />} />
          <Route path="/pass" element={<Navigate to="/packages#my-passes" replace />} />
          <Route path="/pass/checkout" element={<CheckoutPage />} />
          <Route path="/pass/:code" element={<PassViewPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/experience" element={<ExperienceHub />} />
          <Route path="/experience/adventures" element={<AdventuresPage />} />
          <Route path="/experience/festivals" element={<FestivalsPage />} />
          <Route path="/experience/helicopter" element={<HelicopterPage />} />
          <Route path="/experience/knowledge-bank" element={<KnowledgeBankPage />} />
          <Route path="/e-pinddaan" element={<EPinddaanPage />} />
          <Route path="/how-to-reach" element={<TransportPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/info/contact" element={<Navigate to="/contact" replace />} />
          <Route path="/info/:topic" element={<InfoPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      </CartProvider>
      </TripDetailsProvider>
    </TripProvider>
  )
}
