#!/bin/bash
set -e +u
set -o pipefail

# first local account by default
export DEPLOYER=0xa5F1d7D49F581136Cf6e58B32cBE9a2039C48bA1
export NETWORK=${NETWORK:=zhejiang}

bash dao-deploy.sh
