from pipelines_sagemaker import QGSagemaker, QASagemaker 
from scraper import Scraper
import uuid
import json

class LambdaFlashcards:
    def __init__(self):
        self.qg_model=QGSagemaker()
        self.qa_model=QASagemaker()
        self.scraper=Scraper()
        print("LambdaFlashcards OBJECT SUCCESSFULLY INITIALIZED")

    def _filter(self, question):
        return (
            len(question.split()) <= 5 or
            question.split()[0].lower() in ["when", "who"] or
            question[-1].lower() != "?" or
            not [question_word in question.lower() for question_word in ["what", "where", "how"]]
        )

    def _batch(self, context, batch_size=30):
        tokens = context.split()
        return [' '.join(tokens[i:i+batch_size]) for i in range(0, len(tokens), batch_size)]

    def __call__(self, src):
        r = []

        context=self.scraper.get_text(src)
        print("Scraper OBJECT METHOD get_text EXITED SUCCESSFULLY")
        batches=self._batch(context)
        print("LambdaFlashcards OBJECT METHOD _batch EXITED SUCCESSFULLY")

        for i, batch in enumerate(batches):
            batch_questions=self.qg_model(batch)
            print("QGSagemaker OBJECT METHOD __call__ EXITED SUCCESSFULLY")
            for question in batch_questions:
                if self._filter(question): continue
                if i == 0:
                    qa_context = ".".join([batches[i], batches[i+1]])
                else:
                    qa_context = ".".join(batches[i-1:i+2])
                answer = self.qa_model(question, qa_context)
                print("QASagemaker OBJECT METHOD __call__ EXITED SUCCESSFULLY")
                ret = {
                    "question":question,
                    "answer":answer,
                    "context":qa_context
                }
                print(ret)
                r.append(ret)
        print(r)
        return r

