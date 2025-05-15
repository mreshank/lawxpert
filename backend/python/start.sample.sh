#!/bin/bash
# Startup script for LawXpert Python Backend
# Rename this file to start.sh and make executable with: chmod +x start.sh

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  echo "Loading environment variables from .env file"
  export $(grep -v '^#' .env | xargs)
fi

# Default port to 5969 if not set in environment
PORT="${PORT:-5969}"
HOST="${HOST:-0.0.0.0}"

echo "Starting Python backend on $HOST:$PORT"

# Start the FastAPI application with uvicorn
exec uvicorn main:app --host $HOST --port $PORT --reload 