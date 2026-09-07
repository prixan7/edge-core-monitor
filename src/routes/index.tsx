import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  CircleGauge,
  Database,
  Download,
  ExternalLink,
  FileClock,
  Gauge,
  HardDrive,
  LayoutDashboard,
  Menu,
  MonitorCog,
  Network,
  Play,
  RefreshCw,
  Search,
  Server,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Thermometer,
  UploadCloud,
  X,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  architectureLayers,
  backupRows,
  initialAlerts,
  initialDevices,
  initialTasks,
  type Alert,
  type Device,
  type DeviceStatus,
  type Task,
} from "@/lib/srm-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SRM Control Center — ESP32 Resource Monitoring" },
      { name: "description", content: "A simulated ESP32 IoT control center for monitoring resources, backups, alerts, and task allocation." },
      { property: "og:title", content: "SRM Control Center — ESP32 Resource Monitoring" },
      { property: "og:description", content: "Monitor, backup, optimize, and allocate across a connected ESP32 device fleet." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SrmApp,
});

type View = "dashboard" | "devices" | "monitor" | "backup" | "tasks" | "alerts" | "architecture" | "logs" | "settings";

const navItems: Array<{ id: View; label: string; icon: typeof LayoutDashboard }> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "devices", label: "Devices", icon: Server },
  { id: "monitor", label: "Resource Monitor", icon: Gauge },
  { id: "backup", label: "Data Backup", icon: Database },
  { id: "tasks", label: "Task Manager", icon: SlidersHorizontal },
  { id: "alerts", label: "Alerts", icon: AlertTriangle },
  { id: "architecture", label: "System Architecture", icon: Network },
  { id: "logs", label: "Activity Logs", icon: FileClock },
  { id: "settings", label: "Settings", icon: Settings },
];

const toneClass: Record<string, string> = {
  cyan: "text-srm-cyan border-srm-cyan/25 bg-srm-cyan/8",
  green: "text-srm-green border-srm-green/25 bg-srm-green/8",
  amber: "text-srm-amber border-srm-amber/25 bg-srm-amber/8",
  red: "text-srm-red border-srm-red/25 bg-srm-red/8",
  violet: "text-srm-violet border-srm-violet/25 bg-srm-violet/8",
};

function SrmApp() {
  const [view, setView] = useState<View>("dashboard");
  const [devices, setDevices] = useState(initialDevices);
  const [tasks, setTasks] = useState(initialTasks);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setDevices((current) => current.map((device) => {
        if (device.status === "Critical") return device;
        const drift = (Math.random() - 0.5) * 4;
        const cpuUsage = clamp(device.cpuUsage + drift, 12, 82);
        const temperature = clamp(device.temperature + drift * 0.08, 32, 60);
        return { ...device, cpuUsage: Math.round(cpuUsage), temperature: Number(temperature.toFixed(1)), lastSeen: "just now", pendingRecords: device.pendingRecords + (Math.random() > 0.66 ? 1 : 0) };
      }));
    }, 5000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!demoMode) return;
    const interval = window.setInterval(() => {
      runDemoScenario(setDevices, setTasks, setAlerts);
    }, 7000);
    return () => window.clearInterval(interval);
  }, [demoMode]);

  const filteredDevices = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return devices;
    return devices.filter((device) => `${device.id} ${device.ipAddress} ${device.currentTask}`.toLowerCase().includes(needle));
  }, [devices, search]);

  function selectView(nextView: View) {
    setView(nextView);
    setMobileMenu(false);
  }

  function simulateOverload() {
    setDevices((current) => current.map((device) => device.id === "ESP32-003" ? { ...device, status: "Critical", cpuUsage: 94, memoryUsage: 91, temperature: 69.5, currentTask: "Blocked / overloaded" } : device));
    setTasks((current) => current.map((task) => task.id === "TASK-005" ? { ...task, assignedDevice: "ESP32-005", status: "Reassigned" } : task));
    const nextAlert: Alert = { id: `ALT-${Date.now()}`, deviceId: "ESP32-003", type: "CPU utilization exceeded threshold", severity: "Critical", currentValue: "94%", threshold: "85%", timestamp: "now", status: "Open", message: "Device marked overloaded. New tasks blocked and TASK-005 reassigned." };
    setAlerts((current) => [nextAlert, ...current]);
    toast.error("ESP32-003 overloaded", { description: "TASK-005 reassigned to ESP32-005." });
  }

  function backupNow(deviceId?: string) {
    setDevices((current) => current.map((device) => device.id === deviceId || !deviceId ? { ...device, pendingRecords: Math.max(0, device.pendingRecords - 12), storageUsage: Math.max(12, device.storageUsage - 1) } : device));
    toast.success("Backup confirmed", { description: "Local data was cleaned only after server confirmation." });
  }

  return (
    <div className="min-h-screen bg-srm-ink font-sans text-srm-inkbright antialiased">
      <TopBar onMenu={() => setMobileMenu((open) => !open)} search={search} setSearch={setSearch} demoMode={demoMode} setDemoMode={setDemoMode} />
      <div className="flex">
        <Sidebar active={view} onSelect={selectView} mobileOpen={mobileMenu} />
        <main className="min-w-0 flex-1 px-4 py-4 sm:px-5">
          {view === "dashboard" && <Dashboard devices={filteredDevices} alerts={alerts} onSelectDevice={setSelectedDevice} onSelectView={selectView} onSimulate={simulateOverload} onBackup={backupNow} onTask={() => { setView("tasks"); toast.success("Task allocation ready", { description: "The scoring engine will select a healthy device." }); }} />}
          {view === "devices" && <DevicesView devices={filteredDevices} onSelectDevice={setSelectedDevice} />}
          {view === "monitor" && <MonitorView devices={devices} />}
          {view === "backup" && <BackupView devices={devices} onBackup={backupNow} />}
          {view === "tasks" && <TasksView tasks={tasks} devices={devices} onSimulate={simulateOverload} />}
          {view === "alerts" && <AlertsView alerts={alerts} onUpdate={(id, status) => setAlerts((current) => current.map((alert) => alert.id === id ? { ...alert, status } : alert))} onSelectDevice={(id) => setSelectedDevice(devices.find((device) => device.id === id) ?? null)} />}
          {view === "architecture" && <ArchitectureView />}
          {view === "logs" && <LogsView />}
          {view === "settings" && <SettingsView />}
          <footer className="mt-5 border-t border-srm-line/70 pt-3 font-mono text-[10px] text-srm-muted">SIMULATION DATA · demo values for prototype review · SRM v0.4</footer>
        </main>
      </div>
      {selectedDevice && <DeviceDetails device={selectedDevice} onClose={() => setSelectedDevice(null)} onBackup={() => backupNow(selectedDevice.id)} />}
    </div>
  );
}

