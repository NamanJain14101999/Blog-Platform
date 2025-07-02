# Real‑Time Blog Platform (React + Tailwind + Firebase)

A production‑ready blog CMS front‑end featuring

- 🔐 JWT‑style auth (Firebase Auth)
- ✏️ Markdown editor with live preview
- 🔔 Realtime SSE‑style admin notifications & chat (Firestore listeners)
- 📱 Responsive UI with custom Tailwind components
- 🗃️ Autosaved form drafts (sessionStorage)

---

## 🏗️ Tech Stack & Rationale

| Layer           | Choice                         | Why                                                                   |
| --------------- | ------------------------------ | --------------------------------------------------------------------- |
| Front‑end       | **React 18 + Vite**            | Fast dev reload, modern React features                                |
| Styling         | **Tailwind CSS 3**             | Utility‑first, dark‑mode built‑in                                     |
| Realtime + Auth | **Firebase** (open‑source SDK) | Zero server maintenance, WebSocket under the hood, generous free tier |

> 🔍 **Why not Azure?**  
> For this case study I needed a quick, cost‑free back‑end with realtime and auth.  
> Firebase Realtime listeners map 1‑to‑1 with the SSE/WebSocket requirements and include generous limits on the free Spark plan.

---
