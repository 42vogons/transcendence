#!/bin/bash

#!/bin/bash

# Carrega as variáveis de ambiente do arquivo .env
source .env

# Certifique-se de que as variáveis necessárias estão definidas
if [ -z "$CONTAINER_NAME" ] || [ -z "$DB_USER" ] || [ -z "$DB_NAME" ] || [ -z "$SQL_FILE" ]; then
    echo "Erro: Variáveis de ambiente não definidas."
    exit 1
fi

# Copia o script SQL para dentro do container
docker cp "$SQL_FILE" "$CONTAINER_NAME:/tmp/script.sql"

# Executa o script SQL dentro do container
docker exec -it "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -f "/tmp/script.sql"

# Limpeza (opcional) - Remove o script do container após a execução
docker exec -it "$CONTAINER_NAME" rm "/tmp/script.sql"