function TopBar({ onMenu, search, setSearch, demoMode, setDemoMode }: { onMenu: () => void; search: string; setSearch: (value: string) => void; demoMode: boolean; setDemoMode: (value: boolean) => void }) {
  return <header className="sticky top-0 z-30 flex min-h-14 items-center justify-between gap-3 border-b border-srm-line/70 bg-srm-base/95 px-4 backdrop-blur sm:px-5">
    <div className="flex min-w-0 items-center gap-3">
      <Button aria-label="Open navigation" variant="ghost" size="icon" className="md:hidden text-srm-muted" onClick={onMenu}><Menu /></Button>
      <div className="rounded-md bg-srm-surface2 px-2.5 py-1.5 ring-1 ring-srm-line"><span className="font-mono text-xs font-medium tracking-tight text-srm-cyan">SRM</span></div>
      <div className="hidden min-w-0 leading-tight sm:block"><div className="truncate font-display text-sm font-semibold tracking-tight">Smart Resource Manager</div><div className="font-mono text-[10px] uppercase tracking-[0.15em] text-srm-muted">ESP32 IoT Control Center</div></div>
    </div>
    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
      <span className="flex items-center gap-1.5 rounded-full border border-srm-line bg-srm-surface px-2.5 py-1"><span className="led size-1.5 rounded-full bg-srm-green" /><span className="font-mono text-[10px] uppercase tracking-wider text-srm-green">Live</span></span>
      <div className="relative hidden md:block"><Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-srm-muted" /><input aria-label="Search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search devices…" className="h-8 w-40 rounded-md border border-srm-line bg-srm-surface pl-8 pr-2 text-xs text-srm-inkbright outline-none placeholder:text-srm-muted focus:border-srm-cyan/60" /></div>
      <Button variant="outline" size="sm" className="hidden border-srm-line bg-srm-surface text-srm-muted hover:bg-srm-surface2 hover:text-srm-inkbright sm:inline-flex" onClick={() => toast.success("Telemetry refreshed") }><RefreshCw /> <span className="hidden lg:inline">Refresh</span></Button>
      <Button variant={demoMode ? "default" : "outline"} size="sm" className={demoMode ? "bg-srm-cyan text-srm-ink hover:bg-srm-cyan/90" : "hidden border-srm-line bg-srm-surface text-srm-muted hover:bg-srm-surface2 hover:text-srm-inkbright sm:inline-flex"} onClick={() => { setDemoMode(!demoMode); toast(demoMode ? "Demo mode paused" : "Demo mode active", { description: "The lifecycle will play through simulated resource events." }); }}><Play /> <span className="hidden lg:inline">Demo</span></Button>
      <Button aria-label="Notifications" variant="outline" size="icon" className="relative border-srm-line bg-srm-surface text-srm-muted hover:bg-srm-surface2 hover:text-srm-inkbright"><Bell /><span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-srm-red" /></Button>
      <span className="grid size-8 place-items-center rounded-full bg-srm-surface2 font-mono text-[11px] text-srm-cyan">EV</span>
    </div>
  </header>;
}

