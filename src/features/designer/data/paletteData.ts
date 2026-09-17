import type { PaletteItem } from "../types";

/**
 * Every recurring component archetype across the 44 diagrams built for this
 * app's 16 chapters, plus generic shapes for anything a specific chapter
 * didn't need. Infrastructure + Advanced together cover 28 distinct
 * component types (including metadata/config stores and CDN edge nodes,
 * for the higher-fidelity diagrams in the later chapters); General adds 8
 * free-form shapes so nothing is ever unrepresentable.
 */
export const PALETTE: PaletteItem[] = [
  // ---- General ------------------------------------------------------
  { type: "rectangle", label: "Rectangle", category: "General", shapeKind: "rectangle", defaultWidth: 160, defaultHeight: 80, defaults: { cornerRadius: 0 } },
  { type: "roundedRectangle", label: "Rounded Rectangle", category: "General", shapeKind: "roundedRectangle", defaultWidth: 160, defaultHeight: 80, defaults: { cornerRadius: 14 } },
  { type: "circle", label: "Circle", category: "General", shapeKind: "circle", defaultWidth: 110, defaultHeight: 110 },
  { type: "diamond", label: "Diamond", category: "General", shapeKind: "diamond", defaultWidth: 140, defaultHeight: 100 },
  { type: "hexagon", label: "Hexagon", category: "General", shapeKind: "hexagon", defaultWidth: 150, defaultHeight: 80 },
  { type: "arrow", label: "Arrow", category: "General", shapeKind: "text", defaultWidth: 140, defaultHeight: 1 },
  { type: "text", label: "Text", category: "General", shapeKind: "text", defaultWidth: 140, defaultHeight: 32, defaults: { fill: "transparent", stroke: "transparent", fontWeight: 600 } },
  { type: "container", label: "Dashed Container", category: "General", shapeKind: "container", defaultWidth: 420, defaultHeight: 280, defaults: { label: "Group" } },

  // ---- Infrastructure -------------------------------------------------
  { type: "client", label: "Client / User", category: "Infrastructure", shapeKind: "roundedRectangle", icon: "client", defaultWidth: 130, defaultHeight: 70 },
  { type: "browser", label: "Web Browser", category: "Infrastructure", shapeKind: "browser", defaultWidth: 170, defaultHeight: 120 },
  { type: "mobile", label: "Mobile App", category: "Infrastructure", shapeKind: "device", defaultWidth: 90, defaultHeight: 140 },
  { type: "dns", label: "DNS", category: "Infrastructure", shapeKind: "dnsGlobe", icon: "dns", defaultWidth: 110, defaultHeight: 110 },
  { type: "cdn", label: "CDN", category: "Infrastructure", shapeKind: "cdnMark", icon: "cdn", defaultWidth: 120, defaultHeight: 120 },
  {
    type: "loadBalancer",
    label: "Load Balancer",
    category: "Infrastructure",
    shapeKind: "lbShield",
    icon: "loadBalancer",
    defaultWidth: 120,
    defaultHeight: 120,
  },
  { type: "apiGateway", label: "API Gateway", category: "Infrastructure", shapeKind: "roundedRectangle", icon: "apiGateway", defaultWidth: 150, defaultHeight: 70 },
  { type: "server", label: "Server", category: "Infrastructure", shapeKind: "serverMark", icon: "server", defaultWidth: 100, defaultHeight: 110 },
  {
    type: "webServers",
    label: "Web Servers",
    category: "Infrastructure",
    shapeKind: "webServersMark",
    icon: "server",
    defaultWidth: 130,
    defaultHeight: 130,
  },
  { type: "cache", label: "Cache", category: "Infrastructure", shapeKind: "roundedRectangle", icon: "cache", defaultWidth: 150, defaultHeight: 70 },
  {
    type: "redisCache",
    label: "Redis Cache",
    category: "Infrastructure",
    shapeKind: "redisMark",
    icon: "cache",
    defaultWidth: 120,
    defaultHeight: 120,
  },
  { type: "database", label: "Database", category: "Infrastructure", shapeKind: "cylinder", icon: "database", defaultWidth: 120, defaultHeight: 90 },
  { type: "nosql", label: "NoSQL / KV Store", category: "Infrastructure", shapeKind: "cylinder", icon: "nosql", defaultWidth: 130, defaultHeight: 90 },
  { type: "shard", label: "Shard / Partition", category: "Infrastructure", shapeKind: "cylinder", icon: "shard", defaultWidth: 110, defaultHeight: 90 },
  { type: "objectStorage", label: "Object Storage", category: "Infrastructure", shapeKind: "roundedRectangle", icon: "objectStorage", defaultWidth: 150, defaultHeight: 70 },
  { type: "queue", label: "Message Queue", category: "Infrastructure", shapeKind: "queue", defaultWidth: 180, defaultHeight: 90 },
  { type: "worker", label: "Worker / Consumer", category: "Infrastructure", shapeKind: "roundedRectangle", icon: "worker", defaultWidth: 150, defaultHeight: 70 },
  { type: "rateLimiter", label: "Rate Limiter", category: "Infrastructure", shapeKind: "hexagon", icon: "rateLimiter", defaultWidth: 150, defaultHeight: 80 },
  { type: "hashRing", label: "Consistent Hash Ring", category: "Infrastructure", shapeKind: "circle", icon: "hashRing", defaultWidth: 130, defaultHeight: 130 },
  { type: "searchIndex", label: "Search Index", category: "Infrastructure", shapeKind: "roundedRectangle", icon: "searchIndex", defaultWidth: 150, defaultHeight: 70 },
  { type: "webSocket", label: "WebSocket Conn.", category: "Infrastructure", shapeKind: "roundedRectangle", icon: "webSocket", defaultWidth: 150, defaultHeight: 70 },
  { type: "notification", label: "Notification Service", category: "Infrastructure", shapeKind: "roundedRectangle", icon: "notification", defaultWidth: 160, defaultHeight: 70 },
  { type: "coordinator", label: "Coordinator", category: "Infrastructure", shapeKind: "roundedRectangle", icon: "coordinator", defaultWidth: 150, defaultHeight: 70 },
  { type: "metadataStore", label: "Metadata / Config DB", category: "Infrastructure", shapeKind: "cylinder", icon: "metadata", defaultWidth: 130, defaultHeight: 90 },
  { type: "cdnEdge", label: "CDN Edge Node", category: "Infrastructure", shapeKind: "roundedRectangle", icon: "edgeNode", defaultWidth: 150, defaultHeight: 70 },
  { type: "thirdParty", label: "Third-party Service", category: "Infrastructure", shapeKind: "cloud", icon: "thirdParty", defaultWidth: 150, defaultHeight: 90 },

  // ---- Advanced ---------------------------------------------------------
  { type: "vpc", label: "VPC / Subnet", category: "Advanced", shapeKind: "container", icon: "container", defaultWidth: 420, defaultHeight: 280, defaults: { label: "VPC" } },
  { type: "autoScaling", label: "Auto Scaling Group", category: "Advanced", shapeKind: "container", icon: "autoScaling", defaultWidth: 380, defaultHeight: 220, defaults: { label: "Auto Scaling Group" } },
  { type: "kubernetes", label: "Kubernetes Cluster", category: "Advanced", shapeKind: "container", icon: "kubernetes", defaultWidth: 420, defaultHeight: 260, defaults: { label: "Kubernetes Cluster" } },
  { type: "dataCenter", label: "Data Center", category: "Advanced", shapeKind: "container", icon: "server", defaultWidth: 460, defaultHeight: 300, defaults: { label: "Data Center" } },
];

export const PALETTE_CATEGORIES = ["General", "Infrastructure", "Advanced"] as const;
