export async function sendResetEmail(to: string, token: string) {
  return Promise.resolve(`Mock email sent to ${to} with token ${token}`);
}
