# pyrefly: ignore [missing-import]
import pymupdf

class PDFService:

    @staticmethod
    async def extract_text(file_bytes: bytes) -> list[dict]:
        """
        Extract text from every page of a PDF.

        Returns:
            A list containing page number and extracted text.
        """

        pdf = pymupdf.open(stream=file_bytes, filetype="pdf")

        pages = []

        for page_number, page in enumerate(pdf, start=1):
            text = page.get_text()

            pages.append({
                "page": page_number,
                "text": text
            })

        pdf.close()

        return pages