import type { ComponentType, SVGProps } from "react";
import { Wrench } from "lucide-react";
import {
  FridgeIcon,
  StoveIcon,
  MaintenanceIcon,
  CooktopIcon,
  MicrowaveIcon,
  RangeHoodIcon,
  IceMakerIcon,
  WineCoolerIcon,
  BbqIcon,
} from "@/components/site/icons/ServiceCategoryIcons";

type CategoryIcon = ComponentType<SVGProps<SVGSVGElement>>;

// Broad category fallback, used when a service's slug doesn't have a more
// specific icon below.
export const SERVICE_CATEGORY_ICONS: Record<string, CategoryIcon> = {
  Refrigeration: FridgeIcon,
  Cooking: StoveIcon,
  Ventilation: RangeHoodIcon,
  Outdoor: BbqIcon,
  Maintenance: MaintenanceIcon,
};

// Per-service overrides, keyed by the service's `slug` (see db-stub.ts
// MockService / the `services` table). Lets appliance-specific services
// within the same broad category (e.g. several "Cooking" services) show
// their own icon instead of sharing one generic category icon.
export const SERVICE_SLUG_ICONS: Record<string, CategoryIcon> = {
  "refrigerator-freezer-repair": FridgeIcon,
  "wine-cooler-repair": WineCoolerIcon,
  "ice-maker-repair": IceMakerIcon,
  "range-stove-repair": StoveIcon,
  "cooktop-repair": CooktopIcon,
  "range-hood-repair": RangeHoodIcon,
  "outdoor-kitchen-bbq-repair": BbqIcon,
  "microwave-repair": MicrowaveIcon,
  "preventive-maintenance": MaintenanceIcon,
};

export function getServiceCategoryIcon(category: string): CategoryIcon {
  return SERVICE_CATEGORY_ICONS[category] ?? Wrench;
}

// Preferred lookup for a service card: tries the service's own slug first,
// then falls back to its broad category, then a generic wrench.
export function getServiceIcon(service: { slug: string; category: string }): CategoryIcon {
  return SERVICE_SLUG_ICONS[service.slug] ?? getServiceCategoryIcon(service.category);
}

// The fridge icon's source artwork is naturally narrow/tall (a fridge is
// taller than it is wide), so at the shared square size it reads visibly
// smaller than the other icons with left/right padding. Rather than
// stretching or cropping it to force-fill a square, render it a bit taller
// with natural width so it carries the same visual weight as its neighbors.
export function getServiceCategoryIconClassName(category: string): string {
  return category === "Refrigeration" ? "h-12 w-auto" : "h-10 w-10";
}
