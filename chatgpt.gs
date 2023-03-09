// Attach your api-key from https://platform.openai.com/account/api-keys
var OPENAI_API_KEY = '<OPENAI_API_KEY>';

const MAX_TOKENS = 256;

// function which we can call ChatGPT api
function callOpenAIAPI(prompt, systemContent) {
  var messages = [];
  if (systemContent != '')
    messages.push({role: 'system', content: systemContent});
  messages.push({role: 'user', content: prompt});

  var data = {
    messages: messages,
    model: 'gpt-3.5-turbo',
    temperature: 0.5,
    max_tokens: MAX_TOKENS,
  };

  var payload = {
    method : 'POST',
    contentType: 'application/json',
    payload : JSON.stringify(data),
    headers: {Authorization: 'Bearer ' + OPENAI_API_KEY},
  };

  var response = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', payload);
  return JSON.parse(response.getContentText()).choices[0].message.content.trim();
}

// function GPT(arg1, arg2, ...)
// The function concatenates the inputs to create a prompt which is sent to ChatGPT.
// and instructs ChatGPT to give a short answer without punctuation at the end.
function GPT() {
  var prompt = Array.prototype.slice.call(arguments, 0).join(' ').trim()
  if (prompt == '')
    return 'Error: Provide an input.'

  // call open-ai with prompt; try to remove bloat from the answer
  systemContent = 'You are a helpful assistant. Don not apologize for being a language model. Provide the best possible and accurate answer.';
  var response = callOpenAIAPI("Provide a short answer, an incomplete sentence, with as few words as possible. Knowledge cutoff: 2023/1/1. \n" + prompt, systemContent);
  return response.replace(/[.!?]$/, '');;  // remove punctuation from the end if present
}


// function rawGPT(arg1, arg2, ...)
// The function sends a unmodified user content prompt and system content prompt which is sent to ChatGPT and returns unmodified answer.
// To leave out system content, pass ''.
// TIP: use CONCATENATE to combine multiple fragments of the prompt.
function rawGPT(prompt, systemContent) {
  if (prompt == '')
    return 'Error: Provide an input.'
  return callOpenAIAPI(prompt, systemContent);
}


// tests
function test_GPT() {
  function assertEqual(a, b, message='') {
    if (a != b)
      console.error('Assert equal failed. ', a, '!= ', b);
  }

  // GPT
  assertEqual(GPT('Who is the current CEO of Amazon?'), 'Andy Jassy'); 
  assertEqual(GPT('Make a comma separated list of FAANG companies.'), 'Apple, Amazon, Facebook, Netflix, Google');  
  assertEqual(GPT("What was the revenue of Facebook in 2020? Round to the nearest billion."), "$86 billion");  

  // rawGPT
  assertEqual(rawGPT('Just output the number 123', ''), '123'); 

  console.log("Test complete.")
}
