# Changelog

All notable changes to the Examination Center Allotment Portal are documented here.

## [1.0.0] - 2026-09-29

### Added
- **Proximity Engine**: 10 Bihar examination centers with road distance matrix and automatic overflow routing.
- **Atomic Seat Reservation**: MongoDB conditional expression (`$expr: { $lt: ['$filled_count', '$capacity'] }`) preventing race conditions.
- **Zero-Downtime Memory Store**: Automatic fallback if MongoDB Atlas DNS SRV or network is unavailable.
- **Multi-Step Wizard**: 3-step candidate registration with real-time age calculator, seat meters, and review step.
- **Interactive Confetti**: 60fps canvas confetti celebration on successful center allocation.
- **Cryptographic Admit Card**: QR verification code, barcode, authentic watermark, and print-ready A4 CSS.
- **Candidate Recovery Portal**: Dual-tab recovery by Roll Number or Phone + Date of Birth.
- **Admin Command Center**: Real-time KPI analytics, center occupancy meters, candidate transfer modal, seat release on deletion, and 1-click CSV export.
- **Live Center Radar**: Real-time search by city/code and status filtering on homepage.
- **Modern Glassmorphic Design**: Curated HSL color palette, dark mode accents, micro-animations, and fluid responsive layout.

### Optimized
- Zero TypeScript errors across all components and server actions.
- Optimized bundle size with zero external animation libraries.
