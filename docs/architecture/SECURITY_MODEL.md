# SECURITY_MODEL.md  
**Security & Data Protection Model — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

Life.OS is designed from the ground up to be private, local‑first, and user‑controlled. The Security Model defines how data is stored, processed, synced, and protected across the entire system. It ensures that Life.OS remains trustworthy, transparent, and safe for long‑term personal use.

This document outlines the security architecture, data flow guarantees, threat model, encryption strategy, sync protections, and user‑controlled privacy mechanisms.

---

# 1. Security Principles

Life.OS is built on five foundational principles:

### Local‑First
All data and intelligence run locally by default. Nothing leaves the device unless the user explicitly enables sync.

### User‑Controlled
Users decide:
- What is stored  
- What is synced  
- What is analyzed  
- What is deleted  

### Transparent
Users can inspect:
- What the LLM processed  
- What insights were generated  
- What data was synced  
- What notifications were triggered  

### Minimal Attack Surface
No external APIs, no telemetry, no remote inference, no third‑party analytics.

### Defense‑in‑Depth
Multiple layers of protection:
- Local isolation  
- IndexedDB sandboxing  
- Optional encryption  
- Strict sync boundaries  
- No remote execution  

---

# 2. Data Storage Security

Life.OS stores all data in **IndexedDB**, which is:
- Sandboxed per domain  
- Protected by browser security  
- Isolated from other apps  
- Not accessible to external scripts  

### Data Stored Locally
- Journal entries  
- Notes  
- Tasks  
- Workbooks  
- Insights  
- Embeddings  
- Graph nodes/edges  
- Timeline events  
- Settings  
- Notifications  

### Optional Encryption (Future)
- AES‑GCM encryption for IndexedDB  
- User‑provided passphrase  
- Key stored in memory only  

---

# 3. Local LLM Security

The Local LLM is fully isolated.

### Guarantees
- No network access  
- No external API calls  
- No telemetry  
- No remote inference  
- No cloud logging  

### Model Execution
- Runs inside WebGPU sandbox  
- Cannot access filesystem  
- Cannot access network  
- Cannot access browser cookies  

### Model Weights
- Stored locally  
- Loaded into GPU memory  
- Never transmitted  

---

# 4. Sync Security

Sync is **optional** and **off by default**.

### Transport Security
- HTTPS required  
- TLS 1.2+  
- HSTS recommended  

### Authentication
- JWT tokens  
- Short‑lived tokens  
- Refresh tokens stored securely  

### Data Sent to Backend
Only:
- Journal entries  
- Notes  
- Tasks  
- Workbooks  
- Insights (optional)  
- Graph nodes/edges (optional)  

### Data Never Sent
- Embeddings  
- LLM intermediate outputs  
- Emotional/cognitive metadata (unless user opts in)  
- Local LLM prompts  
- Local LLM responses  

### Sync Queue Protections
- Operation‑based sync  
- Idempotent operations  
- Conflict resolution  
- Retry logic  
- No partial writes  

---

# 5. Threat Model

Life.OS assumes the following threats:

### Threats Mitigated
- Network interception  
- Cloud inference leakage  
- Third‑party analytics  
- Cross‑site scripting (XSS)  
- Cross‑site request forgery (CSRF)  
- Unauthorized sync  
- Data exfiltration via LLM  

### Threats Out of Scope
- Physical device compromise  
- OS‑level malware  
- Browser‑level vulnerabilities  
- User‑installed malicious extensions  

### Mitigation Strategies
- Local‑only processing  
- No remote inference  
- No external scripts  
- Strict Content Security Policy (CSP)  
- No inline scripts  
- No eval()  
- Sandboxed Web Workers  

---

# 6. Content Security Policy (CSP)

Life.OS enforces a strict CSP:
```
default-src 'self'; 
script-src 'self'; 
style-src 'self' 'unsafe-inline'; 
img-src 'self' data:; 
connect-src 'self'; 
font-src 'self'; 
worker-src 'self'; 
frame-ancestors 'none';
```

### Effects
- No external scripts  
- No remote fonts  
- No CDN assets  
- No third‑party analytics  
- No cross‑origin requests  

---

# 7. Service Worker Security

The service worker:
- Caches only static assets  
- Never caches sensitive data  
- Does not intercept POST requests  
- Does not store user data  
- Does not log anything  

### Protections
- Versioned cache  
- Automatic invalidation  
- No external fetches  

---

# 8. Module Isolation

Each module is isolated through:
- Route boundaries  
- State boundaries  
- IndexedDB table boundaries  
- Graph node type boundaries  
- Timeline event type boundaries  

### Benefits
- No module can corrupt another  
- No accidental cross‑module writes  
- Clear auditability  

---

# 9. Intelligence Security

Life.Coach operates under strict constraints.

### Allowed
- Local analysis  
- Local embeddings  
- Local insights  
- Local reviews  

### Not Allowed
- Sending text to external AI  
- Sending embeddings to external AI  
- Sending insights to external AI  
- Using cloud inference  

### Transparency
Users can inspect:
- What was analyzed  
- What insights were generated  
- What data was used  

---

# 10. User Controls

Users can control:

### Privacy
- Strict mode  
- Insight toggles  
- LLM model selection  
- Data retention rules  

### Sync
- Enable/disable  
- Sync interval  
- Sync scope  

### Notifications
- Per‑module toggles  
- Quiet hours  

### Data
- Export  
- Import  
- Delete  
- Factory reset  

---

# 11. Data Deletion Guarantees

When the user deletes data:
- It is removed from IndexedDB  
- It is removed from the Life Graph  
- It is removed from the Timeline  
- It is removed from insights  
- It is removed from embeddings  
- It is removed from caches  
- It is removed from sync queue  

### Sync Deletion
If sync is enabled:
- Delete operation is queued  
- Backend deletes entity  
- Confirmation returned  

---

# 12. Future Enhancements

- Full local encryption  
- Passcode/biometric lock  
- Secure enclave key storage  
- Per‑entry privacy levels  
- Encrypted sync  
- Multi‑device secure mesh sync  

---

# 13. Summary

The Life.OS Security Model ensures that all data, intelligence, and insights remain private, local, and user‑controlled. With strict isolation, optional sync, no external inference, and transparent controls, Life.OS provides a secure foundation for long‑term personal growth and self‑understanding.
