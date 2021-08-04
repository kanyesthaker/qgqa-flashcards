import boto3
import json
from lambdaflashcards import LambdaFlashcards
import urllib
import uuid
from scraper import Scraper

def generate(event, context):
    src = event["queryStringParameters"]["src"]
    src = urllib.parse.unquote(src).split("=")[-1]
    print(f"FUNCTION generate IN main.py CALLED WITH ARGUMENT {src}")
    flashcards = LambdaFlashcards()
    print("LambdaFlashcards OBJECT INSTANTIATED")
    questions = flashcards(src)
    r = {str(uuid.uuid4()) : questions}
    response = {
        "isBase64Encoded":False,
        "statusCode": 200,
        "headers":{
            "Content-Type":"application/json",
            "Access-Control-Allow-Origin":"*",
        },
        "body": json.dumps(r)
    }

    print(r)
    return response

def segment_text(event, context):
    batch_size=50
    src = event["queryStringParameters"]["src"]
    src = urllib.parse.unquote(src).split("=")[-1]
    scraper = Scraper()
    context=scraper.get_text(src)
    tokens = context.split()
    question_batches = [' '.join(tokens[i:i+batch_size]) for i in range(0, len(tokens), batch_size)]
    ans_batches = {}
    for i, e in enumerate(question_batches):
        if i == 0:
            ans_batches[i] = question_batches[i:i+2]
        else:
            ans_batches[i] = question_batches[i-1:i+2]

    r = {str(uuid.uuid4()): ans_batches}
    response = {
        "isBase64Encoded":False,
        "statusCode":200,
        "headers":{
            "Content-Type":"application/json",
            "Access-Control-Allow-Origin":"*",
        },
        "body":json.dumps(r)
    }

    print(r)
    return response