// NOTE : keep these in sync with the commands provided in system prompts
const validCommands = [
  'forward',
  'left',
  'right',
  'goto',
  'putPenUp',
  'putPenDown',
  'setWidth',
  'setColor'
]

export default function extractCommands(modelOutput: string) {
  // Clean up the output
  modelOutput = modelOutput.replace(/done\(\)\n```/g, '');
  modelOutput = modelOutput.replace(/done\(\);\n```/g, '');
  modelOutput = modelOutput.replace('```javascript', '');
  modelOutput = modelOutput.replace('```', '');
  let commands = ''
  for (let commandLine of modelOutput.split('\n')) {
    commandLine = commandLine.trim()

    // skip empty lines
    if (commandLine === '') continue

    // make sure commandLine starts with one of validCommands
    const command = commandLine.split('(')[0]
    if (validCommands.includes(command)) {
      commands += commandLine + '\n' 
    }
  }
  return commands
}