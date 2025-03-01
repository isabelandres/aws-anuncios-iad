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