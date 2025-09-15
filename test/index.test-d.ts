import diagnostics = require('../');
import { expectType, expectAssignable, expectError } from 'tsd';

// minimal usage
const dbg = diagnostics('foo:bar');

// function invocation returns boolean
expectType<boolean>(dbg('message', 1, true));

// instance props
expectType<boolean | undefined>(dbg.enabled);
expectType<string | undefined>(dbg.namespace);
expectType<boolean | undefined>(dbg.dev);
expectType<boolean | undefined>(dbg.prod);

// instance methods
expectType<boolean>(
  dbg.modify((message, options) => {
    expectType<unknown[]>(message);
    expectType<Record<string, unknown>>(options);
    return message;
  })
);

dbg.set((meta, args) => {
  expectType<Record<string, unknown>>(meta);
  expectType<unknown[]>(args);
});

expectType<boolean>(dbg.use(ns => ns === 'foo:bar'));
expectType<boolean>(dbg.use(async ns => ns === 'foo:bar'));

// top-level API
expectAssignable<boolean | Promise<boolean>>(diagnostics.enabled('foo:bar'));
expectType<boolean>(await diagnostics.enabled('foo:bar'));
expectType<boolean>(diagnostics.modify((message, options) => message));
diagnostics.set((meta, args) => {
  expectType<Record<string, unknown>>(meta);
  expectType<unknown[]>(args);
});
expectType<boolean>(diagnostics.use(ns => false));

// force flag
diagnostics.force = true;
expectAssignable<boolean | undefined>(diagnostics.force);

// negative cases
expectError(diagnostics()); // namespace is required
expectError(
  dbg.modify((message: number[]) => message) // wrong message type
);

