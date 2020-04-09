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


## IMPORTANT NOTES

### Layer export using CloudFormation notation
Layer must be exported wit **TitleCase** and **LayerExport** suffix: `LoggingLayerExport`

Layer name must be written with **TitleCase** and **LambdaLayer** suffix: `LoggingLambdaLayer`

in lambda layers `serverless.yml`:
```yaml
sercice: layers
...
resources:
  Outputs:
    LoggingLayerExport:
      Value:
        Ref: LoggingLambdaLayer
      Export:
        Name: LoggingLambdaLayer
```

in lambda function `serverless.yml`:
```yaml
functions:
  functionName:
    layers:
          - ${cf:layers-${self:provider.stage}.LoggingLayerExport}
```
where `layers` is the service name and `LoggingLayerExport` is the resource name

### How to use layers locally
Function layers must be added in `package.json` as `devDependencies`, in this way won't be deployed.
To prevent errors, custom dependencies must be excluded in the `serverless.yml` file

in `package.json`:
```json
{
  "devDependencies": {
    "express": "^4.17.1",
    "logging": "file:../layers/logging/dist/nodejs/node_modules/logging"
  }
}
```
in `serverless.yml`:
```yaml
package:
  exclude:
    - node_modules/logging
```
please note the difference from 3rd parties dependency (express) and custom dependency (logging)

- ExpressJS is just added to devDependencies
- Loggin is added to devDependencies and excluded in the package section

### How to use typescript with layers (and how to decrease bundle size)
As the [AWS Layers doc](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html#configuration-layers-path), a NodeJs layer is deployed on `nodejs/node_modules` folder.
It's better to compile the TypeScript layer in Javascript and deploy only the compiled version.

This is why I've chosen the following folder structure for a layer written in TypeScript:

- `logging` the root folder
    - **`dist` contains the compiled code (JavaScript) and follows the folder structure specified in the AWS documentation**
        - `nodejs`
            - `node_modules`
                - `logging`
                    - LAYER COMPILED CODE 
    - `src` contains the source folder (TypeScript)
    - `node_modules` contains dependencies to compile and manage the deployment
    - `package.jon` contains scripts to compile and deploy the layer 
    - `tsconfig.json` manage the compilation process
    
Only the content of the `dist` folder will be deployed, as configured in the `path` field in `serverless.yml`:
```yaml
layers:
  logging:
    path: logging/dist
    description: Layer with a simple Logger
    compatibleRuntimes:
      - nodejs12.x
```
