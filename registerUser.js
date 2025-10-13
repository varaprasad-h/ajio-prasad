import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log('Received event:', JSON.stringify(event));  // Debug log for entire event

  let body;

  try {
    body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    console.log('Parsed body:', body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  // Validation for required fields
  if (!body || !body.name || !body.email || !body.phone || !body.password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required user data: name, email, phone, and password." }),
    };
  }

  const user = {
    id: Date.now().toString(),
    name: body.name,
    email: body.email,
    phone: body.phone,
    password: body.password,
  };

  const params = {
    TableName: 'users',
    Item: user,
  };

  try {
    await dynamo.send(new PutCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User registered successfully!" }),
    };
  } catch (error) {
    console.error('DynamoDB error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not save user", details: error.message }),
    };
  }
};
