# qgqa-flashcards

## TO RUN THE FLASHCARDS LOCALLY:

1. Create virtual environment with `python -m venv .env`
2. Start virtual environment with `source .env/bin/activate`
3. Install requirements with `pip install -r requirements.txt`
4. Run `python -W ignore main.py` (the flag supresses pytorch warnings)
5. When done, run `deactivate` to close the venv

## TO RUN THE FLASHCARDS USING AWS DEPLOYED MODELS:

1. Create virtual environment with `python -m venv .env`
2. Start virtual environment with `source .env/bin/activate`
3. Install requirements with `pip install -r requirements.txt`
4. Run `python -W ignore main.py online`
5. When done, run `deactivate` to close the venv

## TO LAUNCH UPDATES TO AWS LAMBDA:

1. Create your new lambda function in `aws/main.py`
2. Run the deployment shell script `sh deploy.sh` with the following flags: `-n NAME` the desired name of the function in AWS, `-h HANDLER` the location of the function; for example the function `test(event, context)` in `main.py` would be handled as `main.test`, and `-d DEPLOY` either "deploy" or "update" depending on whether it is the first invocation of that function. Follow this with a space-separated list of all the files that are required for the function. An example is shown:
3. `sh deploy.sh -n segment-text -h main.segment_text -d deploy main.py pipelines_sagemaker.py lambdaflashcards.py scraper.py __init__.py requirements.txt`
