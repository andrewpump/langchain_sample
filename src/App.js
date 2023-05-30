import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

import { Calculator } from "langchain/tools/calculator";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { DynamicTool } from "langchain/tools";
import { PlanAndExecuteAgentExecutor } from "langchain/experimental/plan_and_execute";

function App() {

  // State variables
  const [text, setText] = useState("")
  const [query, setQuery] = useState("")

  // Custom tool to say hello
  function sayHello(name) {
    console.log("invoked!")
    setText("hello " + name + "! ");
  }

  // Tools to be used by the agent
  const tools = [
    new Calculator(),
    new DynamicTool({
      name: "sayHello",
      description:
      `a function that says hello or hi to the name provided to the tool.`,
      func: (name) => {sayHello(name)},
    }),
];

  // Model to be used by the agent
  const model = new ChatOpenAI({
    openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
    temperature: 0,
    modelName: "gpt-3.5-turbo",
    verbose: true,
  });

  // Create the agent
  const executor = PlanAndExecuteAgentExecutor.fromLLMAndTools({
    llm: model,
    tools,
  });


  async function invoke_agent() {
    const result = await executor.call({
      input: query,
    });
    
    setText(result.output);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Ask me to do some math or say hi to someone!
        </p>
        <input  
        placeholder="Enter a query"
        style={{width: "30vw", height: "5vh", marginBottom: "1vh"}} 
        type="text" 
        onChange={(e) => setQuery(e.target.value)} />
        <button style={{ marginBottom: "10vh"}} onClick={invoke_agent}>
          Generate Response
        </button>

        <p>
          model response: {text}
        </p>

      </header>
    </div>
  );
}

export default App;
