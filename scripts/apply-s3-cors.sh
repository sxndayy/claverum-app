#!/bin/bash

# Script to apply S3 CORS configuration using AWS CLI
# Usage: ./scripts/apply-s3-cors.sh <bucket-name>
#
# Prerequisites:
# - AWS CLI installed and configured
# - AWS credentials with S3 permissions
# - Bucket name as first argument

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if bucket name is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Bucket name is required${NC}"
    echo "Usage: $0 <bucket-name>"
    echo "Example: $0 claverum-bucket"
    exit 1
fi

BUCKET_NAME=$1
CORS_FILE="s3-cors-policy.json"

# Check if CORS policy file exists
if [ ! -f "$CORS_FILE" ]; then
    echo -e "${RED}Error: CORS policy file '$CORS_FILE' not found${NC}"
    echo "Make sure you're running this script from the project root directory"
    exit 1
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    echo "Install it from: https://aws.amazon.com/cli/"
    exit 1
fi

echo -e "${YELLOW}Applying CORS configuration to bucket: ${BUCKET_NAME}${NC}"
echo ""

# Apply CORS configuration
if aws s3api put-bucket-cors \
    --bucket "$BUCKET_NAME" \
    --cors-configuration "file://${CORS_FILE}"; then
    echo ""
    echo -e "${GREEN}✓ CORS configuration applied successfully!${NC}"
    echo ""
    echo "Verifying configuration..."
    
    # Verify the configuration
    if aws s3api get-bucket-cors --bucket "$BUCKET_NAME" &> /dev/null; then
        echo -e "${GREEN}✓ CORS configuration verified${NC}"
        echo ""
        echo "Current CORS configuration:"
        aws s3api get-bucket-cors --bucket "$BUCKET_NAME" | jq '.CORSRules'
    else
        echo -e "${YELLOW}Warning: Could not verify CORS configuration${NC}"
    fi
else
    echo ""
    echo -e "${RED}✗ Failed to apply CORS configuration${NC}"
    echo ""
    echo "Common issues:"
    echo "1. AWS credentials not configured (run 'aws configure')"
    echo "2. Insufficient permissions (need s3:PutBucketCORS)"
    echo "3. Bucket name is incorrect"
    echo "4. Bucket is in a different region (check AWS_REGION)"
    exit 1
fi






