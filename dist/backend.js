// Lumiverse Structured Prefill
// v0.1.0
//
// Uses Lumiverse's documented interceptor + generation_parameters APIs.
// The final assistant message is treated as the prefill and is replaced
// with an OpenAI-compatible JSON Schema constraint.

const CONFIG = {
  enabled: true,
  minContinuationChars: 0,
};

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getText(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .filter(part => part && part.type === "text" && typeof part.text === "string")
      .map(part => part.text)
      .join("");
  }
  return "";
}

function makeSchema(prefill) {
  const pattern = "^" + escapeRegex(prefill);
  const textSchema = {
    type: "string",
    pattern,
  };

  if (CONFIG.minContinuationChars > 0) {
    textSchema.minLength = prefill.length + CONFIG.minContinuationChars;
  }

  return {
    type: "json_schema",
    json_schema: {
      name: "prefilled_response",
      strict: true,
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          text: textSchema,
        },
        required: ["text"],
      },
    },
  };
}

if (CONFIG.enabled) {
  spindle.registerInterceptor(async (messages, context) => {
    if (!Array.isArray(messages) || messages.length === 0) {
      return messages;
    }

    const last = messages[messages.length - 1];

    // Only the final assistant message is treated as a prefill.
    if (!last || last.role !== "assistant") {
      return messages;
    }

    const prefill = getText(last.content);
    if (!prefill) {
      return messages;
    }

    const filtered = messages.slice(0, -1);

    spindle.log.info(
      `[Structured Prefill] enforcing ${prefill.length}-character prefix`
    );

    return {
      messages: filtered,
      parameters: {
        response_format: makeSchema(prefill),
      },
    };
  }, 200);
}

spindle.log.info("Structured Prefill loaded.");
