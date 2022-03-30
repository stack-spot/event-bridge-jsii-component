import { Construct } from 'constructs';
import { Stack } from 'aws-cdk-lib';
import { EventBus, EventPattern, Rule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { StackManager } from '@stackspot/cdk-core';

/**
 * EventBridge construct props.
 */
export interface EventBusCreateProps {
  /**
   * The name of the bus.
   */
  readonly busName: string;
}

/**
 * Rule props.
 */
export interface RuleCreateProps {
  /**
   * A description of the rule's purpose.
   */
  readonly description?: string;

  /**
   * Indicates whether the rule is enabled.
   */
  readonly enabled?: boolean;

  /**
   * Describes which events EventBridge routes to the specified target.
   */
  readonly ruleName: string;

  /**
   * A name for the rule.
   */
  readonly eventPattern: EventPattern;
}

/**
 * Component to create a event bridge and add rules and targets.
 */
export class EventBridge extends Construct {
  /**
   * Event bus created.
   */
  public readonly eventbus: EventBus;

  /**
   * The rules of the event bus created.
   */
  public readonly rules: Rule[];

  /**
   * Creates a new instance of class EventBridge.
   *
   * @param {Construct} scope The construct within which this construct is defined.
   * @param {string} id Identifier to be used in AWS CloudFormation.
   * @param {EventBusCreateProps} [props={}] Parameters of the class EventBridge.
   * @see {@link https://docs.aws.amazon.com/cdk/v2/guide/constructs.html#constructs_init|AWS CDK Constructs}
   */
  constructor(scope: Construct, id: string, props: EventBusCreateProps) {
    super(scope, id);

    this.rules = [];

    this.eventbus = new EventBus(this, 'eventbus-'.concat(props.busName), {
      eventBusName: props.busName,
    });

    StackManager.saveResource(scope, {
      arn: this.eventbus.eventBusArn,
      name: props.busName,
      stackName: Stack.of(scope).stackName,
    });
  }

  /**
   * Add one rule to event bus created in constructor.
   *
   * @param {Construct} scope The construct within which this construct is defined.
   * @param {RuleCreateProps} props Rule props.
   * @returns {Rule} Rule created.
   */
  public addRule(scope: Construct, props: RuleCreateProps): Rule {
    const rule = new Rule(scope, `rule-${props.ruleName}`, {
      eventBus: this.eventbus,
      description: props.description,
      eventPattern: props.eventPattern,
      ruleName: props.ruleName,
      enabled: props.enabled === undefined ? true : props.enabled,
    });

    StackManager.saveResource(scope, {
      arn: rule.ruleArn,
      name: props.ruleName,
      stackName: Stack.of(scope).stackName,
    });

    this.rules.push(rule);

    return rule;
  }

  /**
   * Add one rule to one event bus.
   *
   * @param {Construct} scope The construct within which this construct is defined.
   * @param {string} stackName The name of the stack.
   * @param {string} busName The name of the bus.
   * @param {RuleCreateProps} props Rule props.
   * @returns {Rule} Rule created.
   */
  public static addRuleFromStackBus(
    scope: Construct,
    stackName: string,
    busName: string,
    props: RuleCreateProps
  ): Rule {
    const busArn = StackManager.getResourceArn(scope, stackName, busName);

    const bus = EventBus.fromEventBusArn(
      scope,
      `getStackBusArn-${busName}`,
      busArn
    );

    const rule = new Rule(scope, `rule-${props.ruleName}`, {
      eventBus: bus,
      description: props.description,
      eventPattern: props.eventPattern,
      ruleName: props.ruleName,
      enabled: props.enabled === undefined ? true : props.enabled,
    });

    StackManager.saveResource(scope, {
      arn: rule.ruleArn,
      name: props.ruleName,
      stackName: Stack.of(scope).stackName,
    });

    return rule;
  }

  /**
   * Add one AWS Lambda function to one rule.
   *
   * @param {Rule} rule The rule to add to an AWS Lambda function.
   * @param {IFunction} fn The AWS Lambda function to add to the rule.
   */
  public static addLambdaTarget(rule: Rule, fn: IFunction): void {
    rule.addTarget(new LambdaFunction(fn));
  }
}
