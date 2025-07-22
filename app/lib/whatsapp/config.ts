import {
  makeWASocket,
  useMultiFileAuthState,
  Browsers,
  DisconnectReason
} from 'baileys'
// import P from 'pino'
import path from 'path'
import { AnyType } from '../types'

// In-memory cache for QR codes and sockets
export const qrCache: Record<string, string> = {}
export const sockets: Record<string, ReturnType<typeof makeWASocket>> = {}
export const history: AnyType = {}

export async function initSocket(tenantId: string) {
  const sessionPath = path.join('sessions', tenantId)
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath)

  const sock = makeWASocket({
    printQRInTerminal: false,
    auth: state,
    browser: Browsers.macOS('Desktop'),
    syncFullHistory: true,
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update
    if (qr) qrCache[tenantId] = qr
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut
      if (shouldReconnect) initSocket(tenantId)
    }
  })

  sock.ev.on('messaging-history.set', ({
    chats,
    contacts,
    messages,
    syncType
  }) => {
    history[tenantId] = {
      chats,
      contacts,
      messages,
      syncType,
    }
    console.log('history', chats)
  })

  sockets[tenantId] = sock
  return sock
}
