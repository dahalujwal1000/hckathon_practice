import faiss
import numpy as np
import pickle
import os
from pathlib import Path
from typing import List, Tuple, Any, Optional
from app.core.config import get_settings
from app.core.logging import logger

class FaissService:
    def __init__(self):
        settings = get_settings()
        self.index_path = Path(settings.FAISS_INDEX_PATH)
        self.index_path.parent.mkdir(parents=True, exist_ok=True)
        self.index: Optional[faiss.Index] = None
        self.id_map: dict[int, Any] = {}  # faiss internal id -> metadata
        self.next_id = 0
        self.dimension: Optional[int] = None
        self._load()

    def _load(self):
        """Load FAISS index and id map from disk."""
        index_file = self.index_path.with_suffix('.index')
        map_file = self.index_path.with_suffix('.pkl')
        if index_file.exists() and map_file.exists():
            try:
                self.index = faiss.read_index(str(index_file))
                with open(map_file, 'rb') as f:
                    self.id_map = pickle.load(f)
                # Determine next id as max key +1 or size
                self.next_id = max(self.id_map.keys()) + 1 if self.id_map else 0
                self.dimension = self.index.d if self.index else None
                logger.info(f"Loaded FAISS index with {self.index.ntotal} vectors from {index_file}")
            except Exception as e:
                logger.error(f"Failed to load FAISS index: {e}")
                self._init_empty()
        else:
            self._init_empty()

    def _init_empty(self):
        self.index = None
        self.id_map = {}
        self.next_id = 0
        self.dimension = None
        logger.info("Initialized empty FAISS index")

    def ensure_index(self, dimension: int):
        """Ensure index is initialized with given dimension."""
        if self.index is None:
            self.dimension = dimension
            # Using IndexFlatIP (inner product) for cosine similarity when vectors are normalized
            self.index = faiss.IndexFlatIP(dimension)
            logger.info(f"Initialized FAISS index (Inner Product) with dimension {dimension}")
        elif self.index.d != dimension:
            raise ValueError(f"Index dimension mismatch: expected {self.index.d}, got {dimension}")

    def add_vectors(self, vectors: np.ndarray, metadata: List[Any]):
        """
        Add vectors with associated metadata.
        vectors: numpy array shape (n, dim)
        metadata: list of objects corresponding to each vector
        """
        if vectors.ndim != 2:
            raise ValueError("Vectors must be 2D array")
        if len(vectors) != len(metadata):
            raise ValueError("Number of vectors and metadata items must match")
        dim = vectors.shape[1]
        self.ensure_index(dim)
        # Ensure vectors are float32 and normalized for inner product cosine similarity
        vectors = vectors.astype(np.float32)
        # FAISS IP expects vectors normalized to unit length for cosine similarity
        # We'll normalize here
        norms = np.linalg.norm(vectors, axis=1, keepdims=True)
        norms[norms == 0] = 1e-10
        vectors = vectors / norms
        # Add to index
        start_id = self.next_id
        self.index.add(vectors)
        # Map internal ids (which are sequential) to metadata
        for i, meta in enumerate(metadata):
            self.id_map[start_id + i] = meta
        self.next_id += len(vectors)
        logger.info(f"Added {len(vectors)} vectors to FAISS index. Total: {self.index.ntotal}")

    def search(self, query: np.ndarray, k: int = 5) -> List[Tuple[Any, float]]:
        """
        Search for k nearest neighbors.
        Returns list of (metadata, score) where score is inner product (higher = more similar).
        """
        if self.index is None or self.index.ntotal == 0:
            return []
        if query.ndim == 1:
            query = query.reshape(1, -1)
        if query.shape[1] != self.dimension:
            raise ValueError(f"Query dimension {query.shape[1]} does not match index dimension {self.dimension}")
        query = query.astype(np.float32)
        # Normalize query
        norm = np.linalg.norm(query, axis=1, keepdims=True)
        norm[norm == 0] = 1e-10
        query = query / norm
        distances, indices = self.index.search(query, k)
        results: List[Tuple[Any, float]] = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx == -1:  # FAISS returns -1 when not enough results
                continue
            meta = self.id_map.get(int(idx))
            if meta is not None:
                results.append((meta, float(dist)))
        return results

    def save(self):
        """Persist index and id map to disk."""
        if self.index is None:
            logger.warning("No index to save")
            return
        try:
            self.index_path.parent.mkdir(parents=True, exist_ok=True)
            faiss.write_index(self.index, str(self.index_path.with_suffix('.index')))
            with open(self.index_path.with_suffix('.pkl'), 'wb') as f:
                pickle.dump(self.id_map, f)
            logger.info(f"Saved FAISS index with {self.index.ntotal} vectors to {self.index_path}")
        except Exception as e:
            logger.error(f"Failed to save FAISS index: {e}")

    def count(self) -> int:
        return self.index.ntotal if self.index else 0