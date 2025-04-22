import json
import boto3
from decimal import Decimal

client = boto3.client('dynamodb')
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table('travel-blog')
tableName = 'travel-blog'


def lambda_handler(event, context):
    print(event)
    body = {}
    statusCode = 200
    headers = {
        "Content-Type": "application/json"
    }

    try:
        if event['routeKey'] == "POST /register":
            # Get user from database
            requestJSON = json.loads(event['body'])
            response = table.get_item(
                Key={
                    'id': requestJSON['username']
                }
            )
            
            if 'Item' in response:
              statusCode = 401
              body = [{
                        'message': 'Username exists'
                    }]
              
               
            
            # Check if user exists and password matches
            if 'Item' in response and response['Item']['password'] == requestJSON['password']:
                # Generate token (you should use a proper JWT library)
                # token = generate_token(response['Item']['username'])
                token = '123' + response['Item']['username']
                body =  [{
                    'token': token,
                    'userId': response['Item']['username']
                }]
                
            else:
              statusCode = 401
              body = [{
                        'message': 'Invalid credentials'
                    }]
    except KeyError:
        statusCode = 400
        body = 'Unsupported route: ' + event['routeKey']
    body = json.dumps(body)
    res = {
        "statusCode": statusCode,
        "headers": {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',  # Allow all origins
            'Access-Control-Allow-Methods': 'POST,OPTIONS',  # Allow specific methods
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'  # Allow specific headers
        },
        "body": body
    }
    return res
