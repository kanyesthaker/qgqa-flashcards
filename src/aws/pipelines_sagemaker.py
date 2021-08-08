import sagemaker
from sagemaker.predictor import json_deserializer, Predictor
from sagemaker.serializers import NumpySerializer, JSONSerializer
from sagemaker.deserializers import JSONDeserializer
import time

QA_NAME = "huggingface-pytorch-inference-2021-08-01-00-56-34-532"
QG_NAME = "valhalla-t5-base-e2e-qg-2021-08-07-19-27-14-725"

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
        print("QGSagemaker OBJECT SUCCESFULLY INITIALIZED")

    def __call__(self, context):
        payload = {"inputs":context}
        outs = self.predictor.predict(payload)
        questions = outs[0]['generated_text'].split("<sep>")[0].strip()
        print("QGSagemaker OBJECT METHOD __call__ EXITED SUCCESSFULLY")
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
        print("QASagemaker OBJECT SUCCESFULLY INITIALIZED")

    def __call__(self, question, context):
        payload = {
            "inputs": {
                "question":question,
                "context":context,
            },
        }

        answer = self.predictor.predict(payload)['answer']
        print("QASagemaker OBJECT METHOD __call__ EXITED SUCCESSFULLY")
        return answer
