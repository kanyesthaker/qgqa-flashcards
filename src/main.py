from pipelines import pipeline as qg_pipeline
from transformers import pipeline as qa_pipeline
import os

def gen_qaqg(context):
	if context.endswith(".txt"):
		with open(context, "r") as f:
			return gen_qaqg(f.read())

	qg = qg_pipeline()
	qa = qa_pipeline('question-answering', model="distilbert-base-cased-distilled-squad")

	questions = qg(context)
	answers = [qa(question=question, context=context)["answer"] for question in questions]

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