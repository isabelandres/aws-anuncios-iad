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