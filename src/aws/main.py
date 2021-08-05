import boto3
import json
from lambdaflashcards import LambdaFlashcards
import urllib
import time
import uuid
from scraper import Scraper
from pipelines_sagemaker import QGSagemaker, QASagemaker

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
            ans_batches[i] = " ".join(question_batches[i:i+2])
        else:
            ans_batches[i] = " ".join(question_batches[i-1:i+2])

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

def generate_single(event, context):
    def filter(question):
        return (
            len(question.split()) <= 5 or
            question.split()[0].lower() in ["when", "who"] or
            question[-1].lower() != "?" or
            not [question_word in question.lower() for question_word in ["what", "where", "how"]]
        )

    context = event["ctx"]
    context_list=context.split(" ")
    if len(context_list) <= 100:
        qg_context = " ".join(context_list[:50])
    else:
        qg_context = " ".join(context_list[50:100])

    now = time.time()
    qg_model = QGSagemaker()
    qa_model = QASagemaker()
    print(f"Time to initialize models: {now-time.time()}s")
    now = time.time()
    question = qg_model(qg_context)[0]
    print(f"Time to generate question: {now-time.time()}s")
    if not filter(question):
        now = time.time()
        payload = {
            "question": question,
            "answer": qa_model(question, context),
            "context": context,
        }
        print(f"Time to generate answer: {now-time.time()}s")
    else:
        payload = {
            "question": None,
            "answer": None,
            "context": context,
        }

    r = { str(uuid.uuid4()) : payload }
    response = {
        "isBase64Encoded":False,
        "statusCode":200,
        "headers":{
            "Content-Type":"application/json",
            "Access-Control-Allow-Origin":"*",
        },
        "body":json.dumps(r)
    }

    return response
