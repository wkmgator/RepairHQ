"use client"
import { RepairVertical } from "@/lib/industry-verticals"
// Import the new consolidated dashboard
import DigitalDevicesGamingDashboard from "./dashboards/digital-devices-gaming-dashboard"
import AutoRepairDashboard from "./dashboards/auto-repair-dashboard"
import ApplianceRepairDashboard from "./dashboards/appliance-repair-dashboard"
import SolarRepairDashboard from "./dashboards/solar-repair-dashboard"
import MarineRepairDashboard from "./dashboards/marine-repair-dashboard"
import EVRepairDashboard from "./dashboards/ev-repair-dashboard"
import RVRepairDashboard from "./dashboards/rv-repair-dashboard"
import TractorRepairDashboard from "./dashboards/tractor-repair-dashboard"
import SmallEngineDashboard from "./dashboards/small-engine-dashboard"
import GeneralRepairDashboard from "./dashboards/general-repair-dashboard"
import AutoBodyRepairDashboard from "./dashboards/auto-body-repair-dashboard"
// Import new placeholder dashboards
import JewelryWatchDashboard from "./dashboards/jewelry-watch-dashboard"
import VacuumRobotDashboard from "./dashboards/vacuum-robot-dashboard"
import DroneDashboard from "./dashboards/drone-dashboard"
import CameraDashboard from "./dashboards/camera-dashboard"
import PowerToolDashboard from "./dashboards/power-tool-dashboard"
// 1. Import the new IndustrialRepairDashboard
import IndustrialRepairDashboard from "./dashboards/industrial-repair-dashboard"

interface VerticalDashboardRouterProps {
  userVertical: RepairVertical | null // Changed from selectedVertical for clarity
}

export default function VerticalDashboardRouter({ userVertical }: VerticalDashboardRouterProps) {
  if (!userVertical || userVertical === RepairVertical.GENERAL_REPAIR) {
    // If general repair or no specific vertical, show the general dashboard
    // This case might be handled by app/dashboard/page.tsx itself if it shows general stats.
    // For this router, if it's explicitly called with GENERAL_REPAIR, show it.
    return <GeneralRepairDashboard />
  }

  switch (userVertical) {
    case RepairVertical.DIGITAL_DEVICES_GAMING: // New consolidated vertical
      return <DigitalDevicesGamingDashboard />
    case RepairVertical.AUTO_REPAIR:
      return <AutoRepairDashboard />
    case RepairVertical.APPLIANCE_REPAIR:
      return <ApplianceRepairDashboard />
    case RepairVertical.SOLAR_REPAIR:
      return <SolarRepairDashboard />
    case RepairVertical.BOAT_YACHT_REPAIR:
      return <MarineRepairDashboard />
    case RepairVertical.ELECTRIC_VEHICLE_REPAIR:
      return <EVRepairDashboard />
    case RepairVertical.RV_CAMPER_REPAIR:
      return <RVRepairDashboard />
    case RepairVertical.TRACTOR_REPAIR:
      return <TractorRepairDashboard />
    case RepairVertical.SMALL_ENGINE_REPAIR:
      return <SmallEngineDashboard />
    case RepairVertical.AUTO_BODY_REPAIR:
      return <AutoBodyRepairDashboard />
    // Cases for new placeholder dashboards
    case RepairVertical.JEWELRY_WATCH_REPAIR:
      return <JewelryWatchDashboard />
    case RepairVertical.VACUUM_ROBOT_REPAIR:
      return <VacuumRobotDashboard />
    case RepairVertical.DRONE_REPAIR:
      return <DroneDashboard />
    case RepairVertical.CAMERA_REPAIR:
      return <CameraDashboard />
    case RepairVertical.POWER_TOOL_REPAIR:
      return <PowerToolDashboard />
    // 3. Add a case for IndustrialRepairDashboard in the switch statement
    case RepairVertical.INDUSTRIAL_REPAIR:
      return <IndustrialRepairDashboard />
    // PHONE_REPAIR and COMPUTER_REPAIR cases should be removed if they existed,
    // as they are now part of DIGITAL_DEVICES_GAMING.
    default:
      // Fallback to GeneralRepairDashboard if a vertical is somehow unhandled
      // Or display an error/message
      console.warn(`No specific dashboard for vertical: ${userVertical}. Defaulting to General Repair.`)
      return <GeneralRepairDashboard />
  }
}
