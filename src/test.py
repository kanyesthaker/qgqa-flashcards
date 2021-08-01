import os
import io
import boto3
import json
import csv
import time
import sagemaker
from sagemaker.predictor import json_serializer, json_deserializer, Predictor

ENDPOINT_NAME = "huggingface-pytorch-inference-2021-08-01-00-56-34-532"
QG_NAME = "huggingface-pytorch-inference-2021-08-01-02-08-36-571"

if __name__=="__main__":
    now = time.time()
    payload = {"inputs": {
                "question": "What is used for inference?",
                "context": "My Name is Philipp and I live in Nuremberg. This model is used with sagemaker for inference."
                }
            }

    predictor = Predictor(endpoint_name=ENDPOINT_NAME, sagemaker_session=sagemaker.Session(), serializer = json_serializer, content_type="text/csv", accept='application/json')
    print(predictor.predict(payload))

    qg_gen = Predictor(endpoint_name=ENDPOINT_NAME, sagemaker_session=sagemaker.Session(), seralizer=json_serializer, content_type="text/csv", accept='application/json')

    args = {
            "max_length": 2048, #256
            "num_beams": 4,
            "length_penalty": 0, #1.5
            "no_repeat_ngram_size": 3,
            "early_stopping": False, #True
        }