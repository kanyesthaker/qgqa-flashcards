#!/bin/bash

POSITIONAL=()
while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -n|--name)
	NAME="$2"
	shift
	shift
	;;
    -h|--handler)
    HANDLER="$2"
    HANDLER="${HANDLER:- }"
    shift
    shift
    ;;
    -d|--deployment)
    DEPLOY="$2"
    shift
    shift
    ;;
	# -p|--permission)
	# PERM="$2"
	# PERM="${PERM:-default}"
	# shift
	# shift
	# ;;
    *)    # unknown option
    POSITIONAL+=("$1") # save it in an array for later
    shift # past argument
    ;;
esac
done
set -- "${POSITIONAL[@]}" # restore positional parameters

pip install --target ./package -r requirements.txt
find ./package -type d -name "tests" -exec rm -rfv {} +
find ./package -type d -name "__pycache__" -exec rm -rfv {} +
rm -rf package/numpy*
curl "https://files.pythonhosted.org/packages/9b/04/c3846024ddc7514cde17087f62f0502abf85c53e8f69f6312c70db6d144e/numpy-1.19.2-cp37-cp37m-manylinux2010_x86_64.whl" -o "numpy-1.19.2-cp36-cp36m-manylinux1_x86_64.whl"
unzip numpy-1.19.2-cp37-cp37m-manylinux2010_x86_64.whl -d package
cd package
zip -r9 ${OLDPWD}/function.zip .
cd ${OLDPWD}
zip -g function.zip "${POSITIONAL[@]}"
if [ "${DEPLOY}" = deploy ]
then
    aws lambda create-function --function-name "${NAME}" --runtime python3.8 --zip-file fileb://function.zip --handler "${HANDLER}" --role arn:aws:iam::060605871980:role/SagemakerFull
fi
if [ "${DEPLOY}" = update ]
then
    aws lambda update-function-code --function-name "${NAME}" --zip-file fileb://function.zip
fi
rm ./function.zip
rm numpy-*
sudo rm -rf ./package

cd ..
git add *
git commit -m "${DEPLOY} AWS Lambda function ${NAME}"
git push origin main