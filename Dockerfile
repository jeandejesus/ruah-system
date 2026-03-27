# Etapa de construção
FROM node:18-alpine AS build

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências (incluindo dev para o build)
RUN npm install

# Copiar o restante do código
COPY . .

# Construir a aplicação Angular para produção
RUN npm run build --configuration=production

# Etapa final: Servir com Nginx
FROM nginx:alpine

# Copiar o build do Angular para o diretório de assets do Nginx
# NOTA: Verifique se o caminho 'dist/ruah-system' está correto no seu angular.json
COPY --from=build /app/dist/ruah-system /usr/share/nginx/html

# Copiar a configuração do Nginx para suportar rotas SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