function Sidebar({ active, onSelect, mobileOpen }: { active: View; onSelect: (view: View) => void; mobileOpen: boolean }) {
  return <aside className={`${mobileOpen ? "absolute z-20 flex" : "hidden"} top-14 h-[calc(100vh-56px)] w-64 flex-col border-r border-srm-line/70 bg-srm-base md:sticky md:top-14 md:flex md:h-[calc(100vh-56px)] md:w-52 md:shrink-0`}>
    <nav className="flex flex-col gap-0.5 p-3 text-sm"><span className="mb-1 px-2 font-mono text-[9px] uppercase tracking-[0.2em] text-srm-muted">Navigate</span>{navItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => onSelect(id)} className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors ${active === id ? "bg-srm-cyan/10 font-medium text-srm-cyan ring-1 ring-srm-cyan/20" : "text-srm-muted hover:bg-srm-surface hover:text-srm-inkbright"}`}><Icon className="size-4" /> <span className="min-w-0 truncate">{label}</span>{id === "alerts" && <span className="ml-auto rounded-full bg-srm-red/10 px-1.5 py-0.5 font-mono text-[10px] text-srm-red">3</span>}</button>)}</nav>
    <div className="mt-auto border-t border-srm-line/70 p-3"><div className="rounded-lg border border-srm-line bg-srm-surface/70 p-3"><div className="flex items-center gap-2"><span className="led size-1.5 rounded-full bg-srm-green" /><span className="font-mono text-[10px] uppercase tracking-wider text-srm-green">Operational</span></div><div className="mt-2 font-mono text-[10px] text-srm-muted">Last sync 12s ago</div></div></div>
  </aside>;
}

function PageHead({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h1 className="font-display text-xl font-bold tracking-tight">{title}</h1><p className="mt-0.5 max-w-[62ch] text-sm text-srm-muted">{subtitle}</p></div>{action}</div>;
}

function Dashboard({ devices, alerts, onSelectDevice, onSelectView, onSimulate, onBackup, onTask }: { devices: Device[]; alerts: Alert[]; onSelectDevice: (device: Device) => void; onSelectView: (view: View) => void; onSimulate: () => void; onBackup: (deviceId?: string) => void; onTask: () => void }) {
  const avgCpu = average(devices.map((device) => device.cpuUsage));
  const avgMemory = average(devices.map((device) => device.memoryUsage));
  const healthy = devices.filter((device) => device.status === "Healthy").length;
  return <>
    <PageHead title="IoT Resource Management" subtitle="Real-time monitoring and intelligent resource allocation for connected ESP32 devices." action={<div className="flex items-center gap-1.5 rounded-lg border border-srm-line bg-srm-surface px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-srm-muted"><span className="text-srm-cyan">Monitor</span><span className="text-srm-line">›</span><span>Detect</span><span className="text-srm-line">›</span><span>Backup</span><span className="text-srm-line">›</span><span>Clean</span><span className="text-srm-line">›</span><span>Alert</span><span className="text-srm-line">›</span><span>Allocate</span></div>} />
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-6"> <Metric label="Devices" value={String(devices.length)} detail={<><span className="text-srm-green">{healthy}</span> healthy · <span className="text-srm-amber">{devices.length - healthy}</span> warn</>} icon={<Server />} /><Metric label="Avg CPU" value={`${avgCpu.toFixed(1)}%`} detail="last 30 min" chart tone="cyan" /><Metric label="Memory" value={`${avgMemory.toFixed(1)}%`} detail="38.8% available" progress={avgMemory} /><Metric label="Storage" value="42.8 GB" detail="67% of capacity" progress={67} tone="violet" /><Metric label="Backup" value="98.7%" detail="1,284 records" tone="green" /><Metric label="Alerts" value={String(alerts.filter((alert) => alert.status !== "Resolved").length)} detail={<><span className="text-srm-red">1</span> critical · <span className="text-srm-amber">2</span> warn</>} tone="red" /></div>
    <div className="mt-2.5 grid grid-cols-1 gap-2.5 lg:grid-cols-12">
      <DeviceTable devices={devices} onSelectDevice={onSelectDevice} />
      <CpuChart />
      <HealthCard devices={devices} />
      <BackupCard onBackup={() => onBackup()} onOpen={() => onSelectView("backup")} />
      <AlertCard alerts={alerts} onOpen={() => onSelectView("alerts")} />
      <AllocationCard onSimulate={onSimulate} onTask={onTask} />
    </div>
  </>;
}

function Metric({ label, value, detail, progress, chart, tone = "cyan", icon }: { label: string; value: string; detail: React.ReactNode; progress?: number; chart?: boolean; tone?: "cyan" | "green" | "red" | "violet"; icon?: React.ReactNode }) {
  const text = tone === "green" ? "text-srm-green" : tone === "red" ? "text-srm-red" : tone === "violet" ? "text-srm-violet" : "text-srm-cyan";
  return <div className={`rounded-xl border p-3 animate-rise ${tone === "red" ? "border-srm-red/30 bg-srm-red/5 ring-1 ring-srm-red/20" : "border-srm-line bg-srm-surface"}`}><div className="flex items-center justify-between"><span className="font-mono text-[9px] uppercase tracking-wider text-srm-muted">{label}</span>{icon ? <span className="text-srm-cyan">{icon}</span> : <span className={`led size-1.5 rounded-full ${text.replace("text-", "bg-")}`} />}</div><div className={`mt-2 font-mono text-2xl font-medium tracking-tight ${text}`}>{value}</div>{chart ? <MiniChart /> : progress !== undefined ? <div className="mt-2 h-1 rounded-full bg-srm-surface2"><div className={`h-1 rounded-full ${text.replace("text-", "bg-")}`} style={{ width: `${progress}%` }} /></div> : null}<div className="mt-1 font-mono text-[10px] text-srm-muted">{detail}</div></div>;
}

function DeviceTable({ devices, onSelectDevice }: { devices: Device[]; onSelectDevice: (device: Device) => void }) {
  return <section className="rounded-xl border border-srm-line bg-srm-surface p-3 lg:col-span-8"><div className="mb-2 flex items-center justify-between"><div><h2 className="font-display text-sm font-semibold tracking-tight">Live Resource Overview</h2><p className="font-mono text-[10px] text-srm-muted">{devices.length} nodes · simulated heartbeat 5s</p></div><span className="font-mono text-[10px] text-srm-muted">click a row →</span></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] border-separate border-spacing-0 text-left text-xs"><thead><tr className="font-mono text-[9px] uppercase tracking-wider text-srm-muted"><th className="pb-2 pr-2 font-normal">Device</th><th className="pb-2 pr-2 font-normal">Status</th><th className="pb-2 pr-2 font-normal">CPU</th><th className="pb-2 pr-2 font-normal">Memory</th><th className="pb-2 pr-2 font-normal">Temp</th><th className="pb-2 pr-2 font-normal">Queue</th><th className="pb-2 font-normal">Task</th></tr></thead><tbody className="font-mono text-[11px]">{devices.map((device) => <tr key={device.id} onClick={() => onSelectDevice(device)} className="cursor-pointer border-t border-srm-line/60 hover:bg-srm-surface2/50"><td className="py-2 pr-2">{device.id}<span className="block text-[9px] text-srm-muted">{device.ipAddress}</span></td><td className="pr-2"><StatusBadge status={device.status} /></td><td className="pr-2"><div className="mb-1">{device.cpuUsage}%</div><Progress value={device.cpuUsage} tone={device.cpuUsage > 85 ? "red" : device.cpuUsage > 70 ? "amber" : "cyan"} /></td><td className="pr-2">{device.memoryUsage}%</td><td className={device.temperature > 65 ? "pr-2 text-srm-red" : device.temperature > 55 ? "pr-2 text-srm-amber" : "pr-2"}>{device.temperature}°</td><td className="pr-2 text-srm-muted">{device.pendingRecords}</td><td className="max-w-32 truncate text-srm-muted">{device.currentTask}</td></tr>)}</tbody></table></div></section>;
}

function CpuChart() { return <section className="rounded-xl border border-srm-line bg-srm-surface p-3 lg:col-span-4"><div className="mb-2 flex items-center justify-between"><h2 className="font-display text-sm font-semibold tracking-tight">CPU Utilization</h2><span className="rounded border border-srm-line bg-srm-surface2 px-2 py-0.5 font-mono text-[10px] text-srm-cyan">All Devices</span></div><SignalChart /><div className="mt-2 flex justify-between font-mono text-[9px] text-srm-muted"><span>-30m</span><span>warning 70%</span><span>now</span></div></section>; }

function SignalChart({ color = "var(--color-srm-cyan)" }: { color?: string }) { return <svg viewBox="0 0 300 120" className="h-28 w-full" preserveAspectRatio="none"><line x1="0" y1="30" x2="300" y2="30" stroke="var(--color-srm-red)" strokeWidth="1" strokeDasharray="3 4" opacity=".5" /><line x1="0" y1="60" x2="300" y2="60" stroke="var(--color-srm-amber)" strokeWidth="1" strokeDasharray="3 4" opacity=".4" /><polyline points="0,90 30,84 60,86 90,72 120,76 150,60 180,64 210,50 240,54 270,42 300,46" fill="none" stroke={color} strokeWidth="1.6" className="signal-dash" /></svg>; }

function HealthCard({ devices }: { devices: Device[] }) { return <section className="rounded-xl border border-srm-line bg-srm-surface p-3 lg:col-span-3"><h2 className="mb-3 font-display text-sm font-semibold tracking-tight">Device Health</h2><div className="grid grid-cols-2 gap-3">{(["Healthy", "Warning", "Critical", "Offline"] as DeviceStatus[]).map((status) => <div key={status} className="text-center"><div className={`relative mx-auto grid size-14 place-items-center rounded-full ${status === "Healthy" ? "ring-srm-green" : status === "Warning" ? "ring-srm-amber" : status === "Critical" ? "ring-srm-red" : "ring-srm-muted"}`} style={{ background: `conic-gradient(var(${status === "Healthy" ? "--color-srm-green" : status === "Warning" ? "--color-srm-amber" : status === "Critical" ? "--color-srm-red" : "--color-srm-muted"}) 0 ${Math.max(1, devices.filter((device) => device.status === status).length / devices.length * 100)}%, var(--color-srm-surface2) ${Math.max(1, devices.filter((device) => device.status === status).length / devices.length * 100)}% 100%)` }}><div className="grid size-10 place-items-center rounded-full bg-srm-surface font-mono text-sm font-medium">{devices.filter((device) => device.status === status).length}</div></div><div className={`mt-1 font-mono text-[10px] ${status === "Healthy" ? "text-srm-green" : status === "Warning" ? "text-srm-amber" : status === "Critical" ? "text-srm-red" : "text-srm-muted"}`}>{status}</div></div>)}</div></section>; }

function BackupCard({ onBackup, onOpen }: { onBackup: () => void; onOpen: () => void }) { return <section className="rounded-xl border border-srm-line bg-srm-surface p-3 lg:col-span-5"><div className="mb-3 flex items-center justify-between"><div><h2 className="font-display text-sm font-semibold tracking-tight">Backup &amp; Memory Management</h2><p className="font-mono text-[10px] text-srm-muted">clean local only after confirmation</p></div><Button variant="link" size="sm" className="text-srm-cyan" onClick={onOpen}>View all <ChevronRight /></Button></div><div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]"><Pipe label="ESP32" /><ArrowRight className="size-3 text-srm-cyan" /><Pipe label="Sensor" /><ArrowRight className="size-3 text-srm-cyan" /><Pipe label="Transfer" tone="cyan" /><ArrowRight className="size-3 text-srm-cyan" /><Pipe label="Confirm" /><ArrowRight className="size-3 text-srm-green" /><Pipe label="Clean" tone="green" /></div><div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[10px]">{[["Pending", "14", "text-srm-amber"], ["Transferred", "1,284", "text-srm-inkbright"], ["Confirmed", "1,270", "text-srm-green"], ["Failed", "2", "text-srm-red"]].map(([label, value, text]) => <div key={label} className="rounded-md bg-srm-surface2/60 p-2"><div className="text-srm-muted">{label}</div><div className={`text-base ${text}`}>{value}</div></div>)}</div><Button size="sm" className="mt-3 bg-srm-cyan text-srm-ink hover:bg-srm-cyan/90" onClick={onBackup}><UploadCloud /> Backup pending data</Button></section>; }

function AlertCard({ alerts, onOpen }: { alerts: Alert[]; onOpen: () => void }) { return <section className="rounded-xl border border-srm-line bg-srm-surface p-3 lg:col-span-4"><div className="mb-2 flex items-center justify-between"><h2 className="font-display text-sm font-semibold tracking-tight">Active Alerts</h2><Button variant="link" size="sm" className="text-srm-cyan" onClick={onOpen}>View all <ChevronRight /></Button></div><div className="flex flex-col gap-1.5 text-xs">{alerts.filter((alert) => alert.status !== "Resolved").slice(0, 3).map((alert) => <div key={alert.id} className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 ${toneClass[alert.severity === "Critical" ? "red" : alert.severity === "Warning" ? "amber" : "cyan"]}`}><span className="led size-1.5 rounded-full bg-current" /><span className="min-w-0 flex-1 truncate">{alert.type}</span><span className="shrink-0 font-mono text-[10px]">{alert.deviceId}</span></div>)}</div></section>; }

