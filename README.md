# Edge Core Monitor

Build: IoT-Based Smart Resource Management in Embedded Systems

Create a modern, responsive web application that acts as a central monitoring and resource-management dashboard for a network of ESP32-based IoT devices.

The application is based on this project concept:

ESP32 devices continuously collect sensor data.

Each device has limited CPU, memory, storage, and thermal capacity.

The system monitors CPU utilization, memory, storage, temperature, device status, and data-transfer status in real time.

Sensor data is transferred from ESP32 devices to a central server/database.

After successful backup confirmation, backed-up data is removed from the ESP32's local storage/memory.

The system detects overloaded devices and generates alerts.

New tasks can be assigned to devices that have sufficient available resources.

A central dashboard provides visibility into device health, data transfer, resource usage, alerts, and task allocation.

Do NOT make this look like a generic SaaS analytics dashboard. It should visually communicate embedded systems + IoT + real-time resource management.

1. Overall Design Language

Use a professional technical-control-room aesthetic.

Visual style

Dark modern interface by default.

Background: very dark charcoal/navy.

Cards: slightly lighter dark surfaces.

Use subtle borders and shadows.

Use a restrained accent palette:

cyan/blue for normal system activity

green for healthy/success states

amber for warnings

red for critical alerts

purple only for secondary analytics

Avoid excessive gradients.

Avoid oversized decorative elements.

Avoid generic stock imagery.

Use Lucide icons or another clean icon library.

Use monospace typography selectively for:

device IDs

IP addresses

CPU values

timestamps

system logs

Main typography should remain highly readable.

The dashboard should resemble a combination of:

IoT control center + embedded-system monitoring console + cloud resource manager.

2. Application Structure

Create these primary pages:

Dashboard

Devices

Device Details

Resource Monitor

Data Backup

Task Manager

Alerts

System Architecture

Activity Logs

Settings

Use a persistent left sidebar on desktop.

On mobile, collapse the sidebar into a hamburger navigation.

3. Sidebar Navigation

Create a left navigation sidebar with:

Header

Logo/icon:

SRM

Text:

Smart Resource Manager

Subtitle:

ESP32 IoT Control Center

Navigation

Dashboard

Devices

Resource Monitor

Data Backup

Task Manager

Alerts

System Architecture

Activity Logs

Settings

At the bottom show:

System Status

with a green indicator:

SYSTEM OPERATIONAL

Also show:

Last synchronization: 12 sec ago

4. Dashboard

The Dashboard is the primary screen.

Header:

IoT Resource Management

Subtitle:

Real-time monitoring and intelligent resource allocation for connected ESP32 devices.

Top-right controls:

Search

Refresh

Notification bell

User/profile icon

Add a small live indicator:

● LIVE

5. Dashboard KPI Cards

Create six high-quality metric cards.

Card 1 — Connected Devices

Example:

8

Connected Devices

Show:

7 Healthy
1 Warning

Include a small ESP32/device icon.

Card 2 — Average CPU

Example:

48.6%

Label:

Average CPU Utilization

Show a tiny trend chart.

Card 3 — Memory

Example:

61.2%

Label:

Average Memory Usage

Show:

38.8% available

Card 4 — Storage

Example:

42.8 GB

Label:

Central Storage Used

Show:

67% of allocated capacity

Card 5 — Data Backup

Example:

98.7%

Label:

Backup Success Rate

Show:

1,284 records backed up

Card 6 — Active Alerts

Example:

3

Label:

Active Alerts

Use warning/critical visual states.

6. Live Resource Overview

Create a large section:

Live Resource Overview

Display all connected ESP32 devices in a table.

Columns:

Device

Status

CPU

Memory

Storage

Temperature

Network

Data Queue

Current Task

Last Seen

Example devices:

ESP32-001
ESP32-002
ESP32-003
ESP32-004
ESP32-005
ESP32-006
ESP32-007
ESP32-008

Example status values:

Healthy
Warning
Critical
Offline

Use colored status badges.

CPU, memory and storage should have compact progress bars.

Temperature:

42.3°C

Network:

Connected

Data queue:

124 records

Current task:

Temperature Monitoring

7. Real-Time Resource Charts

Create a section with interactive charts.

CPU Utilization

Line chart showing CPU utilization for the last 30 minutes.

Allow selecting:

All Devices

ESP32-001

ESP32-002

ESP32-003

Memory Usage

