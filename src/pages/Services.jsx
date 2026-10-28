import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { 
  Recycle, 
  Truck, 
  Wrench, 
  Calculator, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  TrendingUp 
} from "lucide-react";

export default function Services() {
  const servicesData = [
    {
      id: "parts",
      icon: Sparkles,
      title: "Salvaged OEM Parts Marketplace",
      badge: "Save up to 70%",
      description: "Browse thousands of quality-tested automotive components salvaged from end-of-life and total loss vehicles. Filter by vehicle make, model, condition, and GPS proximity with guaranteed authenticity.",
      link: "/scraps",
      linkText: "Explore Marketplace",
      color: "emerald",
    },
    {
      id: "pickups",
      icon: Truck,
      title: "Doorstep Scrap Vehicle Collection",
      badge: "Zero Towing Charges",
      description: "Schedule free doorstep pickup for end-of-life cars, two-wheelers, and commercial fleets. Enjoy instant digital spot payment and authorized Certificate of Scrapping.",
      link: "/pickups",
      linkText: "Schedule Collection",
      color: "emerald",
    },
    {
      id: "rates",
      icon: Calculator,
      title: "Live Scrap Metal Rates & Valuation",
      badge: "Updated Daily",
      description: "Transparent, real-time scrap metal rate card covering iron, structural steel, aluminum alloy, copper wiring, and dead lead-acid batteries with interactive ecological savings metrics.",
      link: "/rates",
      linkText: "Check Live Rates",
      color: "emerald",
    },
    {
      id: "emergency",
      icon: Clock,
      title: "24/7 Roadside Emergency Rescue",
      badge: "Avg 18-min Dispatch",
      description: "Stranded on highway or city traffic? Broadcast immediate SOS with your precise GPS coordinates. Local mechanics, jump-start vans, and hydraulic tow trucks arrive quickly.",
      link: "/emergency",
      linkText: "Request Roadside SOS",
      color: "red",
    },
    {
      id: "radar",
      icon: Wrench,
      title: "Automotive Network Radar",
      badge: "GPS Proximity",
      description: "Discover certified repair workshops, authorized vehicle scrap dismantlers, and local parts suppliers within your chosen radius on an interactive map.",
      link: "/nearby",
      linkText: "Open GPS Radar",
      color: "emerald",
    },
    {
      id: "analytics",
      icon: TrendingUp,
      title: "Dealer & Workshop Command Hub",
      badge: "Enterprise Grade",
      description: "Complete inventory management, customer offer negotiation, live revenue forecasting, and instant one-click professional PDF audit exports.",
      link: "/dashboard",
      linkText: "Open Dashboard",
      color: "emerald",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4">
            <Recycle className="w-3.5 h-3.5" />
            End-to-End Circular Automotive Solutions
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight mb-4">
            Services Engineered for the <span className="text-[#15803D]">Automotive Lifecycle</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From doorstep scrap vehicle collection and verified OEM parts recovery to 24/7 roadside breakdown assistance, ScrapX digitizes every link of the circular mobility ecosystem.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {servicesData.map((svc) => {
            const Icon = svc.icon;
            const isRed = svc.color === "red";

            return (
              <div
                key={svc.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all p-7 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      isRed 
                        ? "bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white"
                        : "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white"
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      isRed ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}>
                      {svc.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {svc.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {svc.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to={svc.link}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors ${
                      isRed ? "text-red-600 hover:text-red-700" : "text-emerald-700 hover:text-emerald-800"
                    }`}
                  >
                    <span>{svc.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Circular Economy Guarantee Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-900 rounded-3xl p-8 sm:p-12 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-sm border border-white/20 mb-3 text-emerald-200">
              Government Regulatory Compliance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Compliant with RTO & MoRTH Vehicle Scrappage Policy
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed mb-6">
              Every end-of-life vehicle processed via ScrapX receives a legitimate Certificate of Deposit (CoD) and chassis destruction record, granting owners up to 25% road tax rebate on subsequent vehicle registrations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/pickups"
                className="px-6 py-3 bg-white text-emerald-900 text-xs font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-sm inline-flex items-center gap-2"
              >
                Schedule Vehicle Scrappage <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/rates"
                className="px-6 py-3 bg-emerald-700/60 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors border border-emerald-500/30 inline-flex items-center gap-2"
              >
                View Material Rate Card
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
