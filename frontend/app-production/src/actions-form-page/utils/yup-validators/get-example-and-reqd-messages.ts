export function getExampleAndRequiredMessages(options: ProdActions.Options) {
  const example = options?.farmosRpc?.example && `Example(s): ${options.farmosRpc.example.join(', ')}`;
  const desc = options?.farmosRpc?.description;
  const exampleMessage = desc && example ? `${desc} ${example}` : example || desc || 'Invalid input';
  const requiredMessage = 'Field Required' + (desc ? `: ${desc}` : '');

  return { exampleMessage, requiredMessage };
}
