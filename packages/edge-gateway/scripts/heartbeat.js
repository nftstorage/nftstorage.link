import { fetch } from '@web-std/fetch'

export async function heartbeatCmd(opts) {
  try {
    await fetch(`https://api.opsgenie.com/v2/heartbeats/${opts.name}/ping`, {
      headers: {
        Authorization: `GenieKey ${opts.token}`,
      },
    })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
