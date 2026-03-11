# Stage 1: Builder
FROM python:3.13 as builder

WORKDIR /app

# Instalar todas as dependências do sistema necessárias
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    git \
    curl \
    python3-dev \
    libssl-dev \
    libffi-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip, setuptools, wheel
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Copiar requirements
COPY requirements.txt .

# Instalar pacotes Python em /root/.local
RUN pip install --no-cache-dir --user -r requirements.txt || \
    (echo "Erro ao instalar dependências. Tentando versão alternativa..." && \
     pip install --no-cache-dir --user --prefer-binary -r requirements.txt)

# Stage 2: Runtime
FROM python:3.13-slim

WORKDIR /app

# Instalar apenas runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    sqlite3 \
    libssl3 \
    libffi8 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar Python packages do builder
COPY --from=builder /root/.local /root/.local

# Definir PATH
ENV PATH=/root/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Copiar aplicação
COPY . .

# Volume para persistência do banco de dados
VOLUME ["/app/data", "/app/app/database"]

# Porta padrão
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/').read()" || exit 1

# Comando de execução
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
