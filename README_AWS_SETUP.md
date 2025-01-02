# AWS EventBridge Setup Instructions

## Prerequisites
1. AWS Account
2. IAM User with appropriate permissions for EventBridge

## Environment Setup
1. Create a `.env` file in your project root
2. Add the following variables with your AWS credentials:
```
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=your-access-key
VITE_AWS_SECRET_ACCESS_KEY=your-secret-key
```

## AWS EventBridge Configuration
1. Go to AWS EventBridge console
2. Create a new event bus or use the default one
3. Create rules to process the following events:
   - game_started
   - game_over
   - game_won
   - card_flipped
   - cards_matched
   - incorrect_match
   - sound_played
   - new_game_clicked

## IAM Policy
Ensure your IAM user has the following permissions:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "events:PutEvents"
            ],
            "Resource": "arn:aws:events:*:*:event-bus/default"
        }
    ]
}
```