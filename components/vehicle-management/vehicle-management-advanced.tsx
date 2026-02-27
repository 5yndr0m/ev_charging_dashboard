"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit2, Trash2, Battery, Zap, Gauge } from "lucide-react"
import { vehicleCategories, vehicleModels } from "@/lib/pricing-data"

export function VehicleManagementAdvanced() {
  const [activeTab, setActiveTab] = useState("categories")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<string | null>(null)

  // Vehicle category form state
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    batteryCapacity: 60,
    maxChargingPower: 150,
    consumptionRate: 180,
    chargingMultiplier: 1.0,
  })

  // Vehicle model form state
  const [modelForm, setModelForm] = useState({
    make: "",
    model: "",
    category: "CAR",
    batteryCapacity: 60,
    maxACPower: 7,
    maxDCPower: 100,
    realWorldRange: 400,
    consumptionRate: 150,
    chargingCurve: "normal" as const,
  })

  const resetCategoryForm = () => {
    setCategoryForm({
      name: "",
      batteryCapacity: 60,
      maxChargingPower: 150,
      consumptionRate: 180,
      chargingMultiplier: 1.0,
    })
  }

  const resetModelForm = () => {
    setModelForm({
      make: "",
      model: "",
      category: "CAR",
      batteryCapacity: 60,
      maxACPower: 7,
      maxDCPower: 100,
      realWorldRange: 400,
      consumptionRate: 150,
      chargingCurve: "normal",
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      CAR: "bg-blue-500/10 border-blue-500/30 text-blue-400",
      VAN: "bg-purple-500/10 border-purple-500/30 text-purple-400",
      BUS: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
      TUK: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
      BIKE: "bg-green-500/10 border-green-500/30 text-green-400",
      FLEET: "bg-orange-500/10 border-orange-500/30 text-orange-400",
    }
    return colors[category] || colors.CAR
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Vehicle Management</h2>
        <Button
          onClick={() => {
            setShowAddModal(true)
            resetCategoryForm()
            resetModelForm()
          }}
          className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 border border-cyan-500/20">
          <TabsTrigger value="categories">Vehicle Categories</TabsTrigger>
          <TabsTrigger value="models">Vehicle Models</TabsTrigger>
        </TabsList>

        {/* Vehicle Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicleCategories.map((category) => (
              <Card key={category.id} className={`${getCategoryColor(category.id)} border`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{category.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-white/10"
                        onClick={() => setEditingItem(category.id)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-red-500/20">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Battery className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">Battery Capacity</p>
                      <p className="text-sm font-semibold text-white">{category.batteryCapacity} kWh</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">Max Charging Power</p>
                      <p className="text-sm font-semibold text-white">{category.maxChargingPower} kW</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Gauge className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">Consumption Rate</p>
                      <p className="text-sm font-semibold text-white">{category.consumptionRate} Wh/km</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-xs text-gray-400 mb-1">Pricing Multiplier</p>
                    <p className="text-lg font-bold text-cyan-400">x{category.chargingMultiplier.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Vehicle Models Tab */}
        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vehicleModels.map((model) => (
              <Card key={model.id} className="bg-gray-900/50 border-cyan-500/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">
                        {model.make} {model.model}
                      </CardTitle>
                      <p className="text-xs text-gray-400 mt-1">
                        Category: <span className="text-cyan-400">{model.category}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-white/10"
                        onClick={() => setEditingItem(model.id)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-red-500/20">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded p-3">
                      <p className="text-xs text-gray-400 mb-1">Battery Capacity</p>
                      <p className="text-sm font-semibold text-white">{model.batteryCapacity} kWh</p>
                    </div>
                    <div className="bg-gray-800/50 rounded p-3">
                      <p className="text-xs text-gray-400 mb-1">Real World Range</p>
                      <p className="text-sm font-semibold text-white">{model.realWorldRange} km</p>
                    </div>
                    <div className="bg-gray-800/50 rounded p-3">
                      <p className="text-xs text-gray-400 mb-1">AC Charging Power</p>
                      <p className="text-sm font-semibold text-cyan-400">{model.maxACPower} kW</p>
                    </div>
                    <div className="bg-gray-800/50 rounded p-3">
                      <p className="text-xs text-gray-400 mb-1">DC Charging Power</p>
                      <p className="text-sm font-semibold text-cyan-400">{model.maxDCPower} kW</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-cyan-500/20">
                    <p className="text-xs text-gray-400 mb-2">Charging Characteristics</p>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-gray-800/50 rounded p-2">
                        <p className="text-xs text-gray-400">Consumption</p>
                        <p className="text-sm font-semibold text-white">{model.consumptionRate} Wh/km</p>
                      </div>
                      <div className="flex-1 bg-gray-800/50 rounded p-2">
                        <p className="text-xs text-gray-400">Charging Curve</p>
                        <p className="text-sm font-semibold text-green-400 capitalize">{model.chargingCurve}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Model Button */}
          <Card className="bg-gray-900/50 border-cyan-500/20 p-6 flex items-center justify-center min-h-40 cursor-pointer hover:border-cyan-400/50">
            <div className="text-center">
              <Plus className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-cyan-400 font-semibold">Add New Vehicle Model</p>
              <p className="text-xs text-gray-400">Add a new EV model to the system</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md bg-gray-900 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white">
                {activeTab === "categories" ? "Add Vehicle Category" : "Add Vehicle Model"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeTab === "categories" ? (
                <>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Category Name</label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
                      placeholder="e.g., Premium SUV"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Battery Capacity (kWh)</label>
                    <input
                      type="number"
                      value={categoryForm.batteryCapacity}
                      onChange={(e) =>
                        setCategoryForm({ ...categoryForm, batteryCapacity: Number.parseFloat(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Max Charging Power (kW)</label>
                    <input
                      type="number"
                      value={categoryForm.maxChargingPower}
                      onChange={(e) =>
                        setCategoryForm({ ...categoryForm, maxChargingPower: Number.parseFloat(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Consumption Rate (Wh/km)</label>
                    <input
                      type="number"
                      value={categoryForm.consumptionRate}
                      onChange={(e) =>
                        setCategoryForm({ ...categoryForm, consumptionRate: Number.parseFloat(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Pricing Multiplier</label>
                    <input
                      type="number"
                      step="0.1"
                      value={categoryForm.chargingMultiplier}
                      onChange={(e) =>
                        setCategoryForm({ ...categoryForm, chargingMultiplier: Number.parseFloat(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Make</label>
                      <input
                        type="text"
                        value={modelForm.make}
                        onChange={(e) => setModelForm({ ...modelForm, make: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
                        placeholder="e.g., Tesla"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Model</label>
                      <input
                        type="text"
                        value={modelForm.model}
                        onChange={(e) => setModelForm({ ...modelForm, model: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
                        placeholder="e.g., Model 3"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Category</label>
                    <select
                      value={modelForm.category}
                      onChange={(e) => setModelForm({ ...modelForm, category: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
                    >
                      <option>CAR</option>
                      <option>VAN</option>
                      <option>BUS</option>
                      <option>TUK</option>
                      <option>BIKE</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Battery (kWh)</label>
                      <input
                        type="number"
                        value={modelForm.batteryCapacity}
                        className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Range (km)</label>
                      <input
                        type="number"
                        value={modelForm.realWorldRange}
                        className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
                >
                  Cancel
                </Button>
                <Button className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30">
                  Add {activeTab === "categories" ? "Category" : "Model"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
