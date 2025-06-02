#!/bin/bash

# RepairHQ Environment Deployment Script
# This script helps deploy environment variables to different platforms

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
  echo -e "\n${YELLOW}=== $1 ===${NC}\n"
}

# Function to print success messages
print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error messages
print_error() {
  echo -e "${RED}✗ $1${NC}"
}

# Check if .env file exists
if [ ! -f .env ]; then
  print_error "No .env file found. Please create one first."
  exit 1
fi

print_header "RepairHQ Environment Deployment"

# Detect deployment platform
echo "Which platform are you deploying to?"
echo "1) Vercel"
echo "2) Netlify"
echo "3) AWS"
echo "4) Digital Ocean"
echo "5) Custom (manual)"
read -p "Enter your choice (1-5): " platform_choice

case $platform_choice in
  1)
    # Vercel deployment
    print_header "Deploying to Vercel"
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
      print_error "Vercel CLI not found. Please install it with: npm i -g vercel"
      exit 1
    fi
    
    # Pull existing environment variables
    echo "Pulling existing environment variables from Vercel..."
    vercel env pull .env.vercel
    
    # Merge with our .env file
    echo "Merging with local environment variables..."
    cat .env >> .env.vercel
    
    # Push environment variables to Vercel
    echo "Pushing environment variables to Vercel..."
    vercel env push .env.vercel
    
    print_success "Environment variables deployed to Vercel!"
    ;;
    
  2)
    # Netlify deployment
    print_header "Deploying to Netlify"
    
    # Check if Netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
      print_error "Netlify CLI not found. Please install it with: npm i -g netlify-cli"
      exit 1
    fi
    
    # Import environment variables from .env file
    echo "Importing environment variables to Netlify..."
    netlify env:import .env
    
    print_success "Environment variables deployed to Netlify!"
    ;;
    
  3)
    # AWS deployment
    print_header "Deploying to AWS"
    
    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
      print_error "AWS CLI not found. Please install it first."
      exit 1
    fi
    
    # Ask for the service name
    read -p "Enter your AWS service name (e.g., lambda, ecs): " aws_service
    read -p "Enter your function/service identifier: " aws_identifier
    
    # Create a JSON file with the environment variables
    echo "Creating environment variables JSON..."
    echo "{\"Variables\": {" > env.json
    
    # Read .env file and convert to JSON
    while IFS= read -r line || [[ -n "$line" ]]; do
      # Skip comments and empty lines
      if [[ $line =~ ^#.*$ ]] || [[ -z $line ]]; then
        continue
      fi
      
      # Extract key and value
      key=$(echo $line | cut -d= -f1)
      value=$(echo $line | cut -d= -f2-)
      
      # Add to JSON
      echo "\"$key\": \"$value\"," >> env.json
    done < .env
    
    # Remove the trailing comma and close the JSON
    sed -i '$ s/,$//' env.json
    echo "}}" >> env.json
    
    # Update the AWS service
    case $aws_service in
      "lambda")
        echo "Updating Lambda environment variables..."
        aws lambda update-function-configuration --function-name $aws_identifier --environment file://env.json
        ;;
      "ecs")
        echo "For ECS, please use the AWS console to update the task definition with these environment variables."
        echo "The env.json file has been created for your reference."
        ;;
      *)
        echo "Please manually update your $aws_service with the environment variables in env.json."
        ;;
    esac
    
    print_success "Environment variables prepared for AWS deployment!"
    ;;
    
  4)
    # Digital Ocean deployment
    print_header "Deploying to Digital Ocean"
    
    # Check if doctl is installed
    if ! command -v doctl &> /dev/null; then
      print_error "Digital Ocean CLI (doctl) not found. Please install it first."
      exit 1
    fi
    
    # Ask for the app ID
    read -p "Enter your Digital Ocean App ID: " do_app_id
    
    # Create a spec file for the environment variables
    echo "Creating environment variables spec file..."
    echo "envs:" > do-env-spec.yaml
    
    # Read .env file and convert to YAML
    while IFS= read -r line || [[ -n "$line" ]]; do
      # Skip comments and empty lines
      if [[ $line =~ ^#.*$ ]] || [[ -z $line ]]; then
        continue
      fi
      
      # Extract key and value
      key=$(echo $line | cut -d= -f1)
      value=$(echo $line | cut -d= -f2-)
      
      # Add to YAML
      echo "- key: $key" >> do-env-spec.yaml
      echo "  value: $value" >> do-env-spec.yaml
      echo "  scope: RUN_AND_BUILD_TIME" >> do-env-spec.yaml
    done < .env
    
    # Update the Digital Ocean app
    echo "Updating Digital Ocean app environment variables..."
    doctl apps update $do_app_id --spec do-env-spec.yaml
    
    print_success "Environment variables deployed to Digital Ocean!"
    ;;
    
  5)
    # Manual deployment
    print_header "Manual Deployment"
    
    echo "Your environment variables are in the .env file."
    echo "Please manually add these variables to your deployment platform."
    
    # Ask if they want to see the variables
    read -p "Do you want to see the list of variables? (y/n): " show_vars
    
    if [[ $show_vars == "y" ]]; then
      echo "Here are your environment variables:"
      echo ""
      
      # Read .env file and display in a readable format
      while IFS= read -r line || [[ -n "$line" ]]; do
        # Skip comments and empty lines
        if [[ $line =~ ^#.*$ ]] || [[ -z $line ]]; then
          continue
        fi
        
        # Extract key and value
        key=$(echo $line | cut -d= -f1)
        value=$(echo $line | cut -d= -f2-)
        
        # Display
        echo "$key=$value"
      done < .env
    fi
    
    print_success "Environment variables ready for manual deployment!"
    ;;
    
  *)
    print_error "Invalid choice. Exiting."
    exit 1
    ;;
esac

print_header "Next Steps"
echo "1. Verify your environment variables are correctly set in your production environment."
echo "2. Run the verification script to check all required variables are set."
echo "3. Test connections to ensure all services are properly configured."
echo "4. Set up webhook endpoints in each service's dashboard."

print_success "Deployment process completed!"
