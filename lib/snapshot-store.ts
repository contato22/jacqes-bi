import fs from "fs";
import path from "path";
import type {
  KPI,
  RevenueDataPoint,
  CustomerSegment,
  TopProduct,
  CustomerRecord,
  RegionData,
  ChannelData,
  Alert,
} from "./data";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MonthlySnapshot {
  /** "2026-03" */
  period: string;
  year: number;
  /** 1–12 */
  month: number;
  closedAt: string;
  kpis: KPI[];
  revenueData: RevenueDataPoint[];
  customerSegments: CustomerSegment[];
  topProducts: TopProduct[];
  customers: CustomerRecord[];
  regionData: RegionData[];
  channelData: ChannelData[];
  alerts: Alert[];
}

export interface SnapshotIndex {
  snapshots: Array<{ period: string; closedAt: string; file: string }>;
}

// ─── Paths ────────────────────────────────────────────────────────────────────

const SNAPSHOTS_DIR = path.join(process.cwd(), "data", "snapshots");
const INDEX_FILE = path.join(SNAPSHOTS_DIR, "_index.json");

function snapshotPath(period: string): string {
  return path.join(SNAPSHOTS_DIR, `${period}.json`);
}

// ─── Index ────────────────────────────────────────────────────────────────────

function readIndex(): SnapshotIndex {
  if (!fs.existsSync(INDEX_FILE)) {
    return { snapshots: [] };
  }
  return JSON.parse(fs.readFileSync(INDEX_FILE, "utf-8")) as SnapshotIndex;
}

function writeIndex(index: SnapshotIndex): void {
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), "utf-8");
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Save a snapshot for a given period. Overwrites if already exists. */
export function saveSnapshot(snapshot: MonthlySnapshot): void {
  if (!fs.existsSync(SNAPSHOTS_DIR)) {
    fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
  }

  fs.writeFileSync(
    snapshotPath(snapshot.period),
    JSON.stringify(snapshot, null, 2),
    "utf-8"
  );

  const index = readIndex();
  const existing = index.snapshots.findIndex(
    (s) => s.period === snapshot.period
  );
  const entry = {
    period: snapshot.period,
    closedAt: snapshot.closedAt,
    file: `${snapshot.period}.json`,
  };

  if (existing >= 0) {
    index.snapshots[existing] = entry;
  } else {
    index.snapshots.push(entry);
    index.snapshots.sort((a, b) => a.period.localeCompare(b.period));
  }

  writeIndex(index);
}

/** Load a snapshot by period string ("2026-03"). Returns null if not found. */
export function loadSnapshot(period: string): MonthlySnapshot | null {
  const file = snapshotPath(period);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8")) as MonthlySnapshot;
}

/** List all saved snapshots (metadata only). */
export function listSnapshots(): SnapshotIndex["snapshots"] {
  return readIndex().snapshots;
}

/** Load the most recent snapshot. Returns null if none exist. */
export function loadLatestSnapshot(): MonthlySnapshot | null {
  const index = readIndex();
  if (index.snapshots.length === 0) return null;
  const latest = index.snapshots[index.snapshots.length - 1];
  return loadSnapshot(latest.period);
}
