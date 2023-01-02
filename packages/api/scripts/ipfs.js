#!/usr/bin/env node
import net from 'net'
import path from 'path'
import { fileURLToPath } from 'url'
import execa from 'execa'
import pWaitFor from 'p-wait-for'
import { create } from 'ipfs-http-client'
import globSource from 'ipfs-utils/src/files/glob-source.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IPFS_API_URL = 'http://127.0.0.1:9089'

export async function ipfsCmd({
  start,
  stop,
  composePath = path.join(__dirname, '../docker/docker-compose.yml'),
  containerName = 'ipfs0',
}) {
  const project = 'ipfs-daemon'

  if (start) {
    if (await isPortReachable(8080)) {
      throw new Error(
        'IPFS daemon is already running. Please check if you have any docker project or cluster deamon already running.'
      )
    }

    await execa('docker-compose', [
      '--file',
      composePath,
      '--project-name',
      project,
      'up',
      '--detach',
    ])

    await pWaitFor(async () => {
      const { stdout } = await execa('docker', ['logs', '-t', containerName])
      return stdout.includes('Daemon is ready')
    })
    console.log('docker started')

    // Add fixture files
    const client = create({ url: IPFS_API_URL })

    await Promise.all([
      // bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq
      client.add('Hello nft.storage! 😎', {
        rawLeaves: true,
      }),
      // bafkreibxkbyybantsznyvlq2bhf24u4gew7pj6erjgduqp4mvqv54qjng4
      client.add('Hello nft.storage! 😎😎', {
        rawLeaves: true,
      }),
      // bafkreihbjbbccwxn7hzv5hun5pxuswide7q3lhjvfbvmd7r3kf2sodybgi
      client.add('Hello nft.storage! 😎😎😎', {
        rawLeaves: true,
      }),
    ])

    // bafybeih74zqc6kamjpruyra4e4pblnwdpickrvk4hvturisbtveghflovq
    for await (const _ of client.addAll(
      globSource(path.join(__dirname, '../test/fixtures/directory'), '**/*'),
      {
        rawLeaves: true,
        wrapWithDirectory: true,
        cidVersion: 1,
      }
    )) {
    }
  }

  if (stop) {
    await execa('docker-compose', [
      '--file',
      composePath,
      '--project-name',
      project,
      'stop',
    ])
    await execa('docker-compose', [
      '--file',
      composePath,
      '--project-name',
      project,
      'down',
      '--volumes',
      '--rmi',
      'local',
      '--remove-orphans',
    ])
  }
}

/**
 * @param {number} port
 */
export default async function isPortReachable(
  port,
  { host = 'localhost', timeout = 1000 } = {}
) {
  if (typeof host !== 'string') {
    throw new TypeError('Specify a `host`')
  }

  const promise = new Promise((resolve, reject) => {
    const socket = new net.Socket()

    const onError = (err) => {
      socket.destroy()
      reject(err)
    }

    socket.setTimeout(timeout)
    socket.once('error', onError)
    socket.once('timeout', onError)

    socket.connect(port, host, () => {
      socket.end()
      resolve(undefined)
    })
  })

  try {
    await promise
    return true
  } catch {
    return false
  }
}
