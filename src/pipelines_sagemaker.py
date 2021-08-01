import os
import io
import json
import time
import sagemaker
from sagemaker.predictor import json_serializer, json_deserializer, Predictor
import torch
import fastT5
from transformers import AutoTokenizer
import transformers
import time
import os
from scorer import Scorer
from scraper import Scraper

ENDPOINT_NAME = "huggingface-pytorch-inference-2021-08-01-00-56-34-532"
QG_NAME = "huggingface-pytorch-inference-2021-08-01-02-08-36-571"

class QG_SAGEMAKER:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained("valhalla/t5-base-e2e-qg")
        self.session = sagemaker.Session()
        self.predictor = Predictor(
            endpoint_name=QG_NAME,
            sagemaker_session=self.session,
            serializer=None,
            content_type="application/jsonlines",
            accept="application/json",
        )
        self.inference_kwargs = {
            "max_length": 2048, #256
            "num_beams": 4,
            "length_penalty": 0, #1.5
            "no_repeat_ngram_size": 3,
            "early_stopping": False, #True
        }

    def __call__(self, context, **generate_kwargs):
        inputs = self._prepare_inputs(context)

        if not generate_kwargs:
            generate_kwargs = self.inference_kwargs

        input_length = inputs["input_ids"].shape[-1]

        payload = {"inputs":
            {
                "input_ids":inputs["input_ids"],
                "attention_mask":inputs["attention_mask"],
            }
        }

        # TODO: Can't pass tensors into Sagemaker Prediction
        # Need to pass plaintext input in Lambda
        # Then have inference script in Docker container
        # to handle deserialization of Torch Tensors
        # for model, and then handle deserializing in Lambda
        payload = {**payload, **generate_kwargs}
        print(payload)
        outs = self.predictor.predict(payload)
        print(outs)

        prediction = self.tokenizer.decode(outs.squeeze()[0], skip_special_tokens=True)
        questions = prediction.split("<sep>")
        questions = [question.strip() for question in questions[:-1]]
        print(questions)
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
    pipeline("A bean is the seed of one of several genera of the flowering plant family Fabaceae, which are used as vegetables for human or animal food. They can be cooked in many different ways, including boiling, frying, and baking, and are used in many traditional dishes throughout the world.")
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