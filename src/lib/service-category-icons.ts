import type { ComponentType, SVGProps } from "react";
import { Wind, Sun, Wrench } from "lucide-react";
import { FridgeIcon, StoveIcon, MaintenanceIcon } from "@/components/site/icons/ServiceCategoryIcons";

type CategoryIcon = ComponentType<SVGProps<SVGSVGElement>>;

// Maps each service `category` value (see db-stub.ts MockService) to a
// representative icon, used as the small badge overlapping the service card
// thumbnail. Refrigeration/Cooking/Maintenance use the client-supplied
// custom icons; Ventilation/Outdoor fall back to Lucide until matching
// custom icons are provided. Falls back to Wrench for any unmapped category.
export const SERVICE_CATEGORY_ICONS: Record<string, CategoryIcon> = {
  Refrigeration: FridgeIcon,
  Cooking: StoveIcon,
  Ventilation: Wind,
  Outdoor: Sun,
  Maintenance: MaintenanceIcon,
};

export function getServiceCategoryIcon(category: string): CategoryIcon {
  return SERVICE_CATEGORY_ICONS[category] ?? Wrench;
}

// The fridge icon's source artwork is naturally narrow/tall (a fridge is
// taller than it is wide), so at the shared square size it reads visibly
// smaller than the other icons with left/right padding. Rather than
// stretching or cropping it to force-fill a square, render it a bit taller
// with natural width so it carries the same visual weight as its neighbors.
export function getServiceCategoryIconClassName(category: string): string {
  return category === "Refrigeration" ? "h-12 w-auto" : "h-10 w-10";
}
