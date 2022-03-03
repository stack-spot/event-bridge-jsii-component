import { Construct } from 'constructs';
import { EventBus, EventPattern, Rule } from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export interface EventbridgeEnvJsiiComponentProps {
  readonly busName: string,
}

export interface RuleProps {
  readonly description?: string,
  readonly enabled?: boolean,
  readonly ruleName: string,
  readonly eventPattern: EventPattern
}

export class EventbridgeEnvJsiiComponent extends Construct {
  public readonly bus: EventBus;

  constructor(scope: Construct, id: string, props:EventbridgeEnvJsiiComponentProps) {
    super(scope, id);
    this.bus = new EventBus(this, 'eventbus-'.concat(props.busName), {
      eventBusName: props.busName,
    });
  }

  public static addRule(scope: Construct, busArn:string, props: RuleProps): Rule {
    const bus = EventBus.fromEventBusArn(scope, 'busRule-'.concat(props.ruleName), busArn);
    return new Rule(scope, 'rule-'.concat(props.ruleName), {
      eventBus: bus,
      description: props.description,
      eventPattern: props.eventPattern,
      ruleName: props.ruleName,
      enabled: props.enabled === undefined ? true : props.enabled,
    });
  }

  public static addLambdaTarget(rule:Rule, fn:lambda.IFunction) : void {
    rule.addTarget(new targets.LambdaFunction(fn));
  }
}