function AllocationCard({ onSimulate, onTask }: { onSimulate: () => void; onTask: () => void }) { return <section className="rounded-xl border border-srm-line bg-srm-surface p-3 lg:col-span-8"><div className="mb-3 flex items-center justify-between"><div><h2 className="font-display text-sm font-semibold tracking-tight">Task Allocation Engine</h2><p className="font-mono text-[10px] text-srm-muted">resource-aware scoring, no hidden AI decisions</p></div><div className="flex gap-2"><Button variant="outline" size="sm" className="border-srm-line bg-srm-surface2 text-srm-amber hover:bg-srm-amber/10" onClick={onSimulate}><AlertTriangle /> Simulate overload</Button><Button size="sm" className="bg-srm-cyan text-srm-ink hover:bg-srm-cyan/90" onClick={onTask}><Zap /> Assign task</Button></div></div><div className="grid grid-cols-2 gap-2 font-mono text-[10px] sm:grid-cols-6">{["New Task", "Check Resources", "Score CPU / RAM", "Score Storage / Temp", "Select Device", "Assign"].map((label, index) => <div key={label} className={`rounded-md border p-2 text-center ${index === 4 ? "border-srm-cyan/30 bg-srm-cyan/10 text-srm-cyan" : index === 5 ? "border-srm-green/30 bg-srm-green/10 text-srm-green" : "border-srm-line bg-srm-surface2/50"}`}>{label}</div>)}</div><div className="mt-3 rounded-md border border-srm-line bg-srm-base/40 p-2.5 font-mono text-[11px]"><span className="text-srm-muted">TASK-007</span> <span className="text-srm-amber">ESP32-003 overloaded</span> <span className="text-srm-cyan">→</span> <span className="text-srm-green">reassigned to ESP32-005</span><span className="block text-[10px] text-srm-muted">Reason: lowest CPU + sufficient memory + normal temperature</span></div></section>; }

