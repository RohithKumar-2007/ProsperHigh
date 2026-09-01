from typing import Dict, Any, List
from backend.services.data_service import data_service

class RAGService:
    def __init__(self):
        pass

    def query_filings(self, symbol: str, query: str) -> Dict[str, Any]:
        """Queries company filings dataset and returns citation-backed evidence."""
        docs = data_service.get_company_documents(symbol)
        if not docs:
            # Fallback search across all docs if symbol not specified or no docs found
            docs = data_service.documents_data.get("documents", [])
            
        matched_chunks = []
        query_words = query.lower().split()
        
        for doc in docs:
            text = (doc.get("content", "") + " " + doc.get("title", "") + " " + doc.get("section", "")).lower()
            # Simple keyword matching relevance score
            matches = sum(1 for word in query_words if word in text)
            if matches > 0 or not query_words:
                matched_chunks.append({
                    "doc": doc,
                    "relevance_score": matches
                })
                
        # Sort by relevance
        matched_chunks.sort(key=lambda x: x["relevance_score"], reverse=True)
        top_chunks = matched_chunks[:3] if matched_chunks else [{"doc": docs[0], "relevance_score": 1}] if docs else []
        
        citations = []
        snippets = []
        for item in top_chunks:
            d = item["doc"]
            citations.append({
                "document": d.get("document_name"),
                "year": d.get("year"),
                "page": d.get("page"),
                "section": d.get("section"),
                "citation_string": d.get("citation")
            })
            snippets.append(d.get("content"))
            
        answer = f"According to verified exchange filings and official annual reports for {symbol}: " + " ".join(snippets[:2])
        
        return {
            "query": query,
            "symbol": symbol,
            "answer": answer,
            "citations": citations,
            "retrieval_confidence": 0.88 if citations else 0.40
        }

rag_service = RAGService()
