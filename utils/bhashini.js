// utils/bhashini.js
//
// Fill in your real credentials from bhashini.gov.in after registration.
// These are placeholders - the module won't work until replaced.

const USER_ID = "YOUR_BHASHINI_USER_ID";
const ULCA_API_KEY = "YOUR_BHASHINI_ULCA_API_KEY";

const PIPELINE_CONFIG_ENDPOINT = "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline";
const DEFAULT_PIPELINE_ID = "64392f96daac500b55c543cd";

// Bhashini language codes for the NE languages we're targeting.
// Confirmed present in Bhashini's pipeline as of this build - re-verify
// if adding others, since coverage varies by language.
export const BHASHINI_LANGUAGES = {
  hindi: "hi",
  assamese: "as",
  bodo: "brx",
  manipuri: "mni",
  nepali: "ne",
};

// Pipeline configs are per language-pair and don't change often - cache
// them in memory for the app session instead of calling on every request.
const configCache = {};

async function getPipelineConfig(sourceLang, targetLang, task) {
  const cacheKey = `${task}-${sourceLang}-${targetLang}`;
  if (configCache[cacheKey]) return configCache[cacheKey];

  const taskType = task === "translation" ? "translation" : "tts";
  const body = {
    pipelineTasks: [
      {
        taskType,
        config: {
          language:
            taskType === "translation"
              ? { sourceLanguage: sourceLang, targetLanguage: targetLang }
              : { sourceLanguage: targetLang },
        },
      },
    ],
    pipelineRequestConfig: { pipelineId: DEFAULT_PIPELINE_ID },
  };

  const res = await fetch(PIPELINE_CONFIG_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      userID: USER_ID,
      ulcaApiKey: ULCA_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Bhashini config fetch failed: ${res.status}`);
  const data = await res.json();

  const config = {
    callbackUrl: data.pipelineInferenceAPIEndPoint.callbackUrl,
    inferenceApiKey: data.pipelineInferenceAPIEndPoint.inferenceApiKey,
    serviceId: data.pipelineResponseConfig[0].config[0].serviceId,
  };
  configCache[cacheKey] = config;
  return config;
}

// Translates text from English into a target NE language.
export async function translateText(text, targetLangCode) {
  const { callbackUrl, inferenceApiKey, serviceId } = await getPipelineConfig("en", targetLangCode, "translation");

  const res = await fetch(callbackUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: inferenceApiKey.value ? `${inferenceApiKey.name} ${inferenceApiKey.value}` : inferenceApiKey,
    },
    body: JSON.stringify({
      pipelineTasks: [
        {
          taskType: "translation",
          config: {
            language: { sourceLanguage: "en", targetLanguage: targetLangCode },
            serviceId,
          },
        },
      ],
      inputData: { input: [{ source: text }] },
    }),
  });

  if (!res.ok) throw new Error(`Bhashini translate failed: ${res.status}`);
  const data = await res.json();
  return data.pipelineResponse[0].output[0].target;
}

// Returns base64 WAV audio for the given text in the given NE language.
export async function textToSpeech(text, langCode) {
  const { callbackUrl, inferenceApiKey, serviceId } = await getPipelineConfig(langCode, langCode, "tts");

  const res = await fetch(callbackUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: inferenceApiKey.value ? `${inferenceApiKey.name} ${inferenceApiKey.value}` : inferenceApiKey,
    },
    body: JSON.stringify({
      pipelineTasks: [
        {
          taskType: "tts",
          config: {
            language: { sourceLanguage: langCode },
            serviceId,
            gender: "female",
          },
        },
      ],
      inputData: { input: [{ source: text }] },
    }),
  });

  if (!res.ok) throw new Error(`Bhashini TTS failed: ${res.status}`);
  const data = await res.json();
  return data.pipelineResponse[0].audio[0].audioContent; // base64 WAV
}