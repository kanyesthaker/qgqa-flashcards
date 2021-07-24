# from pipelines import pipeline as qg_pipeline
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
	return qg_pipeline(), qa_pipeline('question-answering', model="distilbert-base-cased-distilled-squad")

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

	while True:
		url = input("Enter a URL: ")
		context = scraper.get_text(url)
		# context="Johannes Kepler's work Stereometrica Doliorum formed the basis of integral calculus.[14] Kepler developed a method \"sum of the radii\" for calculating the area of an ellipse.[15] A significant work was a treatise, the origin being Kepler's methods,[15] written by Bonaventura Cavalieri, who argued that volumes and areas should be computed as the sums of the volumes and areas of infinitesimally thin cross-sections. The ideas were similar to Archimedes' in The Method, but this treatise is believed to have been lost in the 13th century, and was only rediscovered in the early 20th century, and so would have been unknown to Cavalieri. Cavalieri's work was not well respected since his methods could lead to erroneous results, and the infinitesimal quantities he introduced were disreputable at first. The formal study of calculus brought together Cavalieri's infinitesimals with the calculus of finite differences developed in Europe at around the same time. Pierre de Fermat, claiming that he borrowed from Diophantus, introduced the concept of adequality, which represented equality up to an infinitesimal error term.[16] The combination was achieved by John Wallis, Isaac Barrow, and James Gregory, the latter two proving the second fundamental theorem of calculus around 1670. Isaac Newton developed the use of calculus in his laws of motion and gravitation. The product rule and chain rule,[17] the notions of higher derivatives and Taylor series,[18] and of analytic functions[citation needed] were used by Isaac Newton in an idiosyncratic notation which he applied to solve problems of mathematical physics. In his works, Newton rephrased his ideas to suit the mathematical idiom of the time, replacing calculations with infinitesimals by equivalent geometrical arguments which were considered beyond reproach. He used the methods of calculus to solve the problem of planetary motion, the shape of the surface of a rotating fluid, the oblateness of the earth, the motion of a weight sliding on a cycloid, and many other problems discussed in his Principia Mathematica (1687). In other work, he developed series expansions for functions, including fractional and irrational powers, and it was clear that he understood the principles of the Taylor series. He did not publish all these discoveries, and at this time infinitesimal methods were still considered disreputable. Gottfried Wilhelm Leibniz was the first to state clearly the rules of calculus. These ideas were arranged into a true calculus of infinitesimals by Gottfried Wilhelm Leibniz, who was originally accused of plagiarism by Newton.[19] He is now regarded as an independent inventor of and contributor to calculus. His contribution was to provide a clear set of rules for working with infinitesimal quantities, allowing the computation of second and higher derivatives, and providing the product rule and chain rule, in their differential and integral forms. Unlike Newton, Leibniz paid a lot of attention to the formalism, often spending days determining appropriate symbols for concepts. Today, Leibniz and Newton are usually both given credit for independently inventing and developing calculus. Newton was the first to apply calculus to general physics and Leibniz developed much of the notation used in calculus today. The basic insights that both Newton and Leibniz provided were the laws of differentiation and integration, second and higher derivatives, and the notion of an approximating polynomial series. By Newton's time, the fundamental theorem of calculus was known."
		
		questions = qg(context)
		answers = [qa(question=question, context=context)["answer"] for question in questions]

		for gen_q,gen_ans in zip(questions, answers):
			print(f"\nQuestion: {gen_q}")
			user_ans = input()
			ans_score = scorer.score([gen_ans, user_ans])
			if ans_score < 0.5:
				print(f"Wrong answer. Correct answer is: {gen_ans}.\n")
			else:
				print(f"Correct. Correct answer is: {gen_ans}\n.")


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