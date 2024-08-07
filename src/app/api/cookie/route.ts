"use server"
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { JsonResponse } from "@/app/api/defaults";

export async function POST(req: NextRequest) {
  /*
    Must Provide JSON data in the following format:
    {
      "key": "cookie_key",
      "value": "cookie_value", // Only required when mode is "set"
      "mode": "set" | "get"
    }
  */
  try {
    const jsonData = await req.json();
    if (!jsonData) {
      return JsonResponse({ ok: false, error: "No JSON data" }, 400);
    }

    var key = jsonData.key;
    var value = jsonData.value;
    var mode = jsonData.mode;

    if (!key) {
      return JsonResponse({ ok: false, error: "No key provided" }, 400);
    }
    if (!mode) {
      return JsonResponse({ ok: false, error: "No mode provided" }, 400);
    }
    if (mode !== "set" && mode !== "get") {
      return JsonResponse(
        {
          ok: false,
          error: "Invalid mode provided. `mode` = 'set' | 'get'",
        },
        400
      );
    }
    if (mode === "set" && !value) {
      return JsonResponse(
        {
          ok: false,
          error: `Value not provided. Cannot set "${key}" to an empty value`,
        },
        400
      );
    }
  } catch (e) {
    return JsonResponse({ ok: false, error: "Invalid JSON data" }, 400);
  }
  const data = await DoWork(mode, key, value);
  return JsonResponse(data);
}

export async function DoWork(
  mode: "set" | "get",
  key: string,
  value: string = ""
) {
  const cookieStore = cookies();
  const cookieValue = cookieStore.get(key);
  if (mode === "get") {
    return JsonResponse({ ok: true, value: cookieValue });
  }

  cookieStore.set(key, value);

  const data = {
    ok: true,
    key: key,
    value: value,
    message: `Cookie "${key}" set to "${value}"`,
  };

  return data;
}
