export type DeviceStatus = "Healthy" | "Warning" | "Critical" | "Offline";

export type Device = {
  id: string;
  name: string;
  status: DeviceStatus;
  ipAddress: string;
  firmware: string;
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
  temperature: number;
  wifiSignal: number;
  uptime: string;
  lastSeen: string;
  currentTask: string;
  pendingRecords: number;
};

export type Task = {
  id: string;
  name: string;
  priority: "High" | "Medium" | "Low";
  assignedDevice: string;
  cpuRequirement: number;
  memoryRequirement: number;
  status: "Running" | "Queued" | "Reassigned" | "Complete";
  runtime: string;
};

export type Alert = {
  id: string;
  deviceId: string;
  type: string;
  severity: "Critical" | "Warning" | "Informational";
  currentValue: string;
  threshold: string;
  timestamp: string;
  status: "Open" | "Acknowledged" | "Resolved";
  message: string;
};

export const initialDevices: Device[] = [
  { id: "ESP32-001", name: "ESP32-001", status: "Healthy", ipAddress: "10.0.1.11", firmware: "v2.4.1", cpuUsage: 38, memoryUsage: 52, storageUsage: 41, temperature: 41.2, wifiSignal: -48, uptime: "14d 08h 22m", lastSeen: "12 sec ago", currentTask: "Temperature Monitoring", pendingRecords: 96 },
  { id: "ESP32-002", name: "ESP32-002", status: "Healthy", ipAddress: "10.0.1.12", firmware: "v2.4.1", cpuUsage: 44, memoryUsage: 57, storageUsage: 55, temperature: 42.8, wifiSignal: -52, uptime: "9d 17h 04m", lastSeen: "9 sec ago", currentTask: "Environmental Collection", pendingRecords: 124 },
  { id: "ESP32-003", name: "ESP32-003", status: "Warning", ipAddress: "10.0.1.13", firmware: "v2.3.8", cpuUsage: 88, memoryUsage: 81, storageUsage: 68, temperature: 63.4, wifiSignal: -61, uptime: "6d 03h 46m", lastSeen: "7 sec ago", currentTask: "Diagnostics", pendingRecords: 210 },
  { id: "ESP32-004", name: "ESP32-004", status: "Healthy", ipAddress: "10.0.1.14", firmware: "v2.4.1", cpuUsage: 31, memoryUsage: 46, storageUsage: 33, temperature: 39.7, wifiSignal: -44, uptime: "18d 11h 50m", lastSeen: "5 sec ago", currentTask: "Data Upload", pendingRecords: 58 },
  { id: "ESP32-005", name: "ESP32-005", status: "Healthy", ipAddress: "10.0.1.15", firmware: "v2.4.1", cpuUsage: 29, memoryUsage: 41, storageUsage: 27, temperature: 38.9, wifiSignal: -47, uptime: "12d 20h 31m", lastSeen: "8 sec ago", currentTask: "Idle", pendingRecords: 42 },
  { id: "ESP32-006", name: "ESP32-006", status: "Critical", ipAddress: "10.0.1.16", firmware: "v2.2.9", cpuUsage: 94, memoryUsage: 92, storageUsage: 86, temperature: 71.2, wifiSignal: -70, uptime: "2d 06h 15m", lastSeen: "4 sec ago", currentTask: "Blocked / overloaded", pendingRecords: 318 },
  { id: "ESP32-007", name: "ESP32-007", status: "Healthy", ipAddress: "10.0.1.17", firmware: "v2.4.1", cpuUsage: 46, memoryUsage: 62, storageUsage: 49, temperature: 44.1, wifiSignal: -55, uptime: "7d 12h 09m", lastSeen: "11 sec ago", currentTask: "Sensor Aggregation", pendingRecords: 137 },
  { id: "ESP32-008", name: "ESP32-008", status: "Healthy", ipAddress: "10.0.1.18", firmware: "v2.4.1", cpuUsage: 24, memoryUsage: 35, storageUsage: 22, temperature: 36.8, wifiSignal: -42, uptime: "21d 01h 44m", lastSeen: "6 sec ago", currentTask: "Idle", pendingRecords: 22 },
];

