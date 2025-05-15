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

# Create startup script
RUN echo '#!/bin/bash\n\
# Start Node.js Express server in the background\n\
node server.js &\n\
\n\
# Start Python FastAPI server\n\
cd /app && uvicorn main:app --host 0.0.0.0 --port 8000\n\
' > /app/start.sh

RUN chmod +x /app/start.sh

# Expose ports for Express and FastAPI
EXPOSE 4000 8000

# Start both servers
CMD ["/app/start.sh"] 