Area/line chart showing memory consumption.

Temperature

Line chart showing temperature over time.

Add a visible threshold line.

For example:

Warning Threshold
Critical Threshold

Do not pretend these threshold values are measured project results. They are demo configuration values.

Storage

Bar chart:

Local ESP32 storage

Used

Available

Backed-up/reclaimed

8. Device Health Section

Create a card:

Device Health

Show circular/ring indicators:

Healthy
Warning
Critical
Offline

Example:

5 Healthy
2 Warning
1 Critical

Clicking a category filters the device table.

9. Data Backup Panel

Create a dedicated dashboard card:

Data Backup & Memory Management

Show a visual pipeline:

ESP32

↓

Sensor Data

↓

Wi-Fi

↓

Central Server

↓

Database

↓

Backup Confirmed

↓

Local Data Cleanup

Use animated connection indicators.

Show statistics:

Records waiting for backup

Records successfully backed up

Records deleted after confirmation

Failed transfers

Current transfer rate

Example:

1,284 records transferred

1,270 confirmed

1,270 local records cleaned

14 pending

10. Backup Activity Table

Columns:

Timestamp

Device

Records

Data Size

Transfer Status

Confirmation

Cleanup

Duration

Example:

22:01:42 | ESP32-003 | 120 | 48 KB | Completed | Confirmed | Cleaned | 1.4s

Statuses:

Completed
Pending
Failed
Retrying

Clicking a row opens detailed backup information.

11. Device Details Page

When a user clicks an ESP32 device, open a detailed device page.

Header:

ESP32-003

Status:

● Healthy

Show:

Device ID

IP address

Firmware version

Uptime

Last synchronization

Wi-Fi signal

Current task

12. Device Resource Cards

Show four large cards:

CPU

43.7%

with real-time chart.

Memory

58.4%

Show:

Available: 41.6%

Storage

62.3%

Show:

Available: 37.7%

Temperature

43.8°C

Show thermal status.

13. Device Data Queue

Show:

Pending Sensor Records

Example:

124 records

Display:

Queue size

Oldest record

Current transfer rate

Estimated transfer time

Include:

Backup Now

button.

14. Resource Monitor Page

This page should provide a more technical view.

Header:

Resource Monitor

Subtitle:

Continuous monitoring of embedded-device resources.

Create tabs:

CPU

Memory

Storage

Temperature

Network

Each tab should show:

Current value

Average

Peak

Minimum

Historical graph

Include a device selector.

15. Resource Threshold Configuration

Create a panel:

Resource Thresholds

For each resource:

CPU
Memory
Storage
Temperature

Provide:

Normal threshold

Warning threshold

Critical threshold

Use sliders or numeric inputs.

Include:

Save Threshold Configuration

Important:

These are configuration values for the prototype and must not be presented as experimentally validated values.

16. Task Manager

Create a dedicated task-management interface.

Header:

Task Allocation

Subtitle:

Assign workloads according to available device resources.

Show a list of active tasks.

Columns:

Task ID

Task Name

Priority

Assigned Device

CPU Requirement

Memory Requirement

Status

Runtime

Actions

Example tasks:

TASK-001 | Temperature Monitoring
TASK-002 | Environmental Data Collection
TASK-003 | Sensor Data Aggregation
TASK-004 | Data Upload
TASK-005 | Device Diagnostics

17. Resource-Based Task Allocation

Create a visual decision panel.

Title:

Task Allocation Engine

Show:

New Task

↓

Check Device Resources

↓

Evaluate CPU

↓

Evaluate Memory

↓

Evaluate Storage

↓

Evaluate Temperature

↓

Select Suitable Device

↓

Assign Task

Make the process visually understandable.

When a task is allocated, show a toast notification:

TASK-005 assigned to ESP32-004

18. Device Overload Simulation

For demonstration purposes, include a button:

Simulate Overload

When activated:

Select a device.

Increase CPU usage.

Increase memory usage.

Change status to Warning/Critical.

Generate an alert.

Show the device being excluded from new task allocation.

If possible, move a pending task to another healthy device.

Show an event:

ESP32-003 exceeded CPU threshold.

Then:

Device marked as overloaded.

Then:

TASK-007 reassigned to ESP32-005.

This should demonstrate the project's central resource-management concept.

19. Alerts Page

Create a professional alert-management page.

Categories:

Critical

Warning

Informational

Example alerts:

