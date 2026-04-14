enum OperationType { LIST = 'list' }
const error = new Error("Missing or insufficient permissions.");
const errorMessage = error instanceof Error ? error.message : String(error);
const errInfo = {
  error: errorMessage,
  authInfo: { providerInfo: [] },
  operationType: OperationType.LIST,
  path: "contactMessages"
};
console.log("errorMessage:", errorMessage);
console.log("includes permission:", errorMessage.toLowerCase().includes('permission'));
if (!errorMessage.toLowerCase().includes('permission')) {
  throw new Error(JSON.stringify(errInfo));
} else {
  console.log("Did not throw");
}
