# APPENDIX_PLUGIN_LIFECYCLE.md  
**Plugin Lifecycle — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

This appendix defines the lifecycle of a plugin from installation to removal.

---

# 1. Lifecycle Stages

1. Installation  
2. Validation  
3. Activation  
4. Execution  
5. Deactivation  
6. Uninstallation  

---

# 2. Installation

- Manifest loaded  
- Permissions extracted  
- Entrypoint validated  
- Sandbox prepared  

---

# 3. Validation

- Manifest schema validated  
- Version compatibility checked  
- Permissions reviewed  
- Entrypoint integrity verified  

---

# 4. Activation

- Sandbox created  
- API injected  
- Hooks registered  
- UI elements added  

---

# 5. Execution

Plugins may:

- Listen to events  
- Read/write storage  
- Add graph nodes  
- Add timeline events  
- Generate insights  
- Register UI panels  
- Register commands  

---

# 6. Deactivation

- Hooks removed  
- UI elements removed  
- Sandbox destroyed  
- Memory released  

---

# 7. Uninstallation

- Plugin data deleted  
- Plugin settings removed  
- Plugin logs removed  

---

# 8. Lifecycle Hooks

Plugins may implement:

- `onInstall()`  
- `onActivate()`  
- `onDeactivate()`  
- `onUninstall()`  
- `onEvent(event)`  

---

# 9. Summary

The plugin lifecycle ensures predictable behavior, safe activation, and clean removal without affecting core systems.
