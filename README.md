# Ferret
Ferret is a flashcard generator chrome extension. It's inspired in part by Andy Matuschak's [interactive quantum computing book](https://quantum.country/) which offers readers recall-based questions as they are reading to reinforce key concepts. Ferret uses T5 (question generation) and RoBERTa (question answering), served on an AWS Sagemaker instance, to dynamically generate questions and answers from the contents of any website, which are then rendered in a React.js extension.

## Install the Extension
To install Ferret, you'll need to have Node.js and npm installed. To check if you have npm, type `npm -v` into your terminal (it should print out a version number). If this doesn't work, use `brew install node` and it should install the required tools. 
1. Clone this repo using `git clone git@github.com:kanyesthaker/qgqa-flashcards.git`
2. Navigate to the `web-app` folder
3. Run `npm install` to require the required `node-modules`
4. Run `npm run build` -- this will build a production version of the app and create a `build` folder in the `web-app` folder
5. Open Google Chrome and type `chrome://extensions` in the search bar (alternatively, right click the puzzle piece icon in the top right and click on "Manage Extensions")
6. Select "Load unpacked" in the top left
7. Select the `build` folder you just created
Congrats! You now have Ferret installed. If you ever need to "re-build" the application, simply repeat steps 4-7. 

## To run only the backend functions using the terminal interactive session:

1. Create virtual environment with `python -m venv .env`
2. Start virtual environment with `source .env/bin/activate`
3. Install requirements with `pip install -r requirements.txt`
4. Run `python -W ignore main.py online`
5. When done, run `deactivate` to close the venv
