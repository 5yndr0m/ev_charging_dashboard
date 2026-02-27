"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sun, Clock, Zap, Settings } from "lucide-react";

interface SolarSchedule {
  station: string;
  peak: string;
  normal: string;
  off: string;
}

const solarPeakTimes: SolarSchedule[] = [
  { station: "Colombo ", peak: "10:30 – 14:30", normal: "06:00 – 10:30, 14:30 – 17:30", off: "17:30 – 06:00" },
  { station: "Galle Fort", peak: "10:30 – 14:30", normal: "06:00 – 10:30, 14:30 – 18:30", off: "18:30 – 06:00" },
  { station: "Kandy Town ", peak: "10:30 – 14:30", normal: "07:00 – 10:30, 14:30 – 17:30", off: "17:30 – 07:00" },
  { station: "Negombo Highway Station", peak: "10:00 – 14:00", normal: "06:00 – 10:00, 14:00 – 18:00", off: "18:00 – 06:00" },
  { station: "Anuradhapura", peak: "10:30 – 14:30", normal: "07:00 – 10:30, 14:30 – 18:00", off: "18:00 – 07:00" },
  { station: "Kurunegala", peak: "11:00 – 15:00", normal: "07:00 – 11:00, 15:00 – 19:00", off: "19:00 – 07:00" },
  { station: "Matara ", peak: "10:30 – 14:30", normal: "07:00 – 10:30, 14:30 – 18:30", off: "18:30 – 07:00" },
  { station: "Rathnapura", peak: "10:30 – 14:30", normal: "07:00 – 10:30, 14:30 – 18:30", off: "18:30 – 07:00" },
  { station: "Jaffna ", peak: "09:30 – 15:30", normal: "06:00 – 9:30, 15:30 – 17:30", off: "17:30 – 06:00" },
  { station: "Badulla", peak: "11:00 – 15:00", normal: "06:00 – 11:00, 15:00 – 18:30", off: "18:30 – 06:00" },
];

export default function PeakHourScheduling() {
  const [schedules, setSchedules] = useState(
    solarPeakTimes.map((item) => ({
      ...item,
      isManual: false,
      manual: { peak: item.peak, normal: item.normal, off: item.off },
    }))
  );

  const toggleManual = (index: number) => {
    setSchedules((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, isManual: !s.isManual } : s
      )
    );
  };

  const updateManualTime = (index: number, field: "peak" | "normal" | "off", value: string) => {
    setSchedules((prev) =>
      prev.map((s, i) =>
        i === index
          ? { ...s, manual: { ...s.manual, [field]: value } }
          : s
      )
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Solar-Driven Peak Scheduling</h2>
      <p className="text-gray-400">
        Stations auto-adjust by solar peak. Toggle to override manually.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {schedules.map((item, index) => {
          const display = item.isManual ? item.manual : item;

          return (
            <Card key={index} className="bg-gray-900/50 border border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sun className="w-5 h-5 text-yellow-400" />
                    {item.station}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`switch-${index}`} className="text-xs text-gray-400">
                      {item.isManual ? "Manual" : "Auto"}
                    </Label>
                    <Switch
                      id={`switch-${index}`}
                      checked={item.isManual}
                      onCheckedChange={() => toggleManual(index)}
                      className="data-[state=checked]:bg-cyan-500 data-[state=unchecked]:bg-gray-600"
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Peak Hours */}
                <div>
                  <p className="text-xs text-gray-400 mb-1">Solar Peak Hours</p>
                  {item.isManual ? (
                    <Input
                      value={item.manual.peak}
                      onChange={(e) => updateManualTime(index, "peak", e.target.value)}
                      className="bg-gray-800 border-gray-600 text-yellow-300 text-sm"
                      placeholder="e.g. 10:30 – 14:30"
                    />
                  ) : (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                      <Sun className="w-3 h-3 mr-1" />
                      {display.peak}
                    </Badge>
                  )}
                </div>

                {/* Normal Hours */}
                <div>
                  <p className="text-xs text-gray-400 mb-1">Normal Hours</p>
                  {item.isManual ? (
                    <Input
                      value={item.manual.normal}
                      onChange={(e) => updateManualTime(index, "normal", e.target.value)}
                      className="bg-gray-800 border-gray-600 text-blue-300 text-sm"
                      placeholder="e.g. 07:00 – 10:30, 14:30 – 17:30"
                    />
                  ) : (
                    <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      <Clock className="w-3 h-3 mr-1" />
                      {display.normal}
                    </Badge>
                  )}
                </div>

                {/* Off-Peak Hours */}
                <div>
                  <p className="text-xs text-gray-400 mb-1">Off-Peak Hours</p>
                  {item.isManual ? (
                    <Input
                      value={item.manual.off}
                      onChange={(e) => updateManualTime(index, "off", e.target.value)}
                      className="bg-gray-800 border-gray-600 text-gray-300 text-sm"
                      placeholder="e.g. 17:30 – 07:00"
                    />
                  ) : (
                    <Badge className="bg-gray-700 text-gray-300 border border-gray-600">
                      <Zap className="w-3 h-3 mr-1" />
                      {display.off}
                    </Badge>
                  )}
                </div>

                {/* Optional: Reset Button */}
                {item.isManual && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => {
                      setSchedules((prev) =>
                        prev.map((s, i) =>
                          i === index
                            ? { ...s, isManual: false, manual: { peak: item.peak, normal: item.normal, off: item.off } }
                            : s
                        )
                      );
                    }}
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    Reset to Solar Auto
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}