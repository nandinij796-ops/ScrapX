import Navbar from "../components/Navbar";
import hero from "../assets/hero.png"

function Home() {
  return (
    <>
      <Navbar />
      <section className="hero">
      <h1>🚗 ScrapX</h1>
      <p>Your One-Stop Solution for Vehicle Scrap & Spare Parts</p>

      <button>Get Started</button>
      <img src={hero} alt="ScrapX" className="hero-img" />
    </section>
    <section className="services">
  <h2>Our Services</h2>

  <div className="cards">
    <div className="card">🔧 Nearby Mechanics</div>
    <div className="card">♻️ Spare Parts</div>
    <div className="card">🏪 Scrap Dealers</div>
    <div className="card">🚨 Emergency Help</div>
  </div>
</section>

      
    </>
  );
}

export default Home;