export type ParsedOptions = {
  positional: string[];
  values: Record<string, string[]>;
};

export function parseOptions(args: string[]): ParsedOptions {
  const positional: string[] = [];
  const values: Record<string, string[]> = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = args[index + 1];
      if (!next || next.startsWith("--")) {
        values[key] = [...(values[key] ?? []), "true"];
        continue;
      }
      values[key] = [...(values[key] ?? []), next];
      index += 1;
      continue;
    }

    positional.push(arg);
  }

  return { positional, values };
}

export function firstValue(options: ParsedOptions, key: string): string | undefined {
  return options.values[key]?.[0];
}

export function allValues(options: ParsedOptions, key: string): string[] {
  return options.values[key] ?? [];
}
