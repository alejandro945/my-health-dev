# Imagen base: node:alpine
# Usa una imagen base adecuada utilizamos una versión estable y segura.
FROM node:alpine
# Directorio de trabajo: /app
WORKDIR /app
# Copiamos archivo de declaración de paquetes necesarios para la ejecución de nuestro server
COPY package*.json ./
# Instalamos dependencias
RUN npm install
# Copiamos todos los archivos generados en nuestro execution enviroment
COPY . .
# Puerto expuesto: 9000
EXPOSE 9000
# Iniciamos nuestro servidor
CMD ["npm", "start"]