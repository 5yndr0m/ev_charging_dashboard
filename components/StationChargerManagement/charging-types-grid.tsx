import { Zap, Gauge, Bolt, Plug } from "lucide-react"

const chargingTypes = [
  {
    id: 1,
    name: "FC-SP (Fast Charger – Single Port)",
    icon: Bolt,
    power: "30–75 kW",
    time: "30–60 min",
    description:
      "High-power DC charger designed for quick single-vehicle charging in urban or highway environments. Ideal for rapid top-ups and fleet operations.",
    features: [
      "DC fast charging for one vehicle at a time",
      "High efficiency and stable output",
      "Suitable for highways and public hubs",
      "Remote monitoring via IoT dashboard",
      "Supports multiple EV standards",
    ],
    color: "from-orange-500 to-red-500",
  },
  {
    id: 2,
    name: "FC-DP (Fast Charger – Dual Port)",
    icon: Zap,
    power: "60 kW (3-Phase 60A)",
    time: "45–60 min",
    description:
      "Dual-port DC charger that enables two EVs to charge simultaneously. Perfect for service stations, malls, and high-demand charging hubs.",
    features: [
      "Dual DC output for simultaneous charging",
      "Dynamic load management",
      "Advanced safety and thermal control",
      "Supports CCS2 and CHAdeMO standards",
      "Ideal for public and fleet charging centers",
    ],
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 3,
    name: "L2-HC (Level 2 – Home/Commercial)",
    icon: Gauge,
    power: "6.6–22 kW",
    time: "3–6 hours",
    description:
      "AC charger suited for homes, offices, and commercial spaces. Offers reliable overnight or workplace charging with IoT connectivity.",
    features: [
      "AC charging for single or dual use",
      "Compact and easy to install",
      "Supports RFID and app-based control",
      "Energy-efficient and safe for daily use",
      "Ideal for residential and semi-public areas",
    ],
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 4,
    name: "L2-3P (Level 2 – 3 Phase)",
    icon: Plug,
    power: "Up to 22 kW",
    time: "2–4 hours",
    description:
      "Smart commercial-grade three-phase AC charger with load balancing and mobile app control. Designed for reliable multi-vehicle operations.",
    features: [
      "Three-phase AC fast charging",
      "Smart energy distribution system",
      "App-controlled scheduling and monitoring",
      "Ideal for business and fleet operations",
      "Seamless integration with network dashboard",
    ],
    color: "from-purple-500 to-pink-500",
  },
]

export default function ChargingTypesGrid() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {chargingTypes.map((type) => {
          const Icon = type.icon
          return (
            <div
              key={type.id}
              className="group relative bg-gray-900/50 border-2 border-gray-800 rounded-xl p-8 hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300`}
              />
              <div className="relative z-10 space-y-6">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${type.color} rounded-lg flex items-center justify-center shadow-lg shadow-${type.color.split(" ")[1]}/50`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                    {type.name}
                  </h3>
                  <p className="text-gray-300">{type.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400 font-medium">Power Output:</span>
                    <span className="font-semibold text-lg text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]">
                      {type.power}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-400 font-medium">Charging Time:</span>
                    <span className="font-semibold text-lg text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">
                      {type.time}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-pink-400">Key Features:</h4>
                  <ul className="space-y-1">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
