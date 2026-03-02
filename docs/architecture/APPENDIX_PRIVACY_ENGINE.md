Here is **APPENDIX_PRIVACY_ENGINE.md** in clean, copy‑and‑paste‑ready Markdown, matching the exact formatting you’ve been using and ending with your separator.

---

# APPENDIX_PRIVACY_ENGINE.md  
**Privacy Engine — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

The Privacy Engine enforces data protection, access control, encryption, and user‑controlled visibility across Life.OS. It ensures that all personal data—entries, tasks, habits, insights, embeddings, graph data, and long‑term memory—remains private, local‑first, and fully under the user’s control.

## Purpose

The Privacy Engine guarantees that Life.OS operates with strict privacy boundaries. It ensures that data is never shared without explicit permission, that all sensitive operations are sandboxed, and that the user maintains full ownership and control over their information.

## Privacy Architecture

The engine uses a multi‑layered architecture:

- **Local‑first design** — all data stays on the device unless explicitly synced  
- **Encryption layer** — encrypts data at rest and in transit  
- **Access control layer** — enforces permissions for plugins and modules  
- **Visibility layer** — controls what data is shown in UI and reviews  
- **Redaction layer** — hides sensitive content when needed  
- **Audit layer** — logs access and permission changes  

This architecture ensures privacy at every level of the system.

## Privacy Data Model

The engine tracks:

- **data_id** — unique identifier  
- **data_type** — entry, task, habit, insight, embedding, graph node, etc.  
- **visibility_level** — private, protected, shared, redacted  
- **encryption_status** — encrypted, decrypted in memory  
- **access_permissions** — which modules or plugins can read/write  
- **audit_log** — history of access events  
- **retention_policy** — how long data is kept  

## Visibility Levels

The engine supports multiple visibility modes:

- **Private** — visible only to the user  
- **Protected** — visible to core engines but not plugins  
- **Shared** — visible to selected plugins or sync targets  
- **Redacted** — content hidden, metadata preserved  

Users can change visibility at any time.

## Encryption

The engine uses:

- **Local encryption at rest** — database, embeddings, graph data  
- **In‑memory decryption** — decrypted only when needed  
- **End‑to‑end encryption** — for sync operations  
- **Key rotation** — periodic regeneration of encryption keys  
- **Zero‑knowledge design** — no external service can read user data  

Encryption is automatic and transparent.

## Access Control

The engine enforces strict permissions:

- Core engines have read‑only or read‑write access depending on function  
- Plugins must request explicit permissions in their manifest  
- Sensitive data (entries, insights, memory) defaults to protected  
- Graph and embedding data require elevated permissions  
- No plugin can access raw journal text without explicit approval  

Access control is enforced at the API layer.

## Redaction System

The engine supports redaction for:

- Sensitive journal entries  
- Personal identifiers  
- Emotional or cognitive metadata  
- Life Moments involving private topics  
- Review content that includes sensitive details  

Redaction can be automatic (context‑based) or manual.

## Privacy Insights

The engine generates insights such as:

- sensitive_content_detected  
- plugin_permission_request  
- data_visibility_change  
- encryption_key_rotation  
- redaction_applied  
- privacy_risk_detected  

These insights help the user maintain awareness of privacy‑related events.

## Privacy in Reviews

The engine ensures:

- Sensitive content is redacted in daily/weekly/monthly/yearly reviews  
- Identity themes avoid exposing private details  
- Emotional or cognitive insights are summarized without revealing specifics  
- Life Moments involving sensitive topics are anonymized or hidden  

Users can override defaults.

## Privacy in the Graph

The engine controls:

- Which nodes are visible  
- Which edges are exposed  
- Whether sensitive concepts appear in clusters  
- Whether Life Moments appear in graph queries  
- Whether embeddings for sensitive content are included  

Graph visibility is granular and user‑controlled.

## Privacy in Automations

The engine ensures:

- Automations cannot access sensitive content unless permitted  
- Automations cannot leak data to plugins or external systems  
- Automations involving sensitive triggers require explicit approval  
- All automation actions are logged  

This prevents accidental data exposure.

## Audit Logging

The engine logs:

- Access events  
- Permission changes  
- Plugin activity  
- Sync operations  
- Redaction events  
- Encryption key rotations  

Audit logs are encrypted and user‑visible.

## Data Retention and Deletion

The engine supports:

- **Soft delete** — recoverable for a period  
- **Hard delete** — permanent removal  
- **Selective deletion** — entries, insights, embeddings, graph nodes  
- **Retention policies** — auto‑delete after a set time  
- **Secure wipe** — cryptographic erasure  

Users have full control over data lifecycle.

## Performance

The engine is optimized for:

- Low‑overhead encryption  
- Fast permission checks  
- Efficient redaction  
- Scalable audit logs  
- Minimal performance impact on intelligence engines  

Privacy does not compromise speed.

## Summary

The Privacy Engine ensures that Life.OS remains private, secure, and user‑controlled. It enforces encryption, access control, redaction, visibility rules, and audit logging across all modules, protecting the user’s data and identity at every level.
