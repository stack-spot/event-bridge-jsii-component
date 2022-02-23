import { Construct } from 'constructs';
import { EventBus, EventPattern, Rule } from 'aws-cdk-lib/aws-events';
import * as target from 'aws-cdk-lib/aws-events-targets';
import { Function } from 'aws-cdk-lib/aws-lambda';

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
  public readonly bus:EventBus;

  constructor(scope: Construct, id: string, props:EventbridgeEnvJsiiComponentProps) {
    super(scope, id);
    this.bus = new EventBus(this, 'DestinedEventBus', {
      eventBusName: props.busName,
    });
  }

  public addRule(props: RuleProps): Rule {
    return new Rule(this, 'Rule', {
      eventBus: this.bus,
      description: props.description,
      eventPattern: props.eventPattern,
      ruleName: props.ruleName,
      enabled: props.enabled === undefined ? true : props.enabled,
    });
  }

  public addLambdaTarget(arn:string, rule:Rule) : void {
    rule.addTarget(new target.LambdaFunction(Function.fromFunctionArn(
      this,
      'lambda-target',
      arn,
    )));
  }
}