export const initialTasks: Task[] = [
  { id: "TASK-001", name: "Temperature Monitoring", priority: "High", assignedDevice: "ESP32-001", cpuRequirement: 16, memoryRequirement: 12, status: "Running", runtime: "04h 18m" },
  { id: "TASK-002", name: "Environmental Data Collection", priority: "Medium", assignedDevice: "ESP32-002", cpuRequirement: 24, memoryRequirement: 18, status: "Running", runtime: "02h 41m" },
  { id: "TASK-003", name: "Sensor Data Aggregation", priority: "Medium", assignedDevice: "ESP32-007", cpuRequirement: 28, memoryRequirement: 22, status: "Running", runtime: "01h 56m" },
  { id: "TASK-004", name: "Data Upload", priority: "High", assignedDevice: "ESP32-004", cpuRequirement: 12, memoryRequirement: 10, status: "Running", runtime: "00h 38m" },
  { id: "TASK-005", name: "Device Diagnostics", priority: "Low", assignedDevice: "ESP32-003", cpuRequirement: 20, memoryRequirement: 16, status: "Queued", runtime: "—" },
];

export const initialAlerts: Alert[] = [
  { id: "ALT-001", deviceId: "ESP32-006", type: "CPU utilization exceeded threshold", severity: "Critical", currentValue: "94%", threshold: "85%", timestamp: "21:58:34", status: "Open", message: "New tasks blocked; device excluded from allocation." },
  { id: "ALT-002", deviceId: "ESP32-003", type: "Memory availability low", severity: "Warning", currentValue: "19% free", threshold: "25% free", timestamp: "21:55:12", status: "Acknowledged", message: "Backup cleanup recommended to reclaim local storage." },
  { id: "ALT-003", deviceId: "ESP32-006", type: "Device temperature elevated", severity: "Warning", currentValue: "71.2°C", threshold: "65°C", timestamp: "21:52:40", status: "Open", message: "Thermal headroom is below the configured warning threshold." },
  { id: "ALT-004", deviceId: "ESP32-003", type: "Task reassigned", severity: "Informational", currentValue: "TASK-007", threshold: "—", timestamp: "21:48:09", status: "Resolved", message: "Task moved to ESP32-005 with sufficient available resources." },
];

export const backupRows = [
  { timestamp: "22:01:42", deviceId: "ESP32-003", records: 120, size: "48 KB", transfer: "Completed", confirmation: "Confirmed", cleanup: "Cleaned", duration: "1.4s" },
  { timestamp: "22:00:18", deviceId: "ESP32-001", records: 86, size: "34 KB", transfer: "Completed", confirmation: "Confirmed", cleanup: "Cleaned", duration: "0.8s" },
  { timestamp: "21:59:56", deviceId: "ESP32-006", records: 64, size: "25 KB", transfer: "Retrying", confirmation: "Pending", cleanup: "Held", duration: "—" },
  { timestamp: "21:58:40", deviceId: "ESP32-007", records: 92, size: "37 KB", transfer: "Completed", confirmation: "Confirmed", cleanup: "Cleaned", duration: "1.1s" },
  { timestamp: "21:57:12", deviceId: "ESP32-002", records: 74, size: "29 KB", transfer: "Failed", confirmation: "Failed", cleanup: "Held", duration: "2.6s" },
];

export const architectureLayers = [
  { label: "Embedded Devices", items: ["Sensors", "CPU / RAM", "Local Storage", "Resource Monitor"], tone: "cyan" },
  { label: "Communication", items: ["Wi-Fi Network", "Heartbeat", "Encrypted Transfer"], tone: "violet" },
  { label: "Central Server", items: ["Data Receiver", "Backup Manager", "Task Allocation", "Alert Manager"], tone: "amber" },
  { label: "Storage", items: ["Central Database", "Backup Confirmation", "Retention Policy"], tone: "green" },
  { label: "Dashboard", items: ["Web Monitoring Interface", "Resource Views", "Activity Logs"], tone: "cyan" },
];