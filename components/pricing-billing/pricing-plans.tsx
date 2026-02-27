"use client"

export default function ChargingPricingTable() {
  const pricingData = [
    {
      vehicle: "E-Car",
      directSolar: "LKR 65 / kWh",
      storedSolar: "LKR 85 / kWh",
      grid: "LKR 105 / kWh",
    },
    {
      vehicle: "E-Three-Wheeler",
      directSolar: "LKR 30 / kWh",
      storedSolar: "LKR 55 / kWh",
      grid: "LKR 90 / kWh",
    },
    {
      vehicle: "E-Bike / Scooter",
      directSolar: "LKR 30 / kWh",
      storedSolar: "LKR 50 / kWh",
      grid: "LKR 70/ kWh",
    },
    {
      vehicle: "E-Truck / Van",
      directSolar: "LKR 85 / kWh",
      storedSolar: "LKR 100 / kWh",
      grid: "LKR 140 / kWh",
    },
  ]

  return (
    <section className="py-6 bg-gray-900/50 border border-cyan-500/20 rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-10">
          <span className="gradient-text">Energy Source-Based Pricing</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="py-4 px-6 text-left text-lg font-semibold text-gray-300">Vehicle Type</th>
                <th className="py-4 px-6 text-center text-lg font-semibold text-green-400">Direct Solar</th>
                <th className="py-4 px-6 text-center text-lg font-semibold text-yellow-400">Stored Solar (Battery)</th>
                <th className="py-4 px-6 text-center text-lg font-semibold text-cyan-400">Grid Power</th>
              </tr>
            </thead>
            <tbody>
              {pricingData.map((row, idx) => (
                <tr key={idx} className="border-t border-border/50 hover:bg-secondary/40 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-300">{row.vehicle}</td>
                  <td className="py-4 px-6 text-center text-green-300 font-semibold">{row.directSolar}</td>
                  <td className="py-4 px-6 text-center text-yellow-300 font-semibold">{row.storedSolar}</td>
                  <td className="py-4 px-6 text-center text-cyan-300 font-semibold">{row.grid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6 max-w-3xl mx-auto">
          * Prices are approximate and may vary depending on solar availability, time of day, and regional electricity
          tariffs. Real-time rates are displayed on the charging station dashboard and mobile app.
        </p>
      </div>
    </section>
  )
}
