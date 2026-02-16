#!/bin/bash

# FinControl Deploy Script
# Execute este script no WSL para subir toda a stack

set -e

echo "🚀 FinControl - Deploy Script"
echo "=============================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker não está rodando. Inicie o Docker primeiro!${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Parando containers antigos...${NC}"
docker-compose down 2>/dev/null || true

echo -e "${YELLOW}🧹 Removendo imagens antigas...${NC}"
docker-compose rm -f 2>/dev/null || true
docker rmi fincontrol_api fincontrol_web 2>/dev/null || true

echo -e "${YELLOW}🏗️  Buildando e subindo containers...${NC}"
docker-compose up --build -d

echo ""
echo -e "${GREEN}✅ Containers subidos!${NC}"
echo ""

# Wait for services
echo -e "${YELLOW}⏳ Aguardando serviços inicializarem (30s)...${NC}"
sleep 30

# Check health
echo ""
echo "🔍 Verificando saúde dos serviços:"
echo "-----------------------------------"

# API Health
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API: http://localhost:3001${NC}"
    curl -s http://localhost:3001/health | head -1
else
    echo -e "${RED}❌ API não responde${NC}"
fi

# Web Health
if curl -s http://localhost:3002 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Web: http://localhost:3002${NC}"
else
    echo -e "${RED}❌ Web não responde${NC}"
fi

echo ""
echo "📋 Logs disponíveis com:"
echo "  docker-compose logs -f api    # API logs"
echo "  docker-compose logs -f web    # Web logs"
echo ""
echo -e "${GREEN}🎉 FinControl está rodando!${NC}"
echo ""
echo "URLs:"
echo "  🌐 Aplicação: http://localhost:3002"
echo "  🔌 API:        http://localhost:3001"
echo "  📊 Health:     http://localhost:3001/health"
echo ""
echo "Teste o registro:"
echo "  curl -X POST http://localhost:3001/api/auth/register \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"email\":\"teste@teste.com\",\"password\":\"senha123\",\"name\":\"Teste\"}'"
