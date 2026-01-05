# Supporting Websites

This folder contains 4 web applications used in the research for data collection, annotation, and evaluation.

> **Note:** Dummy datasets for MongoDB are being prepared. Contact <ljwb5009@rjh.com.cn> for urgent requests.

## Prerequisites

- [MongoDB Community Edition](https://www.mongodb.com/try/download/community) with MongoDB Compass
- [Node.js and npm](https://nodejs.org/en/download/)

## Database Setup

1. Start MongoDB Compass and connect to `localhost:27017`

2. Create the following databases and collections:

| Database | Collections |
| -------- | ----------- |
| `IMIT_Img_Reports_news` | `counters`, `prosp_records`, `real_imgs_reports`, `test_img_reports`, `test_img_reports_upt2s`, `users` |
| `IMIT_Img_Reports_testing` | `real_imgs_reports`, `users` |
| `IMIT_multi_center_reports` | `multicenter_reports`, `multicenter_reports_news`, `test_img_reports_upt2s`, `users` |

> Collections can be empty initially. Import JSON data files when available.

## Installation & Running

For each website folder:

```bash
# Install dependencies
cd frontend && npm install --legacy-peer-deps
cd ../backend && npm install --legacy-peer-deps

# Start servers (in separate terminals)
cd frontend && npm start
cd backend && npm start
```

## User Guides

See the `screenshots` folder for detailed usage instructions for each website.
