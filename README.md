# Event Bridge

[![aws-cdk][badge-aws-cdk]][aws-cdk]
[![jsii][badge-jsii]][jsii]
[![npm-version][badge-npm-version]][npm-package]
[![nuget-version][badge-nuget-version]][nuget-package]
[![npm-downloads][badge-npm-downloads]][npm-package]
[![nuget-downloads][badge-nuget-downloads]][nuget-package]
[![license][badge-license]][license]

Component to create an event bridge and add rules and targets.

## How to use

Below are all languages supported by the AWS CDK.

### C#

Install the dependency:

```sh
dotnet add package StackSpot.Cdk.EventBridge
```

Import the construct into your project, for example:

```csharp
using Amazon.CDK;
using Constructs;
using StackSpot.Cdk.EventBridge;

namespace MyStack
{
    public class MyStack : Stack
    {
        internal MyStack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
        {
            new EventBridge(this, "MyEventBridge", new EventBusCreateProps{
                BusName = "my-bus"
            });
        }
    }
}
```

### F#

Not yet supported.

### Go

Not yet supported.

### Java

Not yet supported.

### JavaScript

Install the dependency:

```sh
npm install --save @stackspot/cdk-event-bridge
```

Import the construct into your project, for example:

```javascript
const { Stack } = require('aws-cdk-lib');
const { EventBridge } = require('@stackspot/cdk-event-bridge');

class MyStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    new EventBridge(this, 'MyEventBridge', { busName: 'my-bus' });
  }
}

module.exports = { MyStack };
```

### Python

Not yet supported.

### TypeScript

Install the dependency:

```sh
npm install --save @stackspot/cdk-event-bridge
```

Import the construct into your project, for example:

```typescript
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EventBridge } from '@stackspot/cdk-event-bridge';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new EventBridge(this, 'MyEventBridge', { busName: 'my-bus' });
  }
}
```

## Construct Props

| Name    | Type   | Description          |
| ------- | ------ | -------------------- |
| busName | string | The name of the bus. |

## Another Props

### RuleCreateProps

| Name         | Type                                         | Description                                                        |
| ------------ | -------------------------------------------- | ------------------------------------------------------------------ |
| description? | string                                       | A description of the rule's purpose.                               |
| enabled?     | boolean                                      | Indicates whether the rule is enabled.                             |
| eventPattern | [EventPattern][aws-cdk-events-event-pattern] | Describes which events EventBridge routes to the specified target. |
| ruleName     | string                                       | A name for the rule.                                               |

## Properties

| Name     | Type                                | Description                         |
| -------- | ----------------------------------- | ----------------------------------- |
| eventbus | [EventBus][aws-cdk-events-eventbus] | Event bus created.                  |
| rules    | [Rule\[\]][aws-cdk-events-rule]     | The rules of the event bus created. |

## Methods

| Name                                                         | Description                                       |
| ------------------------------------------------------------ | ------------------------------------------------- |
| addRule(scope, props)                                        | Add one rule to event bus created in constructor. |
| static addRuleFromStackBus(scope, stackName, busName, props) | Add one rule to one event bus.                    |
| static addLambdaTarget(rule, fn)                             | Add one AWS Lambda function to one rule.          |

### addRule(scope, props)

```typescript
public addRule(scope: Construct, props: RuleCreateProps): Rule
```

_Parameters_

- **scope** [Construct][aws-cdk-construct]
- **props** [RuleCreateProps](#rulecreateprops)

_Returns_

- [Rule][aws-cdk-events-rule]

Add one rule to event bus created in constructor.

The purpose of this method is to be used with the constructor, after creating an
instance of the class, this method will add one rule at a time to the created
event bus.

### static addRuleFromStackBus(scope, stackName, busName, props)

```typescript
public static addRuleFromStackBus(scope: Construct, stackName: string, busName: string, props: RuleCreateProps): Rule
```

_Parameters_

- **scope** [Construct][aws-cdk-construct]
- **stackName** string
- **busName** string
- **props** [RuleCreateProps](#rulecreateprops)

_Returns_

- string

Add one rule to one event bus.

The purpose of this method is to add a rule to an event bus without having to
instantiate the class.

### static addLambdaTarget(rule, fn)

```typescript
public static addLambdaTarget(rule: Rule, fn: IFunction): void
```

_Parameters_

- **rule** [Rule][aws-cdk-events-rule]
- **fn** [IFunction][aws-cdk-lambda-ifunction]

Add one AWS Lambda function to one rule.

The purpose of this method is to add an AWS Lambda function to a rule without
having to instantiate the class.

## IAM Least privilege

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "events:CreateEventBus",
        "events:DeleteEventBus",
        "events:DeleteRule",
        "events:DescribeEventBus",
        "events:DescribeRule",
        "events:PutRule",
        "events:PutTargets",
        "events:RemoveTargets",
        "lambda:AddPermission",
        "lambda:RemovePermission",
        "ssm:DeleteParameter",
        "ssm:GetParameters",
        "ssm:PutParameter"
      ],
      "Resource": "*"
    }
  ]
}
```

## Development

### Prerequisites

- [EditorConfig][editorconfig] (Optional)
- [Git][git]
- [Node.js][nodejs] 17

### Setup

```sh
cd event-bridge-jsii-component
npm install
```

[aws-cdk]: https://aws.amazon.com/cdk
[aws-cdk-construct]: https://docs.aws.amazon.com/cdk/api/v2/docs/constructs.Construct.html
[aws-cdk-events-eventbus]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_events.EventBus.html
[aws-cdk-events-event-pattern]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_events.EventPattern.html
[aws-cdk-events-rule]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_events.Rule.html
[aws-cdk-lambda-ifunction]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.IFunction.html
[badge-aws-cdk]: https://img.shields.io/github/package-json/dependency-version/stack-spot/event-bridge-jsii-component/dev/aws-cdk-lib
[badge-jsii]: https://img.shields.io/github/package-json/dependency-version/stack-spot/event-bridge-jsii-component/dev/jsii
[badge-license]: https://img.shields.io/github/license/stack-spot/event-bridge-jsii-component
[badge-npm-downloads]: https://img.shields.io/npm/dt/@stackspot/cdk-event-bridge?label=downloads%20%28npm%29
[badge-npm-version]: https://img.shields.io/npm/v/@stackspot/cdk-event-bridge
[badge-nuget-downloads]: https://img.shields.io/nuget/dt/StackSpot.Cdk.EventBridge?label=downloads%20%28NuGet%29
[badge-nuget-version]: https://img.shields.io/nuget/vpre/StackSpot.Cdk.EventBridge
[editorconfig]: https://editorconfig.org/
[git]: https://git-scm.com/downloads
[jsii]: https://aws.github.io/jsii
[license]: https://github.com/stack-spot/event-bridge-jsii-component/blob/main/LICENSE
[nodejs]: https://nodejs.org/download
[npm-package]: https://www.npmjs.com/package/@stackspot/cdk-event-bridge
[nuget-package]: https://www.nuget.org/packages/StackSpot.Cdk.EventBridge
