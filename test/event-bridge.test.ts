import { App, Stack } from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Template } from 'aws-cdk-lib/assertions';
import { EventBridge } from '../lib/index';

const lambdaFunction = `exports.handler = async (event: any) => {
  JSON.stringify(event, null, 2);
};`;

describe('EventBridge', () => {
  test('Event bus Created', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    new EventBridge(stack, 'testStack', { busName: 'testBus' });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Events::EventBus', {});
  });

  test('event rule added to event bus', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bus = new EventBridge(stack, 'testStack', {
      busName: 'testBus',
    });
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
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Events::EventBus', {});
    template.hasResourceProperties('AWS::Events::Rule', {});
  });

  test('event rule with lambda target added to event bus', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bus = new EventBridge(stack, 'testStack', {
      busName: 'testBus',
    });
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

    const fn = new Function(stack, 'success', {
      runtime: Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: Code.fromInline(lambdaFunction),
    });

    EventBridge.addLambdaTarget(rule, fn);

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Events::EventBus', {});
    template.hasResourceProperties('AWS::Events::Rule', {});
    template.hasResourceProperties('AWS::Lambda::Function', {});
  });

  test('disabled event rule with lambda target added to event bus', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bus = new EventBridge(stack, 'testStack', {
      busName: 'testBus',
    });
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

    const fn = new Function(stack, 'success', {
      runtime: Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: Code.fromInline(lambdaFunction),
    });

    EventBridge.addLambdaTarget(rule, fn);

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Events::EventBus', {});
    template.hasResourceProperties('AWS::Events::Rule', {});
    template.hasResourceProperties('AWS::Lambda::Function', {});
  });

  test('event rule added to event bus from another stack', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    EventBridge.addRuleFromStackBus(stack, 'anotherStack', 'anotherBus', {
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
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Events::Rule', {});
    template.hasResourceProperties('AWS::SSM::Parameter', {});
  });

  test('disabled event rule added to event bus from another stack', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    EventBridge.addRuleFromStackBus(stack, 'anotherStack', 'anotherBus', {
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
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Events::Rule', {});
    template.hasResourceProperties('AWS::SSM::Parameter', {});
  });
});
