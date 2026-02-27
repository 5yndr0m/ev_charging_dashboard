"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { Edit2, Trash2, TrendingUp, Zap, Percent, Layers } from "lucide-react";


import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

interface RuleType {
  id: string;
  name: string;
  value1: number;
  value2: number;
  value3: number;
  enabled: boolean;
}

export default function LoadShavingAndShifting() {
  const [activeTab, setActiveTab] = useState("shaving");
  const [editRule, setEditRule] = useState<RuleType | null>(null);

  const [shavingRules, setShavingRules] = useState<RuleType[]>([
    { id: "SH001", name: "Morning Peak Control", value1: 40, value2: 60, value3: 25, enabled: true },
    { id: "SH002", name: "Midday Demand Limit", value1: 20, value2: 45, value3: 15, enabled: false },
  ]);

  const [shiftingRules, setShiftingRules] = useState<RuleType[]>([
    { id: "LS001", name: "Off-Peak Move", value1: 30, value2: 120, value3: 20, enabled: true },
    { id: "LS002", name: "Night Priority", value1: 50, value2: 480, value3: 35, enabled: true },
  ]);

  const loadData = [
    { time: "1 AM", load: 60 },
    { time: "4 AM", load: 55 },
    { time: "7 AM", load: 120 },
    { time: "10 AM", load: 180 },
    { time: "1 PM", load: 150 },
    { time: "4 PM", load: 200 },
    { time: "7 PM", load: 170 },
    { time: "10 PM", load: 90 },
  ];

  const saveRule = () => {
    if (!editRule) return;

    if (activeTab === "shaving") {
      setShavingRules(prev => prev.map(r => r.id === editRule.id ? editRule : r));
    } else {
      setShiftingRules(prev => prev.map(r => r.id === editRule.id ? editRule : r));
    }
    setEditRule(null);
  };

  const deleteRule = (id: string) => {
    if (activeTab === "shaving") {
      setShavingRules(prev => prev.filter(r => r.id !== id));
    } else {
      setShiftingRules(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl text-white font-bold">Load Shaving & Load Shifting</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-800 border border-cyan-500/20">
          <TabsTrigger value="shaving" className="data-[state=active]:bg-cyan-500/20 text-white">Load Shaving</TabsTrigger>
          <TabsTrigger value="shifting" className="data-[state=active]:bg-cyan-500/20 text-white">Load Shifting</TabsTrigger>
        </TabsList>

        {/* ✅ LOAD SHAVING TAB */}
        <TabsContent value="shaving">
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-gray-900/60 border-cyan-500/20">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" /> Peak Load
                </p>
                <p className="text-2xl text-white font-bold mt-2">184 kW</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/60 border-cyan-500/20">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Percent className="w-4 h-4 text-cyan-400" /> Shaved Load %
                </p>
                <p className="text-2xl text-white font-bold mt-2">26%</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/60 border-cyan-500/20">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" /> Events Today
                </p>
                <p className="text-2xl text-white font-bold mt-2">14</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/60 border-cyan-500/20">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" /> Critical Alerts
                </p>
                <p className="text-2xl text-red-400 font-bold mt-2">3</p>
              </CardContent>
            </Card>
          </div>

          {/* ✅ Chart */}
          <Card className="bg-gray-900/50 border-cyan-500/20 mt-6">
            <CardHeader><CardTitle className="text-cyan-400">Grid Load Trend</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={loadData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Line type="monotone" dataKey="load" stroke="#00eaff" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* ✅ Rules */}
          <div className="mt-6 space-y-4">
            {shavingRules.map(rule => (
              <Card key={rule.id} className="bg-gray-900/50 border-cyan-500/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">{rule.name}</CardTitle>
                    <div className="flex gap-2">
                      <Badge className={rule.enabled ? "bg-green-500/20 text-green-400" : "bg-gray-600 text-gray-400"}>
                        {rule.enabled ? "Enabled" : "Disabled"}
                      </Badge>

                      <Button variant="ghost" onClick={() => setEditRule(rule)} className="h-8 w-8 p-0">
                        <Edit2 className="w-4 h-4" />
                      </Button>

                      <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-red-500/20"
                        onClick={() => deleteRule(rule.id)}>
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="grid grid-cols-3 gap-3 text-sm text-gray-300">
                  <p>Threshold: {rule.value1}%</p>
                  <p>Duration: {rule.value2} min</p>
                  <p>Power Cut: {rule.value3}%</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ✅ LOAD SHIFTING TAB */}
        <TabsContent value="shifting">
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-gray-900/60 border-cyan-500/20">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" /> Shifted Sessions
                </p>
                <p className="text-2xl text-white font-bold mt-2">42</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/60 border-cyan-500/20">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Percent className="w-4 h-4 text-cyan-400" /> Shift Success Rate
                </p>
                <p className="text-2xl text-white font-bold mt-2">88%</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/60 border-cyan-500/20">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" /> Demand Reduction
                </p>
                <p className="text-2xl text-white font-bold mt-2">31 kW</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/60 border-cyan-500/20">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" /> Cost Saved
                </p>
                <p className="text-2xl text-cyan-400 font-bold mt-2">LKR 6,280</p>
              </CardContent>
            </Card>
          </div>

          {/* ✅ Chart */}
          <Card className="bg-gray-900/50 border-cyan-500/20 mt-6">
            <CardHeader><CardTitle className="text-cyan-400">Shift Pattern</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={loadData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Line type="monotone" dataKey="load" stroke="#72f5a7" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* ✅ Rules */}
          <div className="mt-6 space-y-4">
            {shiftingRules.map(rule => (
              <Card key={rule.id} className="bg-gray-900/50 border-cyan-500/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">{rule.name}</CardTitle>
                    <div className="flex gap-2">
                      <Badge className={rule.enabled ? "bg-green-500/20 text-green-400" : "bg-gray-600 text-gray-400"}>
                        {rule.enabled ? "Enabled" : "Disabled"}
                      </Badge>

                      <Button variant="ghost" onClick={() => setEditRule(rule)} className="h-8 w-8 p-0">
                        <Edit2 className="w-4 h-4" />
                      </Button>

                      <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-red-500/20"
                        onClick={() => deleteRule(rule.id)}>
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="grid grid-cols-3 gap-3 text-sm text-gray-300">
                  <p>Min Charge: {rule.value1}%</p>
                  <p>Delay: {rule.value2} min</p>
                  <p>Reward: {rule.value3}%</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* ✅ EDIT MODAL */}
      <Dialog open={!!editRule} onOpenChange={() => setEditRule(null)}>
        <DialogContent className="bg-gray-900 border-cyan-500/20">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Rule</DialogTitle>
          </DialogHeader>

          {editRule && (
            <div className="space-y-4">
              <input
                type="text"
                value={editRule.name}
                onChange={e => setEditRule({ ...editRule, name: e.target.value })}
                className="w-full bg-gray-800 text-white p-2 rounded"
              />

              <input
                type="number"
                value={editRule.value1}
                onChange={e => setEditRule({ ...editRule, value1: Number(e.target.value) })}
                className="w-full bg-gray-800 text-white p-2 rounded"
              />

              <input
                type="number"
                value={editRule.value2}
                onChange={e => setEditRule({ ...editRule, value2: Number(e.target.value) })}
                className="w-full bg-gray-800 text-white p-2 rounded"
              />

              <input
                type="number"
                value={editRule.value3}
                onChange={e => setEditRule({ ...editRule, value3: Number(e.target.value) })}
                className="w-full bg-gray-800 text-white p-2 rounded"
              />
            </div>
          )}

          <DialogFooter>
            <Button onClick={saveRule} className="bg-cyan-600">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
