import { useEffect, useState } from 'react'
import { Client } from 'archipelago.js'

const LOGIN_STORAGE_KEY = 'archiLogin'

const ArchiConnectionStatus = {
  NotConnected: 'Not Connected',
  Connecting: 'Connecting',
  Connected: 'Connected',
} as const

type ArchiConnectionStatus = (typeof ArchiConnectionStatus)[keyof typeof ArchiConnectionStatus]

type ArchipelagoLogin = {
  address: string
  slotName: string
  password?: string
}

function readStoredLogin() {
  const storedLogin = window.localStorage.getItem(LOGIN_STORAGE_KEY)

  if (!storedLogin) {
    return null
  }

  try {
    return JSON.parse(storedLogin) as ArchipelagoLogin
  } catch {
    console.warn('Invalid Archipelago login data found in localStorage.')
    return null
  }
}

function useArchiClient() {
  const [client] = useState(() => new Client())
  const [status, setStatus] = useState<ArchiConnectionStatus>(ArchiConnectionStatus.NotConnected)

  useEffect(() => {
    const login = readStoredLogin()

    if (!login) {
      return
    }

    let didStartLogin = false

    const handleConnected = () => {
      setStatus(ArchiConnectionStatus.Connected)
    }

    const handleConnectionRefused = (packet: { errors?: string[] }) => {
      setStatus(ArchiConnectionStatus.NotConnected)
      console.warn(packet.errors?.length ? packet.errors.join(', ') : 'Connection refused.')
    }

    client.socket.on('connected', handleConnected)
    client.socket.on('connectionRefused', handleConnectionRefused)

    const timeoutId = window.setTimeout(() => {
      setStatus(ArchiConnectionStatus.Connecting)
      didStartLogin = true

      client.messages.on("message", (content) => {
        console.log(content);
      });

      client
        .login(login.address, login.slotName, undefined, {
          password: login.password,
          tags: ['AP', 'TextOnly', 'DeathLink'],
        })
        .then(() => {
          setStatus(ArchiConnectionStatus.Connected)
        })
        .catch((error: unknown) => {
          setStatus(ArchiConnectionStatus.NotConnected)
          console.error(error)
        })
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
      client.socket.off('connected', handleConnected)
      client.socket.off('connectionRefused', handleConnectionRefused)

      if (didStartLogin) {
        client.socket.disconnect()
      }
    }
  }, [client])

  return { client, status }
}

export default useArchiClient