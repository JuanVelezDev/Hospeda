#!/bin/bash

# Script de build para Vercel
echo "Iniciando build para Vercel..."

# Crear directorio de salida si no existe
mkdir -p .vercel/output/static

# Copiar todos los archivos del frontend
cp -r Frontend/* .vercel/output/static/

echo "Build completado exitosamente"
