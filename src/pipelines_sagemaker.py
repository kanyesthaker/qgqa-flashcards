import os
import io
import json
import sagemaker
from sagemaker.predictor import json_deserializer, Predictor
from sagemaker.serializers import NumpySerializer, JSONSerializer
from sagemaker.deserializers import JSONDeserializer
import torch
import transformers
import time
from scorer import Scorer
from scraper import Scraper

QA_NAME = "huggingface-pytorch-inference-2021-08-01-00-56-34-532"
QG_NAME = "valhalla-t5-small-e2e-qg-20210802-2021-08-03-00-19-03-232"

class QGSagemaker:
    def __init__(self):
        self.session = sagemaker.Session()
        self.serializer=JSONSerializer()
        self.deserializer=JSONDeserializer()
        self.predictor = Predictor(
            endpoint_name=QG_NAME,
            sagemaker_session=self.session,
            serializer=self.serializer,
            deserializer=self.deserializer
        )

    def __call__(self, context):
        payload = {"inputs":context}
        outs = self.predictor.predict(payload)
        questions = outs[0]['generated_text'].split("<sep>")[0].strip()
        return [questions]

class QASagemaker:
    def __init__(self):
        self.session = sagemaker.Session()
        self.serializer=JSONSerializer()
        self.deserializer=JSONDeserializer()
        self.predictor = Predictor(
            endpoint_name=QA_NAME,
            sagemaker_session=self.session,
            serializer=self.serializer,
            deserializer=self.deserializer
        )

    def __call__(self, question, context):
        payload = {
            "inputs": {
                "question":question,
                "context":context,
            },
        }

        answer = self.predictor.predict(payload)['answer']
        return answer
