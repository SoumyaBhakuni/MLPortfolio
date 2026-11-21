`report/README.md`

```markdown
# Industrial Training Report (`report/`)

The `report/` directory contains the **LaTeX** source files, bibliography, and chapter structure for the formal Industrial Training Report submitted for the Machine Learning Internship at **Happieloop Technologies** (**10 July – 9 August 2026**).

*(Note: A web-viewable PDF copy is also maintained at `frontend/public/Report-File.pdf` for display on the portfolio's Internship page.)*

---

## Folder & File Tree

```text
report/
│
├── README.md
├── main.tex                   # Master LaTeX document (preamble, title page, front matter, \include chapters)
├── references.bib             # BibTeX bibliography entries for datasets, frameworks, and papers
│
├── chapters/
│   ├── chapter1.tex           # Chapter 1: Introduction, Organization Profile & Internship Background
│   ├── chapter2.tex           # Chapter 2: Internship Objectives, Scope, Schedule & Work Undertaken
│   ├── chapter3.tex           # Chapter 3: Technologies, Development Environment & System Architecture
│   ├── chapter4.tex           # Chapter 4: Detailed Implementation of ML Tasks (Tasks 01–10)
│   ├── chapter5.tex           # Chapter 5: Experimental Results, Evaluation Metrics & Visualizations
│   └── chapter6.tex           # Chapter 6: Conclusion, Learning Outcomes, Limitations & Future Scope
│
└── output/                    # Compiled PDF output directory (kept separate from LaTeX sources)
    └── Industrial_Training_Report.pdf

```

---

## Chapter Responsibilities

| File | Scope & Contents |
| --- | --- |
| `main.tex` | Document class, formatting geometry, packages (`graphicx`, `booktabs`, `hyperref`, `listings`, `amsmath`), title page, certificate/declaration pages, abstract, table of contents, list of figures/tables, chapter includes, and bibliography. |
| `chapters/chapter1.tex` | Overview of industrial training, Happieloop Technologies profile, and problem context. |
| `chapters/chapter2.tex` | Training objectives, weekly work breakdown (10 July – 9 August 2026), and deliverables scope. |
| `chapters/chapter3.tex` | Full-stack software architecture (React, Flask, Scikit-learn, Statsmodels, TensorFlow) and dataset provenance methodology. |
| `chapters/chapter4.tex` | Mathematical formulation, preprocessing, and implementation details for Tasks 01 through 10. |
| `chapters/chapter5.tex` | Consolidated evaluation tables ($R^2$, RMSE, MAE, Accuracy, F1, AIC/BIC, Silhouette/Inertia), confusion matrices, and plots from `ml_projects/*/outputs/`. |
| `chapters/chapter6.tex` | Key takeaways, engineering lessons (caching, stationarity checks, fallback transparency), limitations, and future enhancements. |
| `references.bib` | Citations for Scikit-learn, Statsmodels, MobileNetV2, Iris/Digits/SMS Spam datasets, Flask, and React. |

---

## Compilation Instructions

### Option 1: Using `latexmk` (Recommended)

```bash
cd report
mkdir -p output
latexmk -pdf -outdir=output main.tex

```

Clean auxiliary build artifacts:

```bash
latexmk -c -outdir=output main.tex

```

### Option 2: Using `pdflatex` and `bibtex`

```bash
cd report
pdflatex main.tex
bibtex main
pdflatex main.tex
pdflatex main.tex

```

```

---