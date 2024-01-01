# Start from a base image, e.g., Go
FROM golang:latest

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy the source from the current directory to the Working Directory inside the container
COPY . .

# Download dependencies
RUN go mod download

# Build the Go app
RUN go build -o main .

# Expose port to the outside world
EXPOSE 1323

# Command to run the executable
CMD ["./main"]
