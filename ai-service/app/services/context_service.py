from app.services.embedding_service import EmbeddingService
from app.services.faiss_service import FaissService
from app.core.logging import logger
from typing import List, Dict, Any, Optional
from collections import defaultdict
import time

class ContextService:
    def __init__(self):
        self.embedder = EmbeddingService()
        self.faiss = FaissService()
        # Ensure index is initialized with correct dimension
        if self.faiss.count() == 0:
            dim = self.embedder.get_dimension()
            self.faiss.ensure_index(dim)
            logger.info(f"Initialized context FAISS index with dimension {dim}")
        # In-memory store for conversation sessions: session_id -> list of turns
        self._sessions: dict[str, List[dict]] = defaultdict(list)

    def add_text(self, text: str, metadata: Optional[dict] = None):
        """Add a single text snippet to the vector store."""
        if not text.strip():
            return
        embedding = self.embedder.encode([text])
        payload = metadata or {"text": text, "timestamp": time.time()}
        self.faiss.add_vectors(embedding, [payload])
        self.faiss.save()
        logger.debug(f"Added text to context store: {text[:50]}...")

    def add_conversation_turn(self, session_id: str, role: str, content: str):
        """Add a conversation turn (user/assistant) to short-term memory and vector store."""
        if not content.strip():
            return
        timestamp = time.time()
        turn = {"role": role, "content": content, "timestamp": timestamp}
        self._sessions[session_id].append(turn)
        # Also add to vector store for retrieval
        metadata = {
            "session_id": session_id,
            "role": role,
            "content": content,
            "timestamp": timestamp,
        }
        self.add_text(content, metadata)
        logger.debug(f"Added conversation turn for session {session_id}: {role}")

    def get_relevant_context(self, query: str, k: int = 5) -> List[Dict[str, Any]]:
        """
        Retrieve top-k relevant contexts from the vector store.
        Returns list of metadata dicts with similarity scores.
        """
        if not query.strip():
            return []
        query_emb = self.embedder.encode([query])
        results = self.faiss.search(query_emb, k)
        contexts = []
        for metadata, score in results:
            ctx = metadata.copy() if isinstance(metadata, dict) else {"text": str(metadata)}
            ctx["score"] = score  # higher is more similar (inner product of normalized vectors)
            contexts.append(ctx)
        return contexts

    def get_conversation_history(self, session_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent conversation turns for a session (most recent last)."""
        msgs = self._sessions.get(session_id, [])
        # Return last `limit` messages
        return msgs[-limit:] if len(msgs) > limit else msgs

    def clear_session(self, session_id: str):
        """Clear conversation history for a session."""
        if session_id in self._sessions:
            del self._sessions[session_id]
            logger.info(f"Cleared session {session_id}")