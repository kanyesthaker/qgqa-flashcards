from pipelines import pipeline as qg_pipeline
from transformers import pipeline as qa_pipeline
import os

def gen_qaqg(context):
	if context.endswith(".txt"):
		with open(context, "r") as f:
			return gen_qaqg(f.read())

	qg1 = qg_pipeline()
	qg2 = qg_pipeline(model="BART")
	qa = qa_pipeline('question-answering', model="distilbert-base-cased-distilled-squad")

	now=time.time()
	questions1 = qg1(context)
	print("HERE HERE HERE!!!\n\n")
	print(f"\nT5 inference: {time.time()-now}s\n")
	now=time.time()
	questions2 = qg2(context)
	print(f"\nBART inference: {time.time()-now}s\n")

	answers = [qa(question=question, context=context)["answer"] for question in questions1]

	return list(zip(questions, answers))

def __main__():
	context = "Gravity (from Latin gravitas, meaning 'weight'), or gravitation, is a natural phenomenon by which all \
things with mass or energy—including planets, stars, galaxies, and even light—are brought toward (or gravitate toward) \
one another. On Earth, gravity gives weight to physical objects, and the Moon's gravity causes the ocean tides. \
The gravitational attraction of the original gaseous matter present in the Universe caused it to begin coalescing \
and forming stars and caused the stars to group together into galaxies, so gravity is responsible for many of \
the large-scale structures in the Universe. Gravity has an infinite range, although its effects become increasingly \
weaker as objects get further away"
	
	print(gen_qaqg(context))

__main__()