import os
import io
import json
import time
import sagemaker
from sagemaker.predictor import json_deserializer, Predictor
from sagemaker.serializers import NumpySerializer, JSONSerializer
from sagemaker.deserializers import JSONDeserializer
import torch
import fastT5
from transformers import AutoTokenizer
import transformers
import time
import os
from scorer import Scorer
from scraper import Scraper

ENDPOINT_NAME = "huggingface-pytorch-inference-2021-08-01-00-56-34-532"
QG_NAME = "valhalla-t5-small-e2e-qg-20210802-2021-08-03-00-19-03-232"

class QG_SAGEMAKER:
    def __init__(self):
        # self.tokenizer = AutoTokenizer.from_pretrained("valhalla/t5-base-e2e-qg")
        self.session = sagemaker.Session()
        self.serializer=JSONSerializer()
        self.deserializer=JSONDeserializer()
        now = time.time()
        self.predictor = Predictor(
            endpoint_name=QG_NAME,
            sagemaker_session=self.session,
            serializer=self.serializer,
            deserializer=self.deserializer
            # content_type="application/x-npy",
            # accept="application/json",
        )
        print(f"Spinning up... {time.time()-now}s")
        self.inference_kwargs = {
            "max_length": 2048, #256
            "num_beams": 4,
            "length_penalty": 0, #1.5
            "no_repeat_ngram_size": 3,
            "early_stopping": False, #True
        }

    def __call__(self, context, **generate_kwargs):
        # inputs = self._prepare_inputs(context)

        if not generate_kwargs:
            generate_kwargs = self.inference_kwargs

        # input_length = inputs["input_ids"].shape[-1]

        # payload ={
        #     "inputs":{ 
        #         "input_ids":inputs["input_ids"].cpu().detach().numpy(),
        #         "attention_mask":inputs["attention_mask"].cpu().detach().numpy(),
        #     }
        # }
        now = time.time()
        payload = {"inputs":context}

        # TODO: Can't pass tensors into Sagemaker Prediction
        # Need to pass plaintext input in Lambda
        # Then have inference script in Docker container
        # to handle deserialization of Torch Tensors
        # for model, and then handle deserializing in Lambda
        # payload = {**payload, **generate_kwargs}
        # print(payload)
        outs = self.predictor.predict(payload)
        # print(outs)

        # prediction = self.tokenizer.decode(outs, skip_special_tokens=True)
        # questions = prediction.split("<sep>")
        # questions = [question.strip() for question in questions[:-1]]
        print(outs)
        questions = outs[0]['generated_text'].split("<sep>")[0].strip()
        print(questions)
        print(f"{time.time()-now} seconds")
        return questions

    def _prepare_inputs(self, context):
        source = f"generate questions: {context} </s>"
        inputs = self._tokenize([source], padding=False)
        return inputs

    def _tokenize(
        self,
        inputs,
        padding=True,
        truncation=True,
        add_special_tokens=True,
        max_length=512
    ):
        inputs = self.tokenizer(
            inputs, 
            max_length=max_length,
            add_special_tokens=add_special_tokens,
            truncation=truncation,
            padding="max_length" if padding else False,
            pad_to_max_length=padding,
            return_tensors="pt"
        )
        return inputs

if __name__=="__main__":
    pipeline = QG_SAGEMAKER()
    text= """Gated RNNs process tokens sequentially, maintaining a state vector that contains a representation of the data seen after every token. To process the {\textstyle n}{\textstyle n}th token, the model combines the state representing the sentence up to token {\textstyle n-1}{\textstyle n-1} with the information of the new token to create a new state, representing the sentence up to token {\textstyle n}{\textstyle n}. Theoretically, the information from one token can propagate arbitrarily far down the sequence, if at every point the state continues to encode contextual information about the token. In practice this mechanism is flawed: the vanishing gradient problem leaves the model's state at the end of a long sentence without precise, extractable information about preceding tokens."""
    pipeline(text)
    # now = time.time()
    # payload = {"inputs": {
    #             "question": "What is used for inference?",
    #             "context": "My Name is Philipp and I live in Nuremberg. This model is used with sagemaker for inference."
    #             }
    #         }

    # predictor = Predictor(endpoint_name=ENDPOINT_NAME, sagemaker_session=sagemaker.Session(), serializer = json_serializer, content_type="text/csv", accept='application/json')
    # print(predictor.predict(payload))


    # args = {
    #         "max_length": 2048, #256
    #         "num_beams": 4,
    #         "length_penalty": 0, #1.5
    #         "no_repeat_ngram_size": 3,
    #         "early_stopping": False, #True
    #     }