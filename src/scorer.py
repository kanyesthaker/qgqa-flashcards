from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

class Scorer:
	def __init__(self):
		self.model = SentenceTransformer("paraphrase-MiniLM-L6-v2")

	def _gen_embeddings(self, sentence):
		return self.model.encode(sentence)

	def verify(self, sentences, threshold=0.5, verbose=False):
		fvec1, fvec2 = list(map(self._gen_embeddings, sentences))
		score=cosine_similarity(fvec1.reshape(1, -1), fvec2.reshape(1, -1))[0][0]
		if verbose:
			return {
				"cosine_similarity":score,
				"sentence_a":sentences[0],
				"sentence_b":sentences[1],
				"threshold":threshold,
				"pass":score >= threshold
			}
		else:
			return score >= threshold


# def __main__():
# 	scorer = Scorer()
# 	print(scorer.compare(["I am a boy", "A boy is what I am"]))


# __main__()