/**
 * Type definitions for the diagnostics package.
 *
 * Provides a minimal yet useful API surface for TypeScript consumers.
 */

declare function diagnostics(namespace: string, options?: diagnostics.DiagnosticsOptions): diagnostics.DiagnosticsLogger;

declare namespace diagnostics {
  interface DiagnosticsOptions {
    force?: boolean;
    colors?: boolean;
    [key: string]: unknown;
  }

  /**
   * Logger function created by diagnostics. Accepts printf-style formatting.
   */
  interface DiagnosticsLogger {
    (message?: unknown, ...args: unknown[]): boolean;
    /** Whether logging is enabled for this namespace. */
    enabled?: boolean;
    /** The assigned namespace for this logger. */
    namespace?: string;
    /** True if this is a production build logger. */
    prod?: boolean;
    /** True if this is a development build logger. */
    dev?: boolean;
    /** Register a message modifier. */
    modify(fn: (message: unknown[], options: Record<string, unknown>) => unknown[]): boolean;
    /** Assign a custom logger implementation. */
    set(logger: (meta: Record<string, unknown>, args: unknown[]) => void): void;
    /** Register a new adapter used to determine enabled namespaces. */
    use(adapter: (namespace: string) => boolean | Promise<boolean>): boolean;
  }

  /** Check if a namespace is enabled by the configured adapters. */
  function enabled(namespace: string): boolean | Promise<boolean>;

  /** Register a message modifier. */
  function modify(fn: (message: unknown[], options: Record<string, unknown>) => unknown[]): boolean;

  /** Assign a custom logger implementation. */
  function set(logger: (meta: Record<string, unknown>, args: unknown[]) => void): void;

  /** Register a new adapter used to determine enabled namespaces. */
  function use(adapter: (namespace: string) => boolean | Promise<boolean>): boolean;

  /** Force-enable all diagnostics instances. */
  let force: boolean | undefined;
}

export = diagnostics;



