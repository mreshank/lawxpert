FROM nikolaik/python-nodejs:python3.10-nodejs18

WORKDIR /app

# Copy package files and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy Python requirements and install Python dependencies
COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE $PORT_PYTHON

# Start the FastAPI server, which will use the PORT env variable
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT_PYTHON:-6569}"] 