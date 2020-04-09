# AWS Lambda Layers Test
A simple project to test AWS Lambda functions & Layers written in TypeScript
 
## Folder structure
- `layers` the folder that contains all layers:
    - `express-pg-moment` an example layer that bundles 3rd parties modules
        - ExpressJs
            - validator
            - cors
        - MomentJs
        - PostgreSQL client (pg)
        - Serverless HTTP
    - `logging` an example of a custom layer that logs messages
- `test-layer` a simple lambda function that uses the two layers listed above

## Serverless Offline
To test the Lambda function locally just type:
- `cd test-layer`
- (`npm install` if you have just cloned the repo)
- `npm run start`
    - it simply calls `sls offline start`

## Deploy Lambda function (with Serverless) 
To deploy the lambda that uses the layers using serverless just type:
- `cd test-layer`
- `npm run deploy -- --stage dev`
    - it simply calls
        - `npm install`
        - `sls deploy`

## Deploy Lambda Layers (with Serverless) 
To deploy all layers using serverless just type:
- `cd layers`
- `npm run deploy -- --stage dev` it builds all layers, and it deploys them
    - it does the following for every layer:
        - `npm run install`
        - `npm run build`
    - it deploys all the layers
        - `sls deploy`
