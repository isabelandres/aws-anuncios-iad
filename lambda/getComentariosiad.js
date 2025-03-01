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