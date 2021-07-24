from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

class Scorer:
	def __init__(self):
		self.model = SentenceTransformer("paraphrase-MiniLM-L6-v2")

	def gen_embeddings(self, sentence):
		return self.model.encode(sentence)

	def score(self, sentences):
		fvec1, fvec2 = list(map(self.gen_embeddings, sentences))
		return cosine_similarity(fvec1.reshape(1, -1), fvec2.reshape(1, -1))[0][0]


# def __main__():
# 	scorer = Scorer()
# 	print(scorer.compare(["I am a boy", "A boy is what I am"]))


# __main__()