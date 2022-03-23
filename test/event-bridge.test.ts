import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Template } from 'aws-cdk-lib/assertions';
import * as path from 'path';
import * as events from '../lib/index';

test('Event bus Created', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');
  // WHEN
  new events.EventBridge(stack, 'testStack', { busName: 'testBus' });
  // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::Events::EventBus', {});
});

test('event rule added to event bus', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');
  // WHEN
  const bus = new events.EventBridge(stack, 'testStack', { busName: 'testBus' });
  bus.addRule(stack, {
    ruleName: 'succes-rule',
    eventPattern: {
      detail: {
        requestContext: {
          condition: ['Success'],
        },
        responsePayload: {
          source: ['cdkpatterns.the-destined-lambda'],
          action: ['message'],
        },
      },
    },
  });
  // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::Events::EventBus', {});
  template.hasResourceProperties('AWS::Events::Rule', {});
});

test('event rule with lambda target added to event bus', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');
  // WHEN
  const bus = new events.EventBridge(stack, 'testStack', { busName: 'testBus' });
  const rule = bus.addRule(stack, {
    ruleName: 'succes-rule',
    eventPattern: {
      detail: {
        requestContext: {
          condition: ['Success'],
        },
        responsePayload: {
          source: ['cdkpatterns.the-destined-lambda'],
          action: ['message'],
        },
      },
    },
  });

  const fn = new lambda.Function(stack, 'success', {
    runtime: lambda.Runtime.NODEJS_12_X,
    handler: 'index.handler',
    code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-code')),
  });

  events.EventBridge.addLambdaTarget(rule, fn);

  // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::Events::EventBus', {});
  template.hasResourceProperties('AWS::Events::Rule', {});
  template.hasResourceProperties('AWS::Lambda::Function', {});
});

test('disabled event rule with lambda target added to event bus', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');
  // WHEN
  const bus = new events.EventBridge(stack, 'testStack', { busName: 'testBus' });
  const rule = bus.addRule(stack, {
    ruleName: 'succes-rule',
    enabled: false,
    eventPattern: {
      detail: {
        requestContext: {
          condition: ['Success'],
        },
        responsePayload: {
          source: ['cdkpatterns.the-destined-lambda'],
          action: ['message'],
        },
      },
    },
  });

  const fn = new lambda.Function(stack, 'success', {
    runtime: lambda.Runtime.NODEJS_12_X,
    handler: 'index.handler',
    code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-code')),
  });

  events.EventBridge.addLambdaTarget(rule, fn);

  // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::Events::EventBus', {});
  template.hasResourceProperties('AWS::Events::Rule', {});
  template.hasResourceProperties('AWS::Lambda::Function', {});
});

test('event rule added to event bus from another stack', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');
  // WHEN

  events.EventBridge.addRuleFromStackBus(stack, 'anotherStack', 'anotherBus', {
    ruleName: 'succes-rule',
    eventPattern: {
      detail: {
        requestContext: {
          condition: ['Success'],
        },
        responsePayload: {
          source: ['cdkpatterns.the-destined-lambda'],
          action: ['message'],
        },
      },
    },
  });
  // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::Events::Rule', {});
  template.hasResourceProperties('AWS::SSM::Parameter', {});
});

test('disabled event rule added to event bus from another stack', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');
  // WHEN

  events.EventBridge.addRuleFromStackBus(stack, 'anotherStack', 'anotherBus', {
    ruleName: 'succes-rule',
    enabled: false,
    eventPattern: {
      detail: {
        requestContext: {
          condition: ['Success'],
        },
        responsePayload: {
          source: ['cdkpatterns.the-destined-lambda'],
          action: ['message'],
        },
      },
    },
  });
  // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::Events::Rule', {});
  template.hasResourceProperties('AWS::SSM::Parameter', {});
});
