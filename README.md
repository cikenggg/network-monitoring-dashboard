# Network Monitoring Dashboard

A real-time network monitoring dashboard built using Flask, SQLite and JavaScript.

## Features

✅ Real device monitoring using ICMP ping  
✅ Real-time UP/DOWN status  
✅ SQLite alert history  
✅ Network topology visualization  
✅ Device status dashboard  
✅ CPU usage simulation  
✅ Alert detection system  

## Architecture
Network Devices
|
|
ICMP Ping
|
|
Flask REST API
|
|
SQLite Database
|
|
JavaScript Dashboard
## Devices Monitored

| Device | IP | Type |
|---|---|---|
| Access Point | 192.168.1.1 | Access Point |
| Laptop | 192.168.1.211 | Laptop |
| Xiaomi | 192.168.1.250 | Phone |
| Nubia | 192.168.1.187 | Phone |

## Technology Stack

Backend:
- Python Flask
- SQLite

Frontend:
- HTML
- CSS
- JavaScript
- Vis Network

## API Endpoint

### Get Devices


Example response:

```json
{
"name":"Xiaomi",
"ip":"192.168.1.250",
"status":"UP"
}

GET /api/alerts
