import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Ticker from '@/components/Ticker'
import Services from '@/components/Services'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Kit from '@/components/Kit'
import AppSection from '@/components/AppSection'
import Booking from '@/components/Booking'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Ticker />
      <Services />
      <About />
      <Experience />
      <Kit />
      <AppSection />
      <Booking />
      <Footer />
    </main>
  )
}
