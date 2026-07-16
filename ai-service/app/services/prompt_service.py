from pathlib import Path
from app.core.logging import logger

PROMPTS_DIR = Path(__file__).parent.parent / "prompts"

def load_prompt(name: str) -> str:
    """
    Load a prompt template by name (without extension).
    Looks for <name>.txt in the prompts directory.
    """
    path = PROMPTS_DIR / f"{name}.txt"
    if not path.exists():
        logger.error(f"Prompt file not found: {path}")
        raise FileNotFoundError(f"Prompt not found: {name}")
    return path.read_text(encoding="utf-8")