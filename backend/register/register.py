import json
import boto3
from decimal import Decimal

from boto3.dynamodb.conditions import Key, Attr

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

    response = table.update_item(
        Key={'id': 'userCounter'},
        UpdateExpression="ADD #cnt :val",
        ExpressionAttributeNames={'#cnt': 'count'},
        ExpressionAttributeValues={':val': 1},
        ReturnValues="UPDATED_NEW"
    )

    # Retrieve the new value
    userId = response['Attributes']['count']

    try:
        if event['routeKey'] == "POST /register":
        
            requestJSON = json.loads(event['body'])
            # requestJSON = event['body']
          
            response = table.query(
                IndexName='username-index',
                KeyConditionExpression=Key('username').eq(requestJSON['username'])
            )

            
            if 'Item' or 'Items' in response:
                statusCode = 401
                body = [{
                            'message': 'Username exists'
                        }]
            else:
                requestJSON = json.loads(event['body'])
                # requestJSON = event['body']

                table.put_item(
                    Item={
                        'id': str(userId),
                        'username': requestJSON['username'],
                        # 'password': Decimal(str(requestJSON['price'])),
                        'password': requestJSON['password'],
                        'email': requestJSON['email']
                    })
                body = response
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
