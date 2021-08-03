import boto3
import json
from lambdaflashcards import LambdaFlashcards
import urllib

def generate(event, context):
	src = event["queryStringParameters"]["src"]
	src = urllib.parse.unquote(src).split("=")[-1]
	flashcards = LambdaFlashcards()
	return flashcards(src)