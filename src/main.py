import time
from flashcards import Flashcards
import sys

if __name__=='__main__':
	if "online" in sys.argv:
		flashcards = Flashcards(online=True)
	else:
		flashcards = Flashcards()

	flashcards.start_interactive_session()