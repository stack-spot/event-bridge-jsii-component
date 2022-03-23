import { Construct } from 'constructs';
import { EventBus, EventPattern, Rule } from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as core from '@stackspot/cdk-core';
import { Stack } from 'aws-cdk-lib';

export interface EventBusCreateProps {
  readonly busName: string,
}

export interface RuleCreateProps {
  readonly description?: string,
  readonly enabled?: boolean,
  readonly ruleName: string,
  readonly eventPattern: EventPattern
}

export class EventBridge extends Construct {
  public readonly eventbus: EventBus;

  public readonly rules: Rule[];

  constructor(scope: Construct, id: string, props:EventBusCreateProps) {
    super(scope, id);

    this.rules = [];
    this.eventbus = new EventBus(this, 'eventbus-'.concat(props.busName), {
      eventBusName: props.busName,
    });

    core.StackManager.saveResource(
      scope,
      {
        arn: this.eventbus.eventBusArn,
        name: props.busName,
        stackName: Stack.of(scope).stackName,
      },
    );
  }

  public addRule(scope: Construct, props: RuleCreateProps) : Rule {
    const rule = new Rule(scope, 'rule-'.concat(props.ruleName), {
      eventBus: this.eventbus,
      description: props.description,
      eventPattern: props.eventPattern,
      ruleName: props.ruleName,
      enabled: props.enabled === undefined ? true : props.enabled,
    });

    core.StackManager.saveResource(
      scope,
      {
        arn: rule.ruleArn,
        name: props.ruleName,
        stackName: Stack.of(scope).stackName,
      },
    );

    this.rules.push(rule);
    return rule;
  }

  public static addRuleFromStackBus(
    scope: Construct,
    stackName: string,
    busName: string,
    props: RuleCreateProps,
  ) : Rule {
    const busArn = core.StackManager.getResourceArn(scope, stackName, busName);
    const bus = EventBus.fromEventBusArn(scope, 'getStackBusArn-'.concat(busName), busArn);

    const rule = new Rule(scope, 'rule-'.concat(props.ruleName), {
      eventBus: bus,
      description: props.description,
      eventPattern: props.eventPattern,
      ruleName: props.ruleName,
      enabled: props.enabled === undefined ? true : props.enabled,
    });

    core.StackManager.saveResource(
      scope,
      {
        arn: rule.ruleArn,
        name: props.ruleName,
        stackName: Stack.of(scope).stackName,
      },
    );

    return rule;
  }

  public static addLambdaTarget(rule:Rule, fn:lambda.IFunction) : void {
    rule.addTarget(new targets.LambdaFunction(fn));
  }
}
