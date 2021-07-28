from pipelines import pipeline as qg_pipeline
from transformers import pipeline as qa_pipeline
from scorer import Scorer
from scraper import Scraper
import os
import time

def gen_qaqg(context):
	if context.endswith(".txt"):
		with open(context, "r") as f:
			return gen_qaqg(f.read())

	qg = qg_pipeline()
	qa = qa_pipeline('question-answering', model="distilbert-base-cased-distilled-squad")

	questions = qg(context)

	answers = [qa(question=question, context=context)["answer"] for question in questions]

	return list(zip(questions1, answers))

def init_pipelines():
	model_name = "deepset/roberta-base-squad2"

	# return qg_pipeline(), qa_pipeline('question-answering', model="lysandre/bidaf-elmo-model-2020.03.19")
	return qg_pipeline(), qa_pipeline('question-answering', model=model_name, tokenizer=model_name)

def gen_qg(context):
	if context.endswith(".txt"):
		with open(context, "r") as f:
			return gen_qg(f.read())

	# qg = qg_pipeline()
	return qg(context)

def gen_qa(questions, context):
	# qa = qa_pipeline('question-answering', model="distilbert-base-cased-distilled-squad")
	return [qa(question=question, context=context)["answer"] for question in questions]

def interactive():
	scorer=Scorer()
	scraper = Scraper()
	qg, qa = init_pipelines()

	now = time.time()
	while True and (time.time()-now) < 60:
		url  = input("Enter a URL: ")
		context = scraper.get_text(url)
		context = context.split()
		n=100
		contexts = [' '.join(context[i:i+n]) for i in range(0, len(context), n)]

		for context in contexts:
			start_time = time.time()

			questions = qg(context)
			answers = [qa(question=question, context=context)["answer"] for question in questions]
			print(questions)
			print(answers)

			print(time.time() - start_time, "seconds")


			for gen_q,gen_ans in zip(questions, answers):
				if len(gen_q.split()) not in range(6, 22
				): continue #10: continue
				# if len(gen_q.split()) <= 4: continue
				if gen_q.split()[0].lower() == "when": continue
				if gen_q.split()[0].lower() == "who": continue
				# Sam: if doesn't end with a question, break it
				if gen_q[-1].lower() != "?": continue
				if len(gen_ans.split()) > 12: continue #10: continue




				print("-"*20)
				print(f"\nQuestion: {gen_q}")
				user_ans = input("Your Answer: ")
				ans_score = scorer.score([gen_ans, user_ans])
				if ans_score < 0.5:
					print(f"Wrong answer. Correct answer is: {gen_ans}.\n")
				else:
					print(f"Correct. Correct answer is: {gen_ans}.\n")



def __main__():
	# context = "Riemannian geometry studies Riemannian manifolds, smooth manifolds with a Riemannian metric. \
	# This is a concept of distance expressed by means of a smooth positive definite symmetric bilinear form defined \
	# on the tangent space at each point. Riemannian geometry generalizes Euclidean geometry to spaces that are not \
	# necessarily flat, though they still resemble Euclidean space at each point infinitesimally, i.e. in the first \
	# order of approximation. Various concepts based on length, such as the arc length of curves, area of plane regions,\
	# and volume of solids all possess natural analogues in Riemannian geometry. The notion of a directional derivative\
	# of a function from multivariable calculus is extended to the notion of a covariant derivative of a tensor. Many \
	# concepts of analysis and differential equations have been generalized to the setting of Riemannian manifolds. A \
	# distance-preserving diffeomorphism between Riemannian manifolds is called an isometry. This notion can also be \
	# defined locally, i.e. for small neighborhoods of points. Any two regular curves are locally isometric. However, \
	# the Theorema Egregium of Carl Friedrich Gauss showed that for surfaces, the existence of a local isometry imposes\
	# that the Gaussian curvatures at the corresponding points must be the same. In higher dimensions, the Riemann \
	# curvature tensor is an important pointwise invariant associated with a Riemannian manifold that measures how \
	# close it is to being flat. An important class of Riemannian manifolds is the Riemannian symmetric spaces, whose\
	# curvature is not necessarily constant. These are the closest analogues to the 'ordinary' plane and space \
	# considered in Euclidean and non-Euclidean geometry"
	
	interactive()

__main__()