CPU utilization exceeded threshold
Memory availability below threshold
Device temperature elevated
Storage capacity low
Backup transfer failed
Device disconnected
Task reassigned

Each alert should show:

Timestamp

Device

Alert type

Current value

Threshold

Status

Actions:

Acknowledge
Resolve
View Device

20. Alert Detail

Clicking an alert should show a side panel.

Example:

CPU OVERLOAD

Device:

ESP32-003

Current CPU:

91.4%

Threshold:

85%

Detected:

21:58:34

Action taken:

New tasks blocked

Optional action:

Task redistribution initiated

21. System Architecture Page

This is extremely important because this project is also about computer architecture.

Create a visual architecture diagram.

The diagram should contain:

Layer 1 — Embedded Devices

Multiple ESP32 nodes:

ESP32-001
ESP32-002
ESP32-003
ESP32-004

Each node contains:

Sensors

CPU

RAM

Local Storage

Resource Monitor

↓

Layer 2 — Communication

Wi-Fi Network

↓

Layer 3 — Central Server

Components:

Data Receiver

Resource Monitor

Backup Manager

Task Allocation Engine

Alert Manager

↓

Layer 4 — Storage

Central Database

↓

Layer 5 — Dashboard

Web Monitoring Interface

Use animated arrows to show data movement.

22. Architecture Explanation

Below the diagram create cards for:

Processor Utilization

Monitoring CPU load of each ESP32.

Memory Management

Tracking available memory and reclaiming space after successful backup.

I/O Organization

Collecting sensor data and transferring it to the central server.

Inter-Device Communication

ESP32 devices communicate through Wi-Fi.

Storage Hierarchy

Temporary local storage followed by permanent central storage.

Performance Monitoring

Continuous monitoring of CPU, memory, storage, temperature and data transfer.

Resource Allocation

Assigning tasks based on available resources.

Alerts

Generating alerts when resource usage exceeds configured limits.

These concepts should directly reflect the project presentation.

23. Activity Logs

Create a terminal-style activity log.

Example:

22:01:42 ESP32-003 DATA_UPLOAD_STARTED
22:01:43 ESP32-003 BACKUP_CONFIRMED
22:01:43 ESP32-003 LOCAL_DATA_CLEANUP
22:01:44 ESP32-004 TASK_ASSIGNED
22:01:48 ESP32-002 CPU_WARNING
22:01:51 ESP32-002 TASK_REASSIGNED

Allow filtering by:

Device

Event

Severity

Time

24. Settings

Create settings for:

Monitoring

Refresh interval

Data retention

Monitoring enabled

Alerts

CPU threshold

Memory threshold

Storage threshold

Temperature threshold

Backup

Automatic backup

Backup interval

Retry count

Cleanup after confirmation

Task Management

Automatic task allocation

Enable task redistribution

Include clear Save/Reset controls.

25. Simulated Real-Time Data

Since this prototype may not initially have physical ESP32 hardware connected, implement a realistic simulation layer.

Create mock device data for at least 8 ESP32 devices.

The data should update periodically.

Example:

CPU changes gradually.

Memory changes gradually.

Temperature changes gradually.

Storage increases as sensor records accumulate.

Backup queue increases.

Successful backup decreases the queue and reclaims local storage.

Do NOT use completely random values every second. Values should change smoothly enough to appear realistic.

26. Device State Logic

Implement simple simulated logic:

Healthy

CPU < warning threshold
Memory below warning threshold
Temperature below warning threshold
Storage available

Warning

Any monitored resource exceeds warning threshold.

Critical

CPU/memory/storage/temperature reaches critical threshold.

Offline

No heartbeat received for a configured period.

27. Backup Logic

Implement this logic in the prototype:

Sensor Data Generated
        ↓
Stored Locally
        ↓
Added to Backup Queue
        ↓
Transfer to Server
        ↓
Server Confirms Receipt
        ↓
Mark Backup Successful
        ↓
Delete Local Copy
        ↓
Update Available Storage


Never delete local data before backup confirmation in the simulated logic.

If a transfer fails:

Transfer Failed
      ↓
Keep Local Data
      ↓
Retry
      ↓
Successful Confirmation
      ↓
Cleanup


28. Task Allocation Logic

Use a simple resource-aware scoring mechanism.

For each available device, evaluate:

CPU availability

Memory availability

Storage availability

Temperature status

Exclude:

