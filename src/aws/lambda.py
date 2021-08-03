import boto3
import json
from lambda_flashcards import LambdaFlashcards

def generate(event, context):
	src = event["queryStringParameters"]["src"]
	flashcards = LambdaFlashcards()
	return flashcards(src)