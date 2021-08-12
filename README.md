# Ferret

Ferret is a Chrome extension that uses NLP to generate and ask helpful recall-based questions to reinforce key concepts for almost anything you read on the internet. Ferret uses T5 (question generation) and RoBERTa (question answering), served on an AWS Sagemaker instance, to dynamically generate questions and answers from the contents of any website, which are then rendered in a React.js extension.

![Demo of our product](https://github.com/kanyesthaker/qgqa-flashcards/blob/main/demo.gif)

## Motivation

Ferret is a helpful sidekick for when you're learning interesting, challenging content that you'd like to better remember. Perhaps you're reading about the nuts and bolts of how transformers work in NLP, skimming documentation to remember the return value of a certain Javascript method, or following class notes from an art history lecture. But how much did you really take away from that article? And how much will you honestly remember a few hours or a day later?

You may take notes during a class or while reading a book, but we rarely have the time to take a step back and do this for the mountain of content that we learn online. We're excited to imagine how much more you could create if you could burn the content you cared about into your memory. We hope that Ferret can be the first step towards helping you get there.

We hope to extend the work done in augmenting memory by researchers such as Andy Matuschak and Michael Nielsen in their work in Quantum Country, where they manually created spaced repetition flashcards to pair with content.

Ferret is in alpha-release right now, which means that you'll encounter bugs and slower latency than we'd like. However, we welcome your contributions, and will actively review PRs and issues.

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

## References:

1. Quantum Computing for the Very Curious https://quantum.country/qcvc
2. T5-Base-E2E-QG https://huggingface.co/valhalla/t5-base-e2e-qg
3. RoBERTa-Base-SQuAD2 https://huggingface.co/deepset/roberta-base-squad2