function DevicesView({ devices, onSelectDevice }: { devices: Device[]; onSelectDevice: (device: Device) => void }) { return <><PageHead title="Device Fleet" subtitle="Inspect every ESP32 node, its firmware, resources, network health, and current workload." /><section className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">{devices.map((device) => <button key={device.id} onClick={() => onSelectDevice(device)} className="rounded-xl border border-srm-line bg-srm-surface p-4 text-left transition-colors hover:border-srm-cyan/40 hover:bg-srm-surface2"><div className="flex items-start justify-between"><div><div className="font-mono text-sm text-srm-inkbright">{device.id}</div><div className="mt-1 font-mono text-[10px] text-srm-muted">{device.ipAddress} · {device.firmware}</div></div><StatusBadge status={device.status} /></div><div className="mt-4 grid grid-cols-2 gap-3"><ResourceStat label="CPU" value={`${device.cpuUsage}%`} valueNumber={device.cpuUsage} /><ResourceStat label="Memory" value={`${device.memoryUsage}%`} valueNumber={device.memoryUsage} /><ResourceStat label="Temperature" value={`${device.temperature}°C`} /><ResourceStat label="Queue" value={`${device.pendingRecords} records`} /></div><div className="mt-4 flex items-center justify-between border-t border-srm-line pt-3 font-mono text-[10px] text-srm-muted"><span>{device.currentTask}</span><ExternalLink className="size-3.5" /></div></button>)}</section></>; }

function MonitorView({ devices }: { devices: Device[] }) { const [metric, setMetric] = useState("CPU"); const [deviceId, setDeviceId] = useState("All Devices"); const selected = devices.find((device) => device.id === deviceId) ?? null; const value = selected ? metric === "CPU" ? selected.cpuUsage : metric === "Memory" ? selected.memoryUsage : metric === "Storage" ? selected.storageUsage : metric === "Temperature" ? selected.temperature : Math.abs(selected.wifiSignal) : metric === "Temperature" ? average(devices.map((device) => device.temperature)) : metric === "Network" ? 96 : metric === "Storage" ? average(devices.map((device) => device.storageUsage)) : metric === "Memory" ? average(devices.map((device) => device.memoryUsage)) : average(devices.map((device) => device.cpuUsage)); return <><PageHead title="Resource Monitor" subtitle="Continuous monitoring of embedded-device resources. Threshold values are demo configuration, not experimentally validated results." action={<select aria-label="Device selector" value={deviceId} onChange={(event) => setDeviceId(event.target.value)} className="h-9 rounded-md border border-srm-line bg-srm-surface px-3 font-mono text-xs text-srm-inkbright outline-none"><option>All Devices</option>{devices.map((device) => <option key={device.id}>{device.id}</option>)}</select>} /><div className="mb-3 flex flex-wrap gap-2">{["CPU", "Memory", "Storage", "Temperature", "Network"].map((item) => <Button key={item} variant={metric === item ? "default" : "outline"} size="sm" className={metric === item ? "bg-srm-cyan text-srm-ink hover:bg-srm-cyan/90" : "border-srm-line bg-srm-surface text-srm-muted hover:bg-srm-surface2 hover:text-srm-inkbright"} onClick={() => setMetric(item)}>{item}</Button>)}</div><div className="grid gap-2.5 lg:grid-cols-4">{[["Current", `${Number(value).toFixed(1)}${metric === "Temperature" ? "°C" : "%"}`], ["Average", metric === "Temperature" ? "46.2°C" : "48.6%"], ["Peak", metric === "Temperature" ? "71.2°C" : "94%"], ["Minimum", metric === "Temperature" ? "36.8°C" : "19%"]].map(([label, content]) => <div key={label} className="rounded-xl border border-srm-line bg-srm-surface p-4"><div className="font-mono text-[10px] uppercase text-srm-muted">{label}</div><div className="mt-2 font-mono text-2xl text-srm-cyan">{content}</div></div>)}</div><section className="mt-2.5 rounded-xl border border-srm-line bg-srm-surface p-4"><div className="flex items-center justify-between"><h2 className="font-display text-sm font-semibold">{metric} historical signal</h2><span className="font-mono text-[10px] text-srm-muted">last 30 minutes · threshold overlay enabled</span></div><div className="mt-4"><SignalChart color={metric === "Temperature" ? "var(--color-srm-amber)" : metric === "Storage" ? "var(--color-srm-violet)" : "var(--color-srm-cyan)"} /></div></section><ThresholdPanel /></>; }

function BackupView({ devices, onBackup }: { devices: Device[]; onBackup: (deviceId?: string) => void }) { return <><PageHead title="Data Backup" subtitle="Confirm central receipt before cleaning records from ESP32 local storage." action={<Button className="bg-srm-cyan text-srm-ink hover:bg-srm-cyan/90" onClick={() => onBackup()}><UploadCloud /> Backup all pending</Button>} /><BackupCard onBackup={() => onBackup()} onOpen={() => undefined} /><section className="mt-2.5 overflow-hidden rounded-xl border border-srm-line bg-srm-surface"><div className="border-b border-srm-line p-3"><h2 className="font-display text-sm font-semibold">Backup Activity</h2></div><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-xs"><thead className="font-mono text-[10px] uppercase text-srm-muted"><tr className="border-b border-srm-line"><th className="p-3">Timestamp</th><th>Device</th><th>Records</th><th>Data Size</th><th>Transfer</th><th>Confirmation</th><th>Cleanup</th><th>Duration</th></tr></thead><tbody className="font-mono text-[11px]">{backupRows.map((row) => <tr key={`${row.timestamp}-${row.deviceId}`} className="border-b border-srm-line/60 hover:bg-srm-surface2/50"><td className="p-3">{row.timestamp}</td><td>{row.deviceId}</td><td>{row.records}</td><td>{row.size}</td><td className={row.transfer === "Completed" ? "text-srm-green" : row.transfer === "Failed" ? "text-srm-red" : "text-srm-amber"}>{row.transfer}</td><td>{row.confirmation}</td><td>{row.cleanup}</td><td>{row.duration}</td></tr>)}</tbody></table></div></section><div className="mt-2.5 grid gap-2.5 sm:grid-cols-3">{devices.slice(0, 3).map((device) => <div key={device.id} className="rounded-xl border border-srm-line bg-srm-surface p-3"><div className="flex justify-between"><span className="font-mono text-xs">{device.id}</span><span className="font-mono text-[10px] text-srm-amber">{device.pendingRecords} pending</span></div><Button variant="outline" size="sm" className="mt-3 border-srm-line bg-srm-surface2 text-srm-muted hover:text-srm-inkbright" onClick={() => onBackup(device.id)}><UploadCloud /> Backup now</Button></div>)}</div></>; }

function TasksView({ tasks, devices, onSimulate }: { tasks: Task[]; devices: Device[]; onSimulate: () => void }) { return <><PageHead title="Task Allocation" subtitle="Assign workloads according to available device resources." action={<Button onClick={onSimulate} className="bg-srm-amber text-srm-ink hover:bg-srm-amber/90"><Zap /> Run allocation demo</Button>} /><section className="rounded-xl border border-srm-line bg-srm-surface p-4"><h2 className="font-display text-sm font-semibold">Task Allocation Engine</h2><div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[10px] sm:grid-cols-7">{["New Task", "Check Resources", "Evaluate CPU", "Evaluate Memory", "Evaluate Storage", "Select Suitable", "Assign Task"].map((label, index) => <div key={label} className={`rounded-md border p-2 text-center ${index === 6 ? "border-srm-green/30 bg-srm-green/10 text-srm-green" : "border-srm-line bg-srm-surface2/50"}`}>{label}</div>)}</div><div className="mt-4 rounded-md border border-srm-cyan/20 bg-srm-cyan/5 p-3 font-mono text-[11px] text-srm-cyan">{allocationReason(devices)}</div></section><section className="mt-2.5 overflow-hidden rounded-xl border border-srm-line bg-srm-surface"><div className="border-b border-srm-line p-3"><h2 className="font-display text-sm font-semibold">Active Tasks</h2></div><div className="overflow-x-auto"><table className="w-full min-w-[780px] text-left text-xs"><thead className="font-mono text-[10px] uppercase text-srm-muted"><tr className="border-b border-srm-line"><th className="p-3">Task ID</th><th>Task Name</th><th>Priority</th><th>Assigned Device</th><th>CPU</th><th>Memory</th><th>Status</th><th>Runtime</th></tr></thead><tbody className="font-mono text-[11px]">{tasks.map((task) => <tr key={task.id} className="border-b border-srm-line/60 hover:bg-srm-surface2/50"><td className="p-3 text-srm-cyan">{task.id}</td><td className="font-sans">{task.name}</td><td className={task.priority === "High" ? "text-srm-red" : task.priority === "Medium" ? "text-srm-amber" : "text-srm-muted"}>{task.priority}</td><td>{task.assignedDevice}</td><td>{task.cpuRequirement}%</td><td>{task.memoryRequirement}%</td><td><span className="rounded-full bg-srm-green/10 px-2 py-0.5 text-[10px] text-srm-green">{task.status}</span></td><td>{task.runtime}</td></tr>)}</tbody></table></div></section></>; }

function AlertsView({ alerts, onUpdate, onSelectDevice }: { alerts: Alert[]; onUpdate: (id: string, status: Alert["status"]) => void; onSelectDevice: (id: string) => void }) { const [selected, setSelected] = useState<Alert | null>(null); return <><PageHead title="Alert Management" subtitle="Resource thresholds surface overloads before they interrupt continuous operation." /><div className="grid gap-2.5 xl:grid-cols-[minmax(0,1fr)_320px]"><section className="overflow-hidden rounded-xl border border-srm-line bg-srm-surface"><div className="grid grid-cols-3 border-b border-srm-line font-mono text-[10px] uppercase text-srm-muted"><div className="p-3">Critical <span className="text-srm-red">1</span></div><div className="p-3">Warning <span className="text-srm-amber">2</span></div><div className="p-3">Informational <span className="text-srm-cyan">1</span></div></div><div>{alerts.map((alert) => <button key={alert.id} onClick={() => setSelected(alert)} className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-srm-line/60 p-3 text-left hover:bg-srm-surface2/50"><span className={`size-2 rounded-full ${alert.severity === "Critical" ? "bg-srm-red" : alert.severity === "Warning" ? "bg-srm-amber" : "bg-srm-cyan"}`} /><span className="min-w-0"><span className="block truncate text-sm">{alert.type}</span><span className="font-mono text-[10px] text-srm-muted">{alert.deviceId} · {alert.timestamp}</span></span><span className="font-mono text-[10px] text-srm-muted">{alert.status}</span></button>)}</div></section>{selected ? <AlertDetail alert={selected} onUpdate={onUpdate} onSelectDevice={onSelectDevice} onClose={() => setSelected(null)} /> : <div className="rounded-xl border border-dashed border-srm-line bg-srm-surface/40 p-5 text-sm text-srm-muted">Select an alert to inspect the current value, threshold, and action taken.</div>}</div></>; }

function ArchitectureView() { return <><PageHead title="System Architecture" subtitle="A layered view of the embedded resource-management lifecycle." /><section className="rounded-xl border border-srm-line bg-srm-surface p-4"><div className="grid gap-2.5 lg:grid-cols-5">{architectureLayers.map((layer, index) => <div key={layer.label} className="flex items-center gap-2 lg:block"><div className={`rounded-xl border p-3 ${toneClass[layer.tone]}`}><div className="font-mono text-[10px] uppercase tracking-wider">Layer {index + 1}</div><h2 className="mt-1 font-display text-sm font-semibold">{layer.label}</h2><div className="mt-3 space-y-1.5">{layer.items.map((item) => <div key={item} className="rounded-md border border-current/15 bg-srm-base/30 px-2 py-1.5 font-mono text-[10px]">{item}</div>)}</div></div>{index < architectureLayers.length - 1 && <ArrowRight className="mx-auto hidden size-4 shrink-0 text-srm-cyan lg:my-3 lg:block" />}</div>)}</div></section><div className="mt-2.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">{[["Processor Utilization", "Monitoring CPU load of each ESP32."], ["Memory Management", "Tracking available memory and reclaiming space after backup."], ["I/O Organization", "Collecting sensor data and transferring it to the central server."], ["Inter-Device Communication", "ESP32 devices communicate through Wi-Fi."], ["Storage Hierarchy", "Temporary local storage followed by permanent central storage."], ["Performance Monitoring", "Continuous CPU, memory, storage, temperature and transfer checks."], ["Resource Allocation", "Assigning tasks based on available resources."], ["Alerts", "Generating alerts when usage exceeds configured limits."]].map(([title, text]) => <div key={title} className="rounded-xl border border-srm-line bg-srm-surface p-3"><div className="font-display text-sm font-semibold">{title}</div><p className="mt-2 text-xs leading-relaxed text-srm-muted">{text}</p></div>)}</div></>; }

function LogsView() { const logs = ["22:01:42  ESP32-003  DATA_UPLOAD_STARTED", "22:01:43  ESP32-003  BACKUP_CONFIRMED", "22:01:43  ESP32-003  LOCAL_DATA_CLEANUP", "22:01:44  ESP32-004  TASK_ASSIGNED", "22:01:48  ESP32-002  CPU_WARNING", "22:01:51  ESP32-002  TASK_REASSIGNED", "22:02:04  ESP32-001  HEARTBEAT_RECEIVED"]; return <><PageHead title="Activity Logs" subtitle="Terminal-style event history from simulated device heartbeats and system actions." /><section className="rounded-xl border border-srm-line bg-srm-ink p-4 shadow-inner"><div className="mb-4 flex flex-wrap gap-2">{["All devices", "All events", "All severity", "Last 30 min"].map((filter) => <Button key={filter} variant="outline" size="sm" className="border-srm-line bg-srm-surface text-srm-muted hover:bg-srm-surface2 hover:text-srm-inkbright">{filter}</Button>)}</div><div className="space-y-2 font-mono text-xs leading-relaxed">{logs.map((log, index) => <div key={log} className={index === 4 ? "text-srm-amber" : index === 5 ? "text-srm-cyan" : "text-srm-muted"}><span className="mr-3 text-srm-line">[{String(index + 1).padStart(2, "0")}]</span>{log}</div>)}</div></section></>; }

function SettingsView() { const [saved, setSaved] = useState(false); return <><PageHead title="Settings" subtitle="Configure monitoring, alert thresholds, backup behavior, and task redistribution." /><div className="grid gap-2.5 lg:grid-cols-2">{[["Monitoring", [["Refresh interval", "5 seconds"], ["Data retention", "30 days"], ["Monitoring enabled", "On"]]], ["Alerts", [["CPU threshold", "85%"], ["Memory threshold", "80%"], ["Temperature threshold", "65°C"]]], ["Backup", [["Automatic backup", "On"], ["Backup interval", "60 seconds"], ["Retry count", "3"]]], ["Task Management", [["Automatic task allocation", "On"], ["Enable task redistribution", "On"], ["Cleanup after confirmation", "On"]]]].map(([title, values]) => <section key={title} className="rounded-xl border border-srm-line bg-srm-surface p-4"><h2 className="font-display text-sm font-semibold">{title}</h2><div className="mt-3 space-y-3">{(values as string[][]).map(([label, value]) => <label key={label} className="flex items-center justify-between gap-3 border-b border-srm-line/60 pb-3 text-xs"><span className="text-srm-muted">{label}</span><input aria-label={label} defaultValue={value} className="w-32 rounded-md border border-srm-line bg-srm-surface2 px-2 py-1.5 text-right font-mono text-[11px] text-srm-inkbright outline-none focus:border-srm-cyan/60" /></label>)}</div></section>)}</div><div className="mt-3 flex gap-2"><Button className="bg-srm-cyan text-srm-ink hover:bg-srm-cyan/90" onClick={() => { setSaved(true); toast.success("Settings saved"); }}><Check /> Save configuration</Button><Button variant="outline" className="border-srm-line bg-srm-surface text-srm-muted hover:bg-srm-surface2 hover:text-srm-inkbright" onClick={() => setSaved(false)}>Reset</Button>{saved && <span className="self-center font-mono text-xs text-srm-green">Configuration applied</span>}</div></>; }

function ThresholdPanel() { return <section className="mt-2.5 rounded-xl border border-srm-line bg-srm-surface p-4"><div className="flex items-center gap-2"><ShieldCheck className="size-4 text-srm-cyan" /><div><h2 className="font-display text-sm font-semibold">Resource Thresholds</h2><p className="font-mono text-[10px] text-srm-muted">Demo configuration values · not experimentally validated</p></div></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["CPU", "70%", "85%"], ["Memory", "75%", "85%"], ["Storage", "70%", "90%"], ["Temperature", "55°C", "65°C"]].map(([label, warning, critical]) => <div key={label} className="rounded-lg border border-srm-line bg-srm-surface2/50 p-3"><div className="font-mono text-xs">{label}</div><div className="mt-3 flex gap-2"><label className="min-w-0 flex-1"><span className="block text-[9px] text-srm-muted">Warning</span><input defaultValue={warning} className="mt-1 w-full rounded border border-srm-line bg-srm-base px-2 py-1 font-mono text-[10px] text-srm-amber" /></label><label className="min-w-0 flex-1"><span className="block text-[9px] text-srm-muted">Critical</span><input defaultValue={critical} className="mt-1 w-full rounded border border-srm-line bg-srm-base px-2 py-1 font-mono text-[10px] text-srm-red" /></label></div></div>)}</div></section>; }

function DeviceDetails({ device, onClose, onBackup }: { device: Device; onClose: () => void; onBackup: () => void }) { return <div className="fixed inset-0 z-40 flex justify-end bg-srm-ink/70" onClick={onClose}><aside className="h-full w-full max-w-lg overflow-y-auto border-l border-srm-line bg-srm-base p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><div className="flex items-center gap-2"><h2 className="font-display text-xl font-bold">{device.id}</h2><StatusBadge status={device.status} /></div><p className="mt-1 font-mono text-xs text-srm-muted">{device.ipAddress} · firmware {device.firmware}</p></div><Button aria-label="Close device details" variant="ghost" size="icon" className="text-srm-muted" onClick={onClose}><X /></Button></div><div className="mt-5 grid grid-cols-2 gap-2.5">{[["Uptime", device.uptime], ["Last sync", device.lastSeen], ["Wi-Fi signal", `${device.wifiSignal} dBm`], ["Current task", device.currentTask]].map(([label, value]) => <div key={label} className="rounded-lg border border-srm-line bg-srm-surface p-3"><div className="font-mono text-[10px] uppercase text-srm-muted">{label}</div><div className="mt-2 text-sm">{value}</div></div>)}</div><div className="mt-5 grid gap-2.5 sm:grid-cols-2">{[["CPU", `${device.cpuUsage}%`, <SignalChart key="cpu" />], ["Memory", `${device.memoryUsage}%`, <SignalChart key="mem" color="var(--color-srm-violet)" />], ["Storage", `${device.storageUsage}%`, <SignalChart key="storage" color="var(--color-srm-green)" />], ["Temperature", `${device.temperature}°C`, <SignalChart key="temp" color="var(--color-srm-amber)" />]].map(([label, value, chart]) => <div key={label as string} className="overflow-hidden rounded-lg border border-srm-line bg-srm-surface p-3"><div className="flex justify-between"><span className="font-mono text-[10px] uppercase text-srm-muted">{label}</span><span className="font-mono text-sm text-srm-cyan">{value}</span></div><div className="mt-2">{chart}</div></div>)}</div><div className="mt-5 rounded-lg border border-srm-line bg-srm-surface p-4"><div className="flex items-center justify-between"><div><h3 className="font-display text-sm font-semibold">Pending Sensor Records</h3><p className="mt-1 font-mono text-[10px] text-srm-muted">Queue size · oldest record 04:12 ago</p></div><span className="font-mono text-2xl text-srm-amber">{device.pendingRecords}</span></div><div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[10px] text-srm-muted"><span>Transfer rate <b className="text-srm-inkbright">42 rec/s</b></span><span>Est. time <b className="text-srm-inkbright">{Math.max(1, Math.ceil(device.pendingRecords / 42))} sec</b></span></div><Button className="mt-4 bg-srm-cyan text-srm-ink hover:bg-srm-cyan/90" onClick={onBackup}><UploadCloud /> Backup now</Button></div></aside></div>; }

function AlertDetail({ alert, onUpdate, onSelectDevice, onClose }: { alert: Alert; onUpdate: (id: string, status: Alert["status"]) => void; onSelectDevice: (id: string) => void; onClose: () => void }) { return <section className="rounded-xl border border-srm-red/25 bg-srm-surface p-4"><div className="flex items-start justify-between"><div><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-srm-red" /><h2 className="font-display text-sm font-semibold">{alert.severity.toUpperCase()} ALERT</h2></div><p className="mt-2 text-sm">{alert.type}</p></div><Button aria-label="Close alert detail" variant="ghost" size="icon" className="text-srm-muted" onClick={onClose}><X /></Button></div><div className="mt-4 space-y-3 font-mono text-xs"><div className="flex justify-between"><span className="text-srm-muted">Device</span><button className="text-srm-cyan" onClick={() => onSelectDevice(alert.deviceId)}>{alert.deviceId}</button></div><div className="flex justify-between"><span className="text-srm-muted">Current</span><span>{alert.currentValue}</span></div><div className="flex justify-between"><span className="text-srm-muted">Threshold</span><span className="text-srm-amber">{alert.threshold}</span></div><div className="flex justify-between"><span className="text-srm-muted">Detected</span><span>{alert.timestamp}</span></div></div><p className="mt-4 rounded-md border border-srm-line bg-srm-surface2/50 p-3 text-xs leading-relaxed text-srm-muted">{alert.message}</p><div className="mt-4 flex gap-2"><Button size="sm" className="bg-srm-cyan text-srm-ink hover:bg-srm-cyan/90" onClick={() => onUpdate(alert.id, "Acknowledged")}><Check /> Acknowledge</Button><Button variant="outline" size="sm" className="border-srm-line bg-srm-surface2 text-srm-muted hover:text-srm-inkbright" onClick={() => onUpdate(alert.id, "Resolved")}><ShieldCheck /> Resolve</Button></div></section>; }

function StatusBadge({ status }: { status: DeviceStatus }) { const tone = status === "Healthy" ? "green" : status === "Warning" ? "amber" : status === "Critical" ? "red" : "violet"; return <span className={`rounded-full px-2 py-0.5 text-[10px] ${toneClass[tone]}`}>{status}</span>; }
function Progress({ value, tone }: { value: number; tone: "cyan" | "amber" | "red" }) { return <div className="h-1 w-16 rounded-full bg-srm-surface2"><div className={`h-1 rounded-full ${tone === "red" ? "bg-srm-red" : tone === "amber" ? "bg-srm-amber" : "bg-srm-cyan"}`} style={{ width: `${value}%` }} /></div>; }
function ResourceStat({ label, value, valueNumber }: { label: string; value: string; valueNumber?: number }) { return <div><div className="font-mono text-[10px] text-srm-muted">{label}</div><div className="mt-1 font-mono text-xs">{value}</div>{valueNumber !== undefined && <Progress value={valueNumber} tone={valueNumber > 85 ? "red" : valueNumber > 70 ? "amber" : "cyan"} />}</div>; }
function Pipe({ label, tone }: { label: string; tone?: "cyan" | "green" }) { return <span className={`rounded-md border px-2 py-1 ${tone === "green" ? "border-srm-green/30 bg-srm-green/10 text-srm-green" : tone === "cyan" ? "border-srm-cyan/30 bg-srm-cyan/10 text-srm-cyan" : "border-srm-line bg-srm-surface2 text-srm-muted"}`}>{label}</span>; }
function MiniChart() { return <svg viewBox="0 0 100 24" className="mt-2 h-4 w-full" preserveAspectRatio="none"><polyline points="0,18 20,14 40,16 60,8 80,11 100,6" fill="none" stroke="var(--color-srm-cyan)" strokeWidth="1.5" /></svg>; }
function average(values: number[]) { return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0; }
function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }
function allocationReason(devices: Device[]) { const candidates = devices.filter((device) => device.status === "Healthy").sort((a, b) => a.cpuUsage - b.cpuUsage); const best = candidates[0]; return best ? `${best.id} selected · lowest CPU ${best.cpuUsage}% + sufficient memory ${best.memoryUsage}% + normal temperature ${best.temperature}°C` : "No healthy device currently meets the task requirements."; }
function runDemoScenario(setDevices: React.Dispatch<React.SetStateAction<Device[]>>, setTasks: React.Dispatch<React.SetStateAction<Task[]>>, setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>) { setDevices((current) => current.map((device) => device.id === "ESP32-003" ? { ...device, status: "Critical", cpuUsage: 94, memoryUsage: 91, temperature: 69.5, currentTask: "Blocked / overloaded" } : device)); setTasks((current) => current.map((task) => task.id === "TASK-005" ? { ...task, assignedDevice: "ESP32-005", status: "Reassigned" } : task)); setAlerts((current) => current.some((alert) => alert.type === "CPU utilization exceeded threshold" && alert.deviceId === "ESP32-003") ? current : [{ id: `ALT-${Date.now()}`, deviceId: "ESP32-003", type: "CPU utilization exceeded threshold", severity: "Critical", currentValue: "94%", threshold: "85%", timestamp: "now", status: "Open", message: "Device marked overloaded; task redistribution initiated." }, ...current]); }
