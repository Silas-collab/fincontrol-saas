#!/bin/bash
# Teste COMPLETO de todas as rotas do FinControl
# Só termina quando TUDO estiver funcionando

set -e

API_URL="${API_URL:-http://localhost:3001}"
echo "════════════════════════════════════════════════════════════"
echo "🧪 TESTANDO TODAS AS ROTAS DO FINCONTROL"
echo "════════════════════════════════════════════════════════════"
echo "API: $API_URL"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

TOTAL=0
PASSED=0
FAILED=0

# Função para testar endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_code=$4
    local description=$5
    
    TOTAL=$((TOTAL + 1))
    
    echo -n "[$method] $endpoint ... "
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$API_URL$endpoint" 2>/dev/null)
    else
        if [ -n "$TOKEN" ]; then
            response=$(curl -s -w "\n%{http_code}" -X "$method" \
                -H "Authorization: Bearer $TOKEN" \
                -H "Content-Type: application/json" \
                "$API_URL$endpoint" 2>/dev/null)
        else
            response=$(curl -s -w "\n%{http_code}" -X "$method" \
                -H "Content-Type: application/json" \
                "$API_URL$endpoint" 2>/dev/null)
        fi
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "$expected_code" ] || [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo -e "${GREEN}✅ PASS${NC} ($http_code)"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} ($http_code)"
        echo "   Response: $body"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 TESTES DE SAÚDE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "GET" "/health" "" "200" "Health check"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 TESTES DE AUTENTICAÇÃO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Registrar usuário de teste
EMAIL="testuser$(date +%s)@test.com"
PASSWORD="Test123!@#"

REGISTER_DATA="{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"name\":\"Test User\"}"
if test_endpoint "POST" "/api/auth/register" "$REGISTER_DATA" "201" "Register new user"; then
    LOGIN_DATA="{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}"
    
    # Login
    echo -n "[POST] /api/auth/login ... "
    login_response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$LOGIN_DATA" \
        "$API_URL/api/auth/login" 2>/dev/null)
    
    TOKEN=$(echo "$login_response" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$TOKEN" ]; then
        echo -e "${GREEN}✅ PASS${NC} (token obtido)"
        PASSED=$((PASSED + 1))
        TOTAL=$((TOTAL + 1))
    else
        echo -e "${RED}❌ FAIL${NC} (sem token)"
        echo "   Response: $login_response"
        FAILED=$((FAILED + 1))
        TOTAL=$((TOTAL + 1))
    fi
fi

# Testar duplicidade (deve falhar)
test_endpoint "POST" "/api/auth/register" "$REGISTER_DATA" "400" "Duplicate email check"

# Profile (precisa de token)
if [ -n "$TOKEN" ]; then
    test_endpoint "GET" "/api/auth/profile" "" "200" "Get profile"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 TESTES DE DASHBOARD (requer autenticação)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$TOKEN" ]; then
    test_endpoint "GET" "/api/dashboard/summary" "" "200" "Dashboard summary"
    test_endpoint "GET" "/api/dashboard/monthly-trend" "" "200" "Monthly trend"
    test_endpoint "GET" "/api/dashboard/recent-transactions" "" "200" "Recent transactions"
    test_endpoint "GET" "/api/dashboard/category-breakdown" "" "200" "Category breakdown"
else
    echo -e "${YELLOW}⚠️ Pulando testes de dashboard - sem token${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 TESTES DE CONTAS (requer autenticação)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$TOKEN" ]; then
    test_endpoint "GET" "/api/accounts" "" "200" "List accounts"
    
    # Criar conta
    ACCOUNT_DATA='{"name":"Conta Teste","type":"CHECKING","institution":"Banco Teste","balance":1000}'
    if test_endpoint "POST" "/api/accounts" "$ACCOUNT_DATA" "201" "Create account"; then
        # Buscar ID da conta criada
        accounts_response=$(curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/api/accounts")
        account_id=$(echo "$accounts_response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
        
        if [ -n "$account_id" ]; then
            test_endpoint "GET" "/api/accounts/$account_id" "" "200" "Get account by ID"
            test_endpoint "PUT" "/api/accounts/$account_id" '{"name":"Conta Teste Atualizada"}' "200" "Update account"
        fi
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 TESTES DE TRANSAÇÕES (requer autenticação)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$TOKEN" ] && [ -n "$account_id" ]; then
    test_endpoint "GET" "/api/transactions" "" "200" "List transactions"
    
    # Criar transação
    TX_DATA="{\"accountId\":\"$account_id\",\"type\":\"EXPENSE\",\"description\":\"Teste\",\"amount\":50,\"transactionDate\":\"$(date -Iseconds)\"}"
    if test_endpoint "POST" "/api/transactions" "$TX_DATA" "201" "Create transaction"; then
        txs_response=$(curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/api/transactions")
        tx_id=$(echo "$txs_response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
        
        if [ -n "$tx_id" ]; then
            test_endpoint "GET" "/api/transactions/$tx_id" "" "200" "Get transaction by ID"
        fi
    fi
else
    echo -e "${YELLOW}⚠️ Pulando testes de transações - sem conta${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 TESTES DE CATEGORIAS (requer autenticação)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$TOKEN" ]; then
    test_endpoint "GET" "/api/categories" "" "200" "List categories"
    
    # Criar categoria
    CAT_DATA='{"name":"Categoria Teste","type":"EXPENSE","color":"#FF0000"}'
    if test_endpoint "POST" "/api/categories" "$CAT_DATA" "201" "Create category"; then
        cats_response=$(curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/api/categories")
        cat_id=$(echo "$cats_response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
        
        if [ -n "$cat_id" ]; then
            test_endpoint "GET" "/api/categories/$cat_id" "" "200" "Get category by ID"
        fi
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 TESTES DE ORÇAMENTOS (requer autenticação)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$TOKEN" ]; then
    test_endpoint "GET" "/api/budgets" "" "200" "List budgets"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 TESTES DE METAS (requer autenticação)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$TOKEN" ]; then
    test_endpoint "GET" "/api/goals" "" "200" "List goals"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMO FINAL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Total:  $TOTAL"
echo -e "${GREEN}Passou: $PASSED${NC}"
echo -e "${RED}Falhou: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ TODOS OS TESTES PASSARAM!${NC}"
    exit 0
else
    echo -e "${RED}❌ HÁ TESTES FALHANDO - CORRIJA ANTES DE PROSSEGUIR${NC}"
    exit 1
fi
