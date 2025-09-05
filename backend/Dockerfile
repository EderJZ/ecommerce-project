# Escolhe a imagem oficial do Node
FROM node:20

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o restante do backend
COPY . .

# Expõe a porta que o Node vai rodar
EXPOSE 3001

# Comando para rodar a aplicação
CMD ["node", "server.js"]

