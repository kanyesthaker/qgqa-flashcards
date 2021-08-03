from transformers import pipeline
from pipelines_onnx import QGPipeline
from pipelines_sagemaker import QGSagemaker, QASagemaker 
from scorer import Scorer
from scraper import Scraper
from yaspin import yaspin
from yaspin.spinners import Spinners
import time

class Flashcards:
    def __init__(
        self,
        qg_model="valhalla/t5-base-e2e-qg",
        qa_model="deepset/roberta-base-squad2",
        use_cuda=False,
        online=False,
    ):
        self.online = online
        if not self.online:
            self.qg_model = self._spinner(
                "Loading Question Generation Model...",
                QGPipeline,
                model=qg_model,
                use_cuda=use_cuda
            )
            self.qa_model = self._spinner(
                "Loading Question Answering Model...",
                pipeline,
                'question-answering',
                model=qa_model,
                tokenizer=qa_model
            )
        else:
            self.qg_model = self._spinner(
                "Loading Sagemaker QG Model...",
                QGSagemaker
            )
            self.qa_model = self._spinner(
                "Loading Sagemaker QA Model...",
                QASagemaker
            )

        self.use_cuda = use_cuda
        self.scorer = Scorer()
        self.scraper = Scraper()

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

    def _spinner(self, text, fn, *args, **kwargs):
        now = time.time()
        with yaspin(Spinners.line) as sp:
            sp.text = text
            ret = fn(*args, **kwargs)
            sp.ok("✅ ")
            print(f"Completed in {round(time.time()-now, 2)}s.")
        return ret

    def start_interactive_session(self, verbose=False):
        # TODO: implement timing checkers for verbosity
        assert self.use_cuda==False

        print("\n"+"-"*40)
        print("""  ______                 _   
|  ____|               | |  
| |__ ___ _ __ _ __ ___| |_ 
|  __/ _ \\ '__| '__/ _ \\ __|
| | |  __/ |  | | |  __/ |_ 
|_|  \\___|_|  |_|  \\___|\\__|\n\n""")
        print("NLP-Powered Automatic Flashcards")
        print("-"*40)
        while True:
            url = input("\nEnter a URL to generate flashcards: ")
            context = self.scraper.get_text(url)
            batches = self._batch(context)
            num_batches = len(batches)
            
            for i, batch in enumerate(batches):
                batch_questions = self._spinner(
                    f"Generating Questions for batch [{i+1}/{num_batches}]...",
                    self.qg_model,
                    batch
                )

                for question in batch_questions:
                    if self._filter(question): continue
                    if i == 0:
                        qa_context = ".".join([batches[i], batches[i+1]])
                    else:
                        qa_context = ".".join(batches[i-1:i+2])
                    if not self.online:
                        answer = self.qa_model(question=question, context=batch)["answer"]
                    else:
                        answer = self.qa_model(question, qa_context)
                    print("-"*40)
                    print(f"\nQuestion: {question}")
                    user_input = input("Your Answer: ")
                    if self.scorer.verify([user_input, answer]):
                        print("Correct!\n")
                    else:
                        print(f"Incorrect! Correct answer: {answer}\n")


        
