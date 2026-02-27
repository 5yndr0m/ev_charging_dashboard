export async function GET() {
  const data = {
    activeStations: 10,
    totalChargers: 228,
    activeCustomers: 1000,
    totalSolarPower: 2310,
    co2Savings: 1247,
    systemUptime: 99.7,
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",    // ✅ Allow access from website (3001)
      "Access-Control-Allow-Methods": "GET", // ✅ Allow GET requests
    },
  });

  
}
