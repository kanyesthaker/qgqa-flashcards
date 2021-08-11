import boto3
import datetime

def record_feedback(event, context):
	dynamodb = boto3.resource("dynamodb")
	table = dynamodb.Table("ferret-feedback")

	table.put_item({
		"timestamp":event["timestamp"],
		"question":event["question"],
		"answer":event["answer"],
		"context":event["context"],
	})

	return True
