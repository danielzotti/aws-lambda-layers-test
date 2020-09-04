# AWS Lambda Layers Test
A simple project to test AWS Lambda functions & Layers written in TypeScript

## Requirements
- [Serverless framework](https://www.serverless.com)
 - `npm install -g serverless`

## I just want to try it!
Open a terminal and run these commands:
- `cd layers` # enter the layers folder
- `npm run build:all` # install all dependencies and transpile TypeScript code into JS
- `cd ../test-layer` # enter the lambda function folder
- `npm run first-start` # install dependencies and run the lambda function locally using serverless offline plugin
 
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
        Name: LoggingLambdaLayer-${self:provider.stage}
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

## Useful lectures:
- [Integrating Lambda Layers into your Node.js Lambdas using pre-configured templates](https://blog.theodo.com/2019/01/lambda-layer-template/)
- [NodeJS Runtime Environment with AWS Lambda Layers](https://medium.com/@anjanava.biswas/nodejs-runtime-environment-with-aws-lambda-layers-f3914613e20e)
- [Lambda Layers & Node & require the layer code & sls invoke local](https://forum.serverless.com/t/lambda-layers-node-require-the-layer-code-sls-invoke-local/6673)
- [How to deploy multiple micro-services under one API domain with Serverless](https://serverless.com/blog/api-gateway-multiple-services/)
- [How to use multiple runtimes in a single serverless microservice](https://serverless.com/blog/building-mutliple-runtimes/)
- [When to use Lambda Layers](https://lumigo.io/blog/lambda-layers-when-to-use-it/)
- [Get Started With AWS, Serverless, and TypeScript](https://dev.to/michael_timbs/get-started-with-aws-serverless-and-typescript-5hgf)
- [How I package TypeScript lambdas for AWS](https://coderbyheart.com/how-i-package-typescript-lambdas-for-aws/)
- [Part 2 — Create Lambda Layers with Serverless Framework and Offline support](https://medium.com/appgambit/part-2-create-lambda-layers-with-serverless-framework-and-offline-support-ad2a5a8dabfb)
- [StackOverflow: Can I import typescript types from a Lambda Layer?](https://stackoverflow.com/questions/57553131/can-i-import-typescript-types-from-a-lambda-layer)
- [Lambda Layers — Tips & Tricks](https://medium.com/@manojf/lambda-layers-tips-tricks-3f1a4343a434)
- [Sharing Code among Lambdas using Lambda Layers](https://thecloudtutorials.com/2020/02/08/sharing-code-among-lambdas-using-lambda-layers/)

### Videos
- [Sharing Code with Lambda Layers](https://www.youtube.com/watch?v=QDBg2vp6vKY)
- [Lambda Layers - Tips & Tricks](https://www.youtube.com/watch?v=ChBDYWg2cOo)
- [How to use Lambda Layers with TypeScript](https://www.youtube.com/watch?v=Q_UYchE-SKc)
