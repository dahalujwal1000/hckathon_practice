from sentence_transformers import SentenceTransformer
from app.core.config import get_settings
from app.core.logging import logger
import numpy as np
from typing import List, Union

class EmbeddingService:
    def __init__(self):
        settings = get_settings()
        # Use a lightweight multilingual model; can be configured via env
        model_name = getattr(settings, 'EMBEDDING_MODEL', 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')
        try:
            self.model = SentenceTransformer(model_name)
            logger.info(f"Loaded embedding model: {model_name}")
        except Exception as e:
            logger.error(f"Failed to load embedding model {model_name}: {e}")
            # Fallback to a very small model
            self.model = SentenceTransformer('sentence-transformers/paraphrase-MiniLM-L3-v2')
            logger.warning("Fallback to paraphrase-MiniLM-L3-v2")

    def encode(self, texts: Union[str, List[str]]) -> np.ndarray:
        """
        Encode text(s) to embeddings.
        Returns a numpy array of shape (len(texts), dim).
        """
        if isinstance(texts, str):
            texts = [texts]
        # Ensure we don't pass empty list
        if not texts:
            return np.array([]).reshape(0, self.model.get_sentence_embedding_dimension())
        embeddings = self.model.encode(
            texts,
            convert_to_numpy=True,
            normalize_embeddings=True,  # normalize for cosine similarity via inner product
        )
        return embeddings

    def get_dimension(self) -> int:
        return self.model.get_sentence_embedding_dimension()