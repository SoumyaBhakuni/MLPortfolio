### 6. `documentation/README.md`

```markdown
# Technical Documentation (`documentation/`)

The `documentation/` directory serves as the centralized technical reference hub for **MLPortfolio**, documenting system architecture, REST API contracts, dataset provenance, model lifecycle rules, and environment setup for the **Happieloop Technologies** Industrial Training submission (**10 July – 9 August 2026**).

---

## Documentation Structure

```text
documentation/
│
├── README.md                  # Documentation index and navigation guide (this file)
│
├── architecture/
│   ├── system-architecture.md # End-to-end React + Flask + ML modules architecture
│   ├── backend-architecture.md# Flask app factory, blueprints, services, and error handling
│   ├── frontend-architecture.md# React Router pages, reusable components, and state flow
│   └── api-architecture.md    # JSON & FormData request/response lifecycle and timeouts
│
├── api/
│   └── api-reference.md       # Complete specification of /api/health, /api/tasks, and Tasks 01–10
│
├── datasets/
│   └── dataset-sources.md     # Provenance, schema, sample counts, and synthetic disclosures
│
├── models/
│   └── model-inventory.md     # Artifact paths, training scripts, caching behavior, and metrics
│
├── development/
│   ├── installation.md        # Clean-machine setup for Python, Node.js, and LaTeX
│   ├── environment-setup.md   # Backend/frontend environment variables and CORS configuration
│   └── troubleshooting.md     # Common fixes for CORS, timeouts, TensorFlow weights, and joblib versions
│
└── assets/
    └── screenshots/           # UI screenshots referenced in documentation, report, and slides

```

---

## Quick Cross-References

* **System & API Implementation:** See [suspicious link removed] and [suspicious link removed].
* **Task Scripts & Notebooks:** See [suspicious link removed] and individual task `README.md` files under `ml_projects/01_EDA/` through `ml_projects/10_SVM/`.
* **Serialized Models:** See [suspicious link removed].
* **Academic Deliverables:** See [suspicious link removed] and [suspicious link removed].

```

---

