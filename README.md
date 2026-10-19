# Lumiverse Structured Prefill

A small native Lumiverse Spindle extension that turns the final assistant-role
prefill into an OpenAI-compatible JSON Schema constraint.

## What it does

If the assembled prompt ends with:

```text
assistant:
Kael looked toward the window and
```

the extension removes that assistant message and adds a structured-output
schema requiring the generated `text` value to begin with:

```text
Kael looked toward the window and
```

This follows Lumiverse's documented Structured Prefill Interceptor example.

## Requirements

- Lumiverse 0.1.0+
- A provider/model that supports
  `response_format: { type: "json_schema" }`

## Installation

This ZIP is a repository package. Lumiverse's normal extension installer
expects a GitHub repository URL, not a ZIP file.

1. Create a GitHub repository, for example:
   `lumiverse-structured-prefill`
2. Upload the contents of this ZIP to the repository root.
3. In Lumiverse, open Extensions and install the repository URL.
4. Grant `interceptor` and `generation_parameters`.

Before publishing, replace the placeholder `github` and `homepage` URLs in
`spindle.json` with your actual repository URL.

## Build

The package already contains `dist/backend.js`, so a build is not required
for installation.

The source is also included in `src/backend.js` for easy editing. If you
convert it to TypeScript, keep the compiled output at `dist/backend.js`.

## Configuration

Edit `dist/backend.js`:

```js
const CONFIG = {
  enabled: true,
  minContinuationChars: 0,
};
```

`minContinuationChars` can be increased if you want the model to generate
additional text beyond the forced prefix.

## Limitations

This first build intentionally targets the documented OpenAI-compatible
structured-output path. It does not pretend to support provider-specific
Gemini/Anthropic schemas until those paths are tested against the exact
Lumiverse/provider combination.

It also does not implement JSON unwrapping or Continue overlap yet. The
documented Lumiverse example establishes the interceptor side of the feature;
post-generation rewriting requires additional host APIs and should be added
only after testing the installed Lumiverse version.

## License

MIT
"# lumiverse-structured-prefill" 
