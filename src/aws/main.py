import boto3
import json
from lambdaflashcards import LambdaFlashcards
import urllib
import uuid

def generate(event, context):
	src = event["queryStringParameters"]["src"]
	src = urllib.parse.unquote(src).split("=")[-1]
	print(f"FUNCTION generate IN main.py CALLED WITH ARGUMENT {src}")
	flashcards = LambdaFlashcards()
	print("LambdaFlashcards OBJECT INSTANTIATED")
	questions = flashcards(src)
	r = {str(uuid.uuid4()) : questions}
	response = {
		"isBase64Encoded":false,
        "statusCode": 200,
        "headers":{
        	"Content-Type":"application/json",
        	"Access-Control-Allow-Origin":"*",
        },
        "body": json.dumps(r)
    }

	print(r)
	return response