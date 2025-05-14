from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import os
from typing import Optional
import PyPDF2
import docx
import io
import logging
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://lawexpert.vercel.app", "http://localhost:5173", "*"],  # In production, use your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    logger.error("GEMINI_API_KEY not found in environment variables")
    raise ValueError("GEMINI_API_KEY environment variable is required")

try:
    genai.configure(api_key=api_key)
    # List available models
    models = genai.list_models()
    logger.info(f"Available models: {[model.name for model in models]}")
    
    # Use gemini-2.0-flash as per the API documentation
    model = genai.GenerativeModel('gemini-2.0-flash')
    logger.info("Successfully configured Gemini API")
except Exception as e:
    logger.error(f"Failed to configure Gemini API: {str(e)}")
    raise

def extract_text_from_pdf(file_content: bytes) -> str:
    try:
        pdf_file = io.BytesIO(file_content)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error extracting text from PDF: {str(e)}")

def extract_text_from_docx(file_content: bytes) -> str:
    try:
        docx_file = io.BytesIO(file_content)
        doc = docx.Document(docx_file)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        logger.error(f"Error extracting text from DOCX: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error extracting text from DOCX: {str(e)}")

async def analyze_document(text: str, question: Optional[str] = None):
    try:
        logger.info(f"analyze_document received question: {question}")
        # Always analyze the document
        summary_prompt = f'''Analyze this legal document and provide a concise summary in simple language:\n{text}\nFocus on the main purpose, key points, and important implications.'''

        clauses_prompt = f'''Extract and explain the key clauses from this legal document:\n{text}\nInclude:\n1. Parties involved\n2. Important dates\n3. Jurisdiction\n4. Key obligations\n5. Important terms and conditions\nFormat the response as a structured list.'''

        logger.info("Generating summary...")
        summary_response = model.generate_content(summary_prompt)
        logger.info("Generating clauses...")
        clauses_response = model.generate_content(clauses_prompt)

        result = {
            "summary": getattr(summary_response, 'text', ''),
            "clauses": getattr(clauses_response, 'text', ''),
        }

        # If a question is provided, answer it using Gemini
        if question:
            qa_prompt = f'''Based on this legal document:\n{text}\n\nQuestion: {question}\n\nProvide a clear and concise answer, citing relevant parts of the document if possible.'''
            logger.info(f"Generating real answer for question: {question}")
            qa_response = model.generate_content(qa_prompt)
            # Robust extraction of answer text
            answer = getattr(qa_response, 'text', '')
            if not answer and hasattr(qa_response, 'candidates'):
                answer = qa_response.candidates[0].content.parts[0].text
            result["answer"] = answer

        return result
    except Exception as e:
        logger.error(f"Error in analyze_document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error analyzing document: {str(e)}")

@app.post("/analyze")
async def analyze_endpoint(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None),
    question: Optional[str] = Form(None)
):
    logger.info(f"Endpoint received question: {question}")
    try:
        if not file and not text:
            raise HTTPException(status_code=400, detail="Either file or text must be provided")
        
        if file:
            logger.info(f"Processing file: {file.filename}")
            content = await file.read()
            if file.filename.endswith('.pdf'):
                text = extract_text_from_pdf(content)
            elif file.filename.endswith('.docx'):
                text = extract_text_from_docx(content)
            else:
                raise HTTPException(status_code=400, detail="Unsupported file format")
        
        result = await analyze_document(text, question)
        return result
    
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error in analyze_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 