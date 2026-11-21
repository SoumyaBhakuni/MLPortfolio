import os
import subprocess
import sys
import time
from pathlib import Path

ML_PROJECTS_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = ML_PROJECTS_DIR.parent

TASK_SCRIPTS = [
    ("01_EDA", ML_PROJECTS_DIR / "01_EDA" / "src" / "eda.py"),
    ("02_Linear_Regression", ML_PROJECTS_DIR / "02_Linear_Regression" / "src" / "linear_regression.py"),
    ("03_Image_Classification", ML_PROJECTS_DIR / "03_Image_Classification" / "src" / "image_classification.py"),
    ("04_KMeans_Clustering", ML_PROJECTS_DIR / "04_KMeans_Clustering" / "src" / "kmeans.py"),
    ("05_Decision_Tree", ML_PROJECTS_DIR / "05_Decision_Tree" / "src" / "decision_tree.py"),
    ("06_Naive_Bayes", ML_PROJECTS_DIR / "06_Naive_Bayes" / "src" / "naive_bayes.py"),
    ("07_PCA", ML_PROJECTS_DIR / "07_PCA" / "src" / "pca.py"),
    ("08_Neural_Network", ML_PROJECTS_DIR / "08_Neural_Network" / "src" / "neural_network.py"),
    ("09_ARIMA", ML_PROJECTS_DIR / "09_ARIMA" / "src" / "arima.py"),
    ("10_SVM", ML_PROJECTS_DIR / "10_SVM" / "src" / "svm.py"),
]


def resolve_python_executable() -> Path:
    """Prefer an existing virtual environment's python binary if present."""
    candidate_venv_dirs = [
        ML_PROJECTS_DIR / ".venv",
        ML_PROJECTS_DIR / "venv",
        PROJECT_ROOT / ".venv",
        PROJECT_ROOT / "venv",
    ]

    for venv_dir in candidate_venv_dirs:
        if os.name == "nt":
            python_bin = venv_dir / "Scripts" / "python.exe"
        else:
            python_bin = venv_dir / "bin" / "python"

        if python_bin.is_file():
            return python_bin

    return Path(sys.executable)


def main(stop_on_error: bool = False) -> int:
    python_exe = resolve_python_executable()
    print(f"Using Python interpreter: {python_exe}")

    failures = []
    start_all = time.perf_counter()

    for task_name, script_path in TASK_SCRIPTS:
        if not script_path.exists():
            print(f"[SKIP] {task_name}: script not found at {script_path}")
            failures.append((task_name, "Missing script"))
            if stop_on_error:
                break
            continue

        print(f"\n=== Running {task_name} ({script_path.relative_to(PROJECT_ROOT)}) ===")
        t0 = time.perf_counter()
        result = subprocess.run(
            [str(python_exe), str(script_path)],
            cwd=str(PROJECT_ROOT),
            text=True,
        )
        elapsed = time.perf_counter() - t0

        if result.returncode == 0:
            print(f"[OK] {task_name} completed in {elapsed:.2f}s")
        else:
            print(f"[FAIL] {task_name} exited with code {result.returncode} ({elapsed:.2f}s)")
            failures.append((task_name, f"Exit code {result.returncode}"))
            if stop_on_error:
                break

    total_elapsed = time.perf_counter() - start_all
    print(f"\nFinished in {total_elapsed:.2f}s. Total tasks: {len(TASK_SCRIPTS)}, Failed: {len(failures)}")

    if failures:
        print("Failed tasks:")
        for name, reason in failures:
            print(f"  - {name}: {reason}")
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main(stop_on_error="--stop-on-error" in sys.argv))