def success_response(data: dict, message: str = "", meta: dict = None) -> dict:
    """
    Standard success response wrapper.
    """
    return {
        "success": True,
        "message": message,
        "data": data,
        "meta": meta or {},
    }

def error_response(message: str, code: str = "ERROR", details: list = None) -> dict:
    """
    Standard error response wrapper.
    """
    return {
        "success": False,
        "message": message,
        "error": {
            "code": code,
            "details": details or [],
        },
    }