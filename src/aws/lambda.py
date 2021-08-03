import boto3
import json
from lambda_flashcards import LambdaFlashcards

def get_qgqa(event, context):
	src = event["queryStringParameters"]["src"]
	flashcards = LambdaFlashcards()
	return flashcards(src)