Offline devices

Critical devices

Devices that do not meet task requirements

Then select the device with the best available resource score.

Display the reason for allocation.

Example:

ESP32-005 selected

Reason:

Lowest CPU utilization + sufficient memory + normal temperature

This makes the task-allocation feature understandable instead of pretending to use an unexplained AI algorithm.

29. Dashboard Interactions

Make the UI interactive.

Examples:

Clicking a device opens Device Details.

Clicking CPU chart filters the selected device.

Clicking an alert opens alert details.

Clicking Backup opens Data Backup.

Clicking a task opens Task Details.

Clicking a status card filters devices.

Clicking Simulate Overload demonstrates resource management.

Clicking Backup Now triggers simulated backup.

Clicking Assign Task runs the allocation algorithm.

Use toast notifications for actions.

30. Empty/Error/Loading States

Create proper states for:

No devices

Device offline

Backup failure

No alerts

Loading dashboard

Server unavailable

No pending tasks

Do not leave blank spaces.

31. Responsive Design

The application must work properly on:

Desktop

Laptop

Tablet

Mobile

Desktop:

Sidebar + large dashboard.

Tablet:

Collapsible sidebar.

Mobile:

Bottom or hamburger navigation.

Tables should become horizontally scrollable cards or responsive layouts.

32. Technical Implementation

Use:

React

TypeScript

Tailwind CSS

shadcn/ui

Lucide icons

Recharts for charts

Structure the code into reusable components.

Suggested components:

Sidebar
TopBar
MetricCard
DeviceTable
DeviceStatusBadge
ResourceChart
ResourceGauge
BackupPipeline
AlertPanel
TaskTable
ArchitectureDiagram
ActivityLog
DeviceDetails
ThresholdControl

Use clean component architecture.

33. Data Model

Create mock data structures for:

Device

id
name
status
ipAddress
firmware
cpuUsage
memoryUsage
storageUsage
temperature
wifiSignal
uptime
lastSeen
currentTask
pendingRecords


Task

id
name
priority
assignedDevice
cpuRequirement
memoryRequirement
status
runtime


Alert

id
deviceId
type
severity
currentValue
threshold
timestamp
status
message


Backup

id
deviceId
timestamp
recordCount
dataSize
transferStatus
confirmationStatus
cleanupStatus
duration


34. Visual Details

Use subtle animations:

live pulse indicator

chart updates

device status changes

backup progress

data-transfer animation

alert appearance

task reassignment

Do not over-animate the application.

The dashboard should feel like a serious monitoring system.

35. Important Product Principle

The website should communicate this complete lifecycle:

MONITOR → DETECT → BACKUP → CLEAN → ALERT → ALLOCATE → CONTINUE

Make this lifecycle visually apparent throughout the application.

The central concept is:

Smart Resources, Continuous Operation.

Secondary tagline:

Monitor. Backup. Optimize.

36. Demo Scenario

Add a small optional Demo Mode control.

When Demo Mode is activated, automatically demonstrate:

ESP32 devices operating normally.

Sensor data accumulating.

Backup queue increasing.

Backup transfer beginning.

Server confirmation occurring.

Local data being cleaned.

Available memory/storage increasing.

One ESP32 becoming overloaded.

Alert being generated.

New task allocation avoiding the overloaded device.

Task being assigned to another available ESP32.

Dashboard returning to a stable state.

This should make the application useful during a project demonstration/viva.

37. Do Not Do These Things

Do not:

make it look like a generic finance dashboard

use stock photos

use fake AI branding everywhere

claim machine learning is implemented

claim cloud infrastructure is implemented unless actually connected

claim real ESP32 hardware is connected unless there is an actual integration

invent experimental performance numbers

use meaningless random charts

use excessive gradients

overcrowd every screen

hide important resource values behind unnecessary interactions

Clearly label simulated values as demo/simulation data where appropriate.

38. Final Dashboard Goal

When someone opens the application, they should immediately understand:

There are multiple ESP32 devices collecting data.

The system continuously monitors their CPU, memory, storage and temperature.

Sensor data is backed up to a central server.

Local data is cleaned only after successful backup.

Overloaded devices generate alerts.

Tasks can be moved to devices with available resources.

The website should feel like a functional prototype of the actual IoT resource-management system, suitable for a college project demonstration, technical review, and viva.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c67019e7-76e9-44eb-a7e0-961da0792c7d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
