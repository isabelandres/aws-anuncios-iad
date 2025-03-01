📢 Proyecto AWS Anuncios

Este proyecto implementa una API en AWS utilizando AWS Lambda, API Gateway y DynamoDB para gestionar anuncios y comentarios de forma serverless.

🚀 Configuración en AWS

El despliegue de este proyecto requiere la configuración manual de los siguientes recursos en AWS:

📌 Creación de Tablas en DynamoDB

Nombre de la tabla de anuncios: Anuncios_iad

Nombre de la tabla de comentarios: Comentarios_iad

Claves primarias:

Anuncios_iad: anuncioId (String)

Comentarios_iad: comentarioId (String), anuncioId (String) como clave de ordenamiento

⚡ Creación de Funciones Lambda

Se crearon cuatro funciones Lambda desde la consola de AWS:

getAnunciosiad → Obtiene los anuncios desde DynamoDB.

createAnuncioiad → Agrega nuevos anuncios a DynamoDB.

getComentariosiad → Obtiene los comentarios de un anuncio desde DynamoDB.

createComentarioiad → Agrega nuevos comentarios a DynamoDB.

👉 Código para getAnunciosiad

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamoDb = DynamoDBDocumentClient.from(client);

export async function handler(event) {
    try {
        const params = { TableName: "Anuncios_iad" };
        const command = new ScanCommand(params);
        const data = await dynamoDb.send(command);

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(data.Items || [])
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
}

👉 Código para createAnuncioiad

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamoDb = DynamoDBDocumentClient.from(client);

export async function handler(event) {
    try {
        const body = JSON.parse(event.body);
        const command = new PutCommand({
            TableName: "Anuncios_iad",
            Item: {
                anuncioId: body.anuncioId,
                title: body.title,
                description: body.description
            }
        });

        await dynamoDb.send(command);
        return {
            statusCode: 201,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Anuncio creado correctamente" })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
}

👉 Código para getComentariosiad

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamoDb = DynamoDBDocumentClient.from(client);

export async function handler(event) {
    try {
        const anuncioId = event.queryStringParameters.anuncioId;
        const params = {
            TableName: "Comentarios_iad",
            KeyConditionExpression: "anuncioId = :anuncioId",
            ExpressionAttributeValues: { ":anuncioId": anuncioId }
        };
        const command = new QueryCommand(params);
        const data = await dynamoDb.send(command);

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(data.Items || [])
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
}

👉 Código para createComentarioiad

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamoDb = DynamoDBDocumentClient.from(client);

export async function handler(event) {
    try {
        const body = JSON.parse(event.body);
        const command = new PutCommand({
            TableName: "Comentarios_iad",
            Item: {
                comentarioId: body.comentarioId,
                anuncioId: body.anuncioId,
                autor: body.autor,
                contenido: body.contenido
            }
        });

        await dynamoDb.send(command);
        return {
            statusCode: 201,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Comentario agregado correctamente" })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
}

🌐 Configuración de API Gateway

Endpoints configurados:

GET /anunciosia → Conectado a getAnunciosiad

POST /anunciosia → Conectado a createAnuncioiad

GET /comentariosia → Conectado a getComentariosiad

POST /comentariosia → Conectado a createComentarioiad

GET  https://tu-api-gateway.execute-api.eu-west-1.amazonaws.com/v1/anunciosia
POST https://tu-api-gateway.execute-api.eu-west-1.amazonaws.com/v1/anunciosia
GET  https://tu-api-gateway.execute-api.eu-west-1.amazonaws.com/v1/comentariosia
POST https://tu-api-gateway.execute-api.eu-west-1.amazonaws.com/v1/comentariosia

🌟 Ejecución y Pruebas

Probar API con curl

📌 Obtener todos los anuncios

curl -X GET "https://aqr1b678mg.execute-api.eu-west-1.amazonaws.com/v1/anunciosia"
📌 Crear un anuncio

curl -X POST "https://aqr1b678mg.execute-api.eu-west-1.amazonaws.com/v1/anunciosia" \
     -H "Content-Type: application/json" \
     -d '{"anuncioId":"123", "title":"Nuevo anuncio", "description":"Esto es un test"}'
📌 Obtener comentarios de un anuncio (reemplazar anuncioId=123 con el ID del anuncio deseado)

curl -X GET "https://aqr1b678mg.execute-api.eu-west-1.amazonaws.com/v1/comentariosia?anuncioId=123"
📌 Crear un comentario

curl -X POST "https://aqr1b678mg.execute-api.eu-west-1.amazonaws.com/v1/comentariosia" \
     -H "Content-Type: application/json" \
     -d '{"comentarioId":"cmt-001", "anuncioId":"123", "autor":"Juan", "contenido":"Buen anuncio!"}'

