"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { Badge } from "@/components/ui/badge"
import { Zap, Activity, AlertTriangle } from "lucide-react"

interface Station {
    id: string
    name: string
    location: string
    latitude: number
    longitude: number
    status: "Active" | "Offline" | "Maintenance"
    totalChargers: number
    availableChargers: number
}

interface StationMapProps {
    stations: Station[]
}

const StationMap = ({ stations }: StationMapProps) => {
    // Center of Sri Lanka
    const defaultCenter = [7.8731, 80.7718] as [number, number]
    const defaultZoom = 8

    return (
        <div className="h-full w-full rounded-lg overflow-hidden border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
            <MapContainer center={defaultCenter} zoom={defaultZoom} scrollWheelZoom={true} className="h-full w-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className="map-tiles"
                />
                {stations.map((station) => (
                    <Marker
                        key={station.id}
                        position={[station.latitude || 0, station.longitude || 0]}
                    >
                        <Popup className="bg-gray-900 border-cyan-500/50">
                            <div className="p-2 min-w-[200px]">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-slate-800">{station.name}</h3>
                                    <Badge variant={station.status === "Active" ? "default" : "destructive"}>
                                        {station.status}
                                    </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-green-500" />
                                        <span>
                                            {station.availableChargers} / {station.totalChargers} Available
                                        </span>
                                    </div>
                                    {station.status !== "Active" && (
                                        <div className="flex items-center gap-2 text-yellow-600">
                                            <AlertTriangle className="w-4 h-4" />
                                            <span>Maintenance Scheduled</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            <style jsx global>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
          z-index: 0;
        }
        .leaflet-popup-content-wrapper {
          background-color: rgba(255, 255, 255, 0.95);
          border-radius: 8px;
        }
        .leaflet-popup-tip {
             background-color: rgba(255, 255, 255, 0.95);
        }
        /* Dark mode map tiles filter */
        .map-tiles {
            filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
      `}</style>
        </div>
    )
}

export default StationMap
