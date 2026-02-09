export async function sendResetEmail(to: string, token: string) {
  console.log(`Mock email sent to ${to} with token ${token}`);
  return true;
}
