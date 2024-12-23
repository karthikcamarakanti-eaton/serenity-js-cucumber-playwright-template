/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/quotes */
import { Given, Then, When } from "@cucumber/cucumber";
import { equals } from "@serenity-js/assertions";
import { Actor, actorInTheSpotlight, Check } from "@serenity-js/core";
import { Navigate } from "@serenity-js/web";

import {
  Authenticate,
  VerifyAuthentication,
  VerifyFalseAuthentication,
} from "../../test/authentication";
import { PickExample } from "../../test/examples";

export namespace failedAttempt {
  // eslint-disable-next-line prefer-const
  export let failedAttempyCount: number = 0;
}
/**
 * Below step definitions use Cucumber Expressions
 * see: https://cucumber.io/docs/cucumber/cucumber-expressions/
 *
 * {actor} and {pronoun} are custom expressions defined under support/parameters.ts
 */
Given(
  "{actor} starts with the {string} example",
  async (actor: Actor, exampleName: string) =>
    actor.attemptsTo(Navigate.to("/"), PickExample.called(exampleName))
);

When(
  "{pronoun} log(s) in using {string} and {string}",
  async (actor: Actor, username: string, password: string) =>
    actor.attemptsTo(Authenticate.using(username, password))
);

/**
 * If you need to use a RegExp instead of Cucumber Expressions like {actor} and {pronoun}
 * you can use actorCalled(name) and actorInTheSpotlight() instead
 *
 *  see: https://serenity-js.org/modules/core/function/index.html#static-function-actorCalled
 *  see: https://serenity-js.org/modules/core/function/index.html#static-function-actorInTheSpotlight
 */
Then(
  /.* should see that authentication has (succeeded|failed)/,
  async (expectedOutcome: string) => {
    failedAttempt.failedAttempyCount += 1;
    await actorInTheSpotlight().attemptsTo(
      Check.whether(failedAttempt.failedAttempyCount, equals(1))
        .andIfSo(VerifyFalseAuthentication[expectedOutcome]())
        .otherwise(VerifyAuthentication[expectedOutcome]())
    );
  }
);
