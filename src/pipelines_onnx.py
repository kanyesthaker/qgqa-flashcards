import torch
import fastT5
from transformers import AutoTokenizer
import time
import os

class QGPipeline:
    def __init__(self, model="valhalla/t5-base-e2e-qg", use_cuda=False):
        self.tokenizer = AutoTokenizer.from_pretrained(model)
        self.model = self.__onnx_init__(model)
        self.device = "cuda" if torch.cuda.is_available() and use_cuda else "cpu"

        self.model.to(self.device)

        self.default_generate_kwargs = {
            "max_length": 256, #256
            "num_beams": 5,
            "num_return_sequences": 2,
            "max_time":5,
            "length_penalty": 2, #1.5
            "no_repeat_ngram_size": 3,
            "early_stopping": False, #True
        }
        # assert self.model.__class__.__name__ in ["T5ForConditionalGeneration", "BartForConditionalGeneration"]

    def __onnx_init__(self, model="valhalla/t5-base-e2e-qg"):
        if not "models" in next(os.walk("."))[1]:
            return fastT5.export_and_get_onnx_model(model)

        files =[name for name in os.listdir('./models/') if model.split("/")[-1] in name]
        if len(files) != 6:
            return fastT5.export_and_get_onnx_model(model)
        else:
            return fastT5.get_onnx_model(model)


    def __call__(self, context, **generate_kwargs):
        inputs = self._prepare_inputs(context)

        if not generate_kwargs:
            generate_kwargs = self.default_generate_kwargs

        input_length = inputs["input_ids"].shape[-1]

        outs = self.model.generate(
            input_ids=inputs["input_ids"].to(self.device),
            attention_mask=inputs["attention_mask"].to(self.device),
            **generate_kwargs
        )

        prediction = self.tokenizer.decode(outs.squeeze()[0], skip_special_tokens=True)
        questions = prediction.split("<sep>")
        questions = [question.strip() for question in questions[:-1]]
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

class QAPipeline:
    def __init__(self, model=""):
        pass