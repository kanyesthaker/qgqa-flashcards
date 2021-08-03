# qgqa-flashcards

TO RUN THE FLASHCARDS LOCALLY:

1. Create virtual environment with `python -m venv .env`
2. Start virtual environment with `source .env/bin/activate`
3. Install requirements with `pip install -r requirements.txt`
4. Run `python -W ignore main.py` (the flag supresses pytorch warnings)
5. When done, run `deactivate` to close the venv

TO RUN THE FLASHCARDS USING AWS DEPLOYED MODELS:

1. Create virtual environment with `python -m venv .env`
2. Start virtual environment with `source .env/bin/activate`
3. Install requirements with `pip install -r requirements.txt`
4. Run `python -W ignore main.py online`
5. When done, run `deactivate` to close the venv
