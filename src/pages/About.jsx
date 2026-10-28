import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { 
  Recycle, 
  Leaf, 
  ShieldCheck, 
  Globe, 
  Award, 
  Users, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Cpu
} from "lucide-react";

export default function About() {
  const stats = [
    { label: "CO₂ Emissions Abated", value: "840+ MT", icon: Leaf },
    { label: "Verified Dismantlers", value: "320+", icon: ShieldCheck },
    { label: "Salvaged OEM Components", value: "14,500+", icon: Recycle },
    { label: "Customer Satisfaction", value: "99.4%", icon: Award },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4">
            <Globe className="w-3.5 h-3.5" />
            Pioneering Circular Mobility in India
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight mb-4">
            Building India's Cleanest <span className="text-[#15803D]">Automotive Recycling Grid</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            ScrapX connects vehicle owners, automotive workshops, and certified scrap dismantlers through transparent digital valuation, doorstep collection, and guaranteed circular parts recovery.
          </p>
        </div>

        {/* Stats Ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 text-center hover:border-emerald-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">{s.value}</div>
                <div className="text-xs font-medium text-slate-500">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                <Leaf className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                Our Sustainability Mission
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Informal vehicle dismantling has historically polluted groundwaters with heavy battery acids and released toxic refrigerants into the atmosphere. ScrapX formalizes the secondary automotive sector into compliant, eco-friendly dismantling yards.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  100% compliant with MoRTH End-of-Life Vehicle (ELV) directives
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Safe lead-acid battery neutralisation and chemical fluid containment
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Up to 85% scrap metal re-induction directly into domestic steel mills
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                Intelligent Tech Infrastructure
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                We replace opaque broker negotiations with real-time algorithmic scrap pricing, live GPS proximity radars for mechanics and scrap yards, and encrypted messaging for peer-to-peer parts transactions.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  Real-time metal rate card tied to daily industrial commodity indices
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  Geospatial device radar finding certified suppliers within custom km radii
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  Cloud Firestore & local offline fallback ensuring 100% operational uptime
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Leadership Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-12 mb-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Pioneering Vision</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Leadership & Innovation
            </h2>
          </div>

          <div className="max-w-md mx-auto bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-md">
              NJ
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Nandini Jain</h3>
              <p className="text-xs font-bold text-emerald-700 mb-2">Founder & Product Architect</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Spearheading the transformation of the automotive salvage economy with modern software, real-time geolocation, and sustainable recycling principles.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-emerald-800 rounded-3xl p-8 sm:p-10 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Join the ScrapX Circular Movement</h2>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-lg mx-auto mb-6">
            Whether you want to sell a totaled car, find hard-to-source parts, or list your repair workshop, ScrapX empowers your journey.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/signup"
              className="px-6 py-3 bg-white text-emerald-900 text-xs font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-sm inline-flex items-center gap-2"
            >
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 bg-emerald-700/60 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors border border-emerald-500/30"
            >
              Contact Our Enterprise Team
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
