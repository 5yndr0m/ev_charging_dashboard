"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SmartPricingSystemEnhanced } from "./smart-pricing-system-enhanced"
import { BillingFinanceConsolidated } from "./billing-finance-consolidated"

export function PricingBillingMain() {
  const [activeTab, setActiveTab] = useState("pricing")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cyan-400 mb-2">Pricing & Billing Management</h1>
        <p className="text-gray-400">Manage pricing strategies, billing operations, and financial analytics</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 border border-cyan-500/20">
          <TabsTrigger value="pricing" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400">
            Smart Pricing System
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400">
            Billing & Finance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="mt-6">
          <SmartPricingSystemEnhanced />
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <BillingFinanceConsolidated />
        </TabsContent>
      </Tabs>
    </div>
  )
}
