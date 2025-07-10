import logging
import os
from pathlib import Path
from logging.handlers import RotatingFileHandler

class IgnoreLogChangeDetectedFilter(logging.Filter):
    def filter(self, record: logging.LogRecord):
        return "Detected file change in" not in record.getMessage()

def setup_logging(format: str = None):
    """
    Configure logging for the application.
    Reads LOG_LEVEL and LOG_FILE_PATH from environment (defaults: INFO, logs/application.log).
    Ensures log directory exists, and configures both file and console handlers.
    """
    # Determine log directory and default file path
    base_dir = Path(__file__).parent
    log_dir = base_dir / "logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    default_log_file = log_dir / "application.log"

    # Get log level and file path from environment
    log_level_str = os.environ.get("LOG_LEVEL", "INFO").upper()
    log_level = getattr(logging, log_level_str, logging.INFO)
    log_file_path = Path(os.environ.get(
        "LOG_FILE_PATH", str(default_log_file)))

    # Ensure log_file_path is within the project's logs directory to prevent path traversal
    log_dir_resolved = log_dir.resolve()
    resolved_path = log_file_path.resolve()
    if not str(resolved_path).startswith(str(log_dir_resolved) + os.sep):
        raise ValueError(
            f"LOG_FILE_PATH '{log_file_path}' is outside the trusted log directory '{log_dir_resolved}'"
        )
    # Ensure parent dirs exist for the log file
    resolved_path.parent.mkdir(parents=True, exist_ok=True)

    # Configure logging handlers and format
    file_handler = RotatingFileHandler(
        resolved_path,
        maxBytes=10 * 1024 * 1024,  # 10 MB
        backupCount=5  # Optional: Keep up to 5 backup log files
    )

    logging.basicConfig(
        level=log_level,
        format=format or "%(asctime)s - %(levelname)s - %(name)s - %(filename)s:%(lineno)d - %(message)s",
        handlers=[
            file_handler,
            logging.StreamHandler()
        ],
        force=True
    )
    
    # Ignore log file's change detection
    for handler in logging.getLogger().handlers:
        handler.addFilter(IgnoreLogChangeDetectedFilter())

    # Initial debug message to confirm configuration
    logger = logging.getLogger(__name__)
    logger.debug(f"Log level set to {log_level_str}, log file: {resolved_path}")