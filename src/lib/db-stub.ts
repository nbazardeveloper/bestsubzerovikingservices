// ============================================================================
// DATABASE STUB (temporary)
// ============================================================================
// The live Supabase DB is disconnected/broken right now, so this file lets
// the app run entirely on in-memory mock data instead of hitting Supabase.
//
// TO RECONNECT THE REAL DATABASE LATER:
//   1. Set DB_STUBBED to false below.
//   2. (Optional) Delete this file and remove its imports from
//      src/lib/site.functions.ts and src/lib/admin.functions.ts.
// That's it — nothing else in the app needs to change.
// ============================================================================

export const DB_STUBBED = true;

import type { SiteSettings } from "./site.functions";

export const mockSiteSettings: SiteSettings = {
  business_name: "Best Sub-Zero & Viking Service",
  phone: "+1 (888) 702-8565",
  email: "info@bestsubzerovikingservices.com",
  address: "23 Joel Pl, Staten Island, NY 10306",
  hours: "Mon–Sat: 8:00 AM – 7:00 PM",
  diagnostic_fee: "$95, waived when the repair is completed ($125 in Manhattan, also waived)",
  social_links: {
    instagram: "https://instagram.com/best_subzero_viking_service",
    facebook: "https://www.facebook.com/BSZVS",
    youtube: "https://www.youtube.com/@bestsubzerovikingservice",
    google_reviews: "https://share.google/JpOFNRbqklRGN26Ui",
    yelp: "https://www.yelp.com/biz/best-sub-zero-and-viking-service-staten-island-14",
  },
  review_count: null,
  review_rating: 5.0,
  yelp_review_count: null,
  yelp_review_rating: 4.9,
};

type MockService = {
  id: string;
  slug: string;
  title: string;
  brands: string[];
  category: string;
  short_description: string;
  description: string;
  image_url: string | null;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
};

const now = new Date().toISOString();

export const mockServices: MockService[] = [
  {
    id: "svc-1",
    slug: "refrigerator-freezer-repair",
    title: "Refrigerator & Freezer Repair",
    brands: ["Sub-Zero", "Viking", "Thermador", "GE Monogram"],
    category: "Refrigeration",
    short_description: "Expert repair for built-in and freestanding refrigerators and freezers.",
    description:
      "We service Sub-Zero, Viking, Thermador and other premium built-in and freestanding refrigerators and freezers. Common issues we resolve include temperature problems, compressor failures, evaporator icing, condenser cleaning, control board faults, door seal replacement and drainage issues.",
    image_url: "/images/services/Refrigeration.webp",
    is_published: true,
    is_featured: true,
    sort_order: 1,
    created_at: now,
  },
  {
    id: "svc-2",
    slug: "wine-cooler-repair",
    title: "Wine Cooler Repair",
    brands: ["Sub-Zero", "Viking", "Thermador"],
    category: "Refrigeration",
    short_description: "Precision service for wine preservation units and dual-zone wine coolers.",
    description:
      "Wine coolers require careful diagnostics to protect your collection. We repair cooling systems, thermostats, dual-zone controls, humidity issues, door seals and lighting on Sub-Zero, Viking and other premium wine preservation units.",
    image_url: "/images/services/WineCooler.webp",
    is_published: true,
    is_featured: false,
    sort_order: 2,
    created_at: now,
  },
  {
    id: "svc-3",
    slug: "ice-maker-repair",
    title: "Ice Maker Repair",
    brands: ["Sub-Zero", "Viking", "Wolf"],
    category: "Refrigeration",
    short_description: "Repair for built-in and clear-ice ice makers.",
    description:
      "From dedicated built-in ice makers to in-refrigerator ice systems, we diagnose water inlet valves, ice mold heaters, augers, control modules and clear-ice production issues.",
    image_url: "/images/services/IceMaker.webp",
    is_published: true,
    is_featured: false,
    sort_order: 3,
    created_at: now,
  },
  {
    id: "svc-4",
    slug: "range-stove-repair",
    title: "Range & Stove Repair",
    brands: ["Viking", "Wolf", "Thermador", "Bertazzoni", "Dacor"],
    category: "Cooking",
    short_description: "Gas and electric range and stove repair for premium brands.",
    description:
      "We repair gas and dual-fuel ranges, sealed burners, ignition modules, safety valves, oven igniters, electric elements and control boards on Viking, Wolf, Thermador, Bertazzoni and Dacor equipment.",
    image_url: "/images/services/Cooking.webp",
    is_published: true,
    is_featured: true,
    sort_order: 4,
    created_at: now,
  },
  {
    id: "svc-5",
    slug: "oven-repair",
    title: "Oven Repair",
    brands: ["Wolf", "Viking", "Thermador", "Bosch"],
    category: "Cooking",
    short_description: "Wall oven and range oven diagnostics and repair.",
    description:
      "Wall ovens, double ovens, convection and steam ovens — we address heating faults, thermostat calibration, door hinges, glass replacement, control boards and fan systems.",
    image_url: "/images/services/Oven.webp",
    is_published: true,
    is_featured: false,
    sort_order: 5,
    created_at: now,
  },
  {
    id: "svc-6",
    slug: "cooktop-repair",
    title: "Cooktop Repair",
    brands: ["Wolf", "Viking", "Thermador", "Bosch"],
    category: "Cooking",
    short_description: "Gas, induction and electric cooktop repair.",
    description:
      "Cooktop repair for gas, induction and radiant electric surfaces. We handle burner ignition, sealed-burner cleaning and rebuild, induction coil replacement, glass-top replacement and touch controls.",
    image_url: "/images/services/Cooktop.webp",
    is_published: true,
    is_featured: false,
    sort_order: 6,
    created_at: now,
  },
  {
    id: "svc-7",
    slug: "range-hood-repair",
    title: "Range Hood & Ventilation Repair",
    brands: ["Wolf", "Viking", "Thermador"],
    category: "Ventilation",
    short_description: "Repair for professional range hoods, blowers and downdraft ventilation.",
    description:
      "We service internal and external blowers, downdraft systems, lighting, dampers and controls on professional-grade range hoods.",
    image_url: "/images/services/Ventilation.webp",
    is_published: true,
    is_featured: false,
    sort_order: 7,
    created_at: now,
  },
  {
    id: "svc-8",
    slug: "outdoor-kitchen-bbq-repair",
    title: "Outdoor Kitchen & BBQ Repair",
    brands: ["Wolf", "Viking", "Sub-Zero"],
    category: "Outdoor",
    short_description: "Repair for outdoor grills, outdoor refrigeration and BBQ islands.",
    description:
      "We repair outdoor grills, outdoor refrigeration, warming drawers and outdoor kitchen components — burners, ignition, gas systems and weather-related failures.",
    image_url: "/images/services/Outdoor.webp",
    is_published: true,
    is_featured: false,
    sort_order: 8,
    created_at: now,
  },
  {
    id: "svc-9",
    slug: "warming-drawer-repair",
    title: "Warming Drawer & Food Warmer Repair",
    brands: ["Wolf", "Viking", "Thermador"],
    category: "Cooking",
    short_description: "Precise repair for built-in warming drawers.",
    description:
      "Warming drawer heating elements, controls, thermostats and drawer mechanisms serviced on Wolf, Viking and Thermador units.",
    image_url: "/images/services/WarmingDrawer.webp",
    is_published: true,
    is_featured: false,
    sort_order: 9,
    created_at: now,
  },
  {
    id: "svc-10",
    slug: "microwave-repair",
    title: "Microwave Repair",
    brands: ["Wolf", "Viking", "Thermador", "GE Monogram"],
    category: "Cooking",
    short_description: "Built-in and speed-oven microwave repair.",
    description:
      "We repair built-in microwaves, drawer microwaves, speed ovens and convection microwaves, including magnetrons, high-voltage components, door interlocks and control boards.",
    image_url: "/images/services/Microwave.webp",
    is_published: true,
    is_featured: false,
    sort_order: 10,
    created_at: now,
  },
  {
    id: "svc-11",
    slug: "preventive-maintenance",
    title: "Preventive Maintenance & Diagnostics",
    brands: ["Sub-Zero", "Viking", "Wolf", "Thermador", "Bosch", "Dacor", "GE Monogram", "Bertazzoni"],
    category: "Maintenance",
    short_description: "Scheduled maintenance to extend the life of premium appliances.",
    description:
      "Preventive maintenance for refrigeration and cooking appliances: condenser cleaning, seal inspection, calibration, safety checks and full diagnostics to prevent costly failures.",
    image_url: "/images/services/Maintenance.webp",
    is_published: true,
    is_featured: true,
    sort_order: 11,
    created_at: now,
  },
];

