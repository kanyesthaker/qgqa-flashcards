from pipelines import pipeline as qg_pipeline
from pipelines_onnx import QGPipeline
from transformers import pipeline as qa_pipeline
from scorer import Scorer
from scraper import Scraper
import os
import time

def init_pipelines():
	model_name = "deepset/roberta-base-squad2"

	# return qg_pipeline(), qa_pipeline('question-answering', model="lysandre/bidaf-elmo-model-2020.03.19")
	return QGPipeline(), qa_pipeline('question-answering', model=model_name, tokenizer=model_name)

def filter(q, a):
	return (
		len(q.split()) <= 5 or
		q.split()[0].lower() in ["when", "who"] or
		q[-1].lower() != "?" or
		not [question_word in gen_q for question_word in ["what", "where", "how"]]
	)

def interactive():
	scorer=Scorer()
	scraper = Scraper()
	qg, qa = init_pipelines()


	while True:
		url  = input("Enter a URL: ")
		context = scraper.get_text(url)
		context = context.split()
		n=100
		contexts = [' '.join(context[i:i+n]) for i in range(0, len(context), n)]

		# for each batch of 100 words
		for context in contexts:
			# generate a set of questions
			now = time.time()
			questions = qg(context)
			print(f"QG TIME: {time.time()-now}")
			# generate a set of answers matching those questions
			now=time.time()
			# answers = [qa(question=question, context=context)["answer"] for question in questions]
			print(f"QA TIME: {time.time()-now}")
			print(f"NUM QUESTIONS GENERATED: {len(questions)}")

			# filter
			for gen_q in questions:
				print("-"*20)
				if filter(gen_q): continue
				print("ACCEPTED")
				print(f"\nQuestion: {gen_q}")
				answer = qa(question=gen_q, context=context)["answer"]
				user_ans = input("Your Answer: ")
				ans_score = scorer.score([answer, user_ans])
				if ans_score < 0.5:
					print(f"Wrong answer. Correct answer is: {answer}.\n")
				else:
					print(f"Correct. Correct answer is: {answer}.\n")



def __main__():
	interactive()

__main__()