type MockProject = {
  id: string;
  slug: string;
  title: string;
  description: string;
  brands: string[];
  service_area: string | null;
  image_urls: string[];
  completed_on: string | null;
  is_published: boolean;
  created_at: string;
};

export const mockProjects: MockProject[] = [
  {
    id: "prj-1",
    slug: "subzero-648pro-restoration-si",
    title: "Sub-Zero 648PRO Full Restoration",
    description:
      "Complete diagnostics and compressor replacement on a Sub-Zero 648PRO built-in refrigerator/freezer. Restored proper cooling on both sides and re-sealed all gaskets.",
    brands: ["Sub-Zero"],
    service_area: "Staten Island",
    image_urls: [],
    completed_on: null,
    is_published: true,
    created_at: now,
  },
  {
    id: "prj-2",
    slug: "viking-vgic-range-rebuild-bk",
    title: "Viking VGIC Range Ignition Rebuild",
    description:
      "Rebuilt spark ignition system and replaced safety valves on a Viking Professional gas range. Verified flame stability across all burners.",
    brands: ["Viking"],
    service_area: "Brooklyn",
    image_urls: [],
    completed_on: null,
    is_published: true,
    created_at: now,
  },
  {
    id: "prj-3",
    slug: "wolf-doubleoven-control-li",
    title: "Wolf Double Oven Control Board Replacement",
    description:
      "Diagnosed erratic temperature behavior on a Wolf built-in double oven, replaced control board and recalibrated both cavities.",
    brands: ["Wolf"],
    service_area: "Long Island",
    image_urls: [],
    completed_on: null,
    is_published: true,
    created_at: now,
  },
  {
    id: "prj-4",
    slug: "thermador-cooktop-induction-nj",
    title: "Thermador Induction Cooktop Repair",
    description:
      "Replaced two failed induction coils and control interface on a Thermador Freedom induction cooktop. Full function restored.",
    brands: ["Thermador"],
    service_area: "Jersey City",
    image_urls: [],
    completed_on: null,
    is_published: true,
    created_at: now,
  },
];
