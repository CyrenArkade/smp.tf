const FLIGHT_IP = process.env.FLIGHT_IP!
const FLIGHT_PORT = Number(process.env.FLIGHT_PORT!)

const PROTOCOL_NUMBER = 774
const PACKET_HANDSHAKE = 0

class PacketWriter {
  bytes: number[]

  constructor(packetId: number) {
    this.bytes = []
    this.varInt(packetId)
  }

  write(socket: Bun.Socket) {
    const prefix: number[] = []
    this.varInt(this.bytes.length, prefix)

    socket.write(Buffer.from([...prefix, ...this.bytes]))
  }

  varInt(value: number, dest?: number[]) {
    while (value & ~0x7F) {
      (dest ?? this.bytes).push((value & 0x7F) | 0x80)
      value >>>= 7
    }
    (dest ?? this.bytes).push(value)
  }

  string(value: string) {
    this.varInt(value.length)
    this.bytes.push(...new TextEncoder().encode(value))
  }

  short(value: number) {
    this.bytes.push(value >> 8, value & 0xFF)
  }
}

class HandshakePacket extends PacketWriter {
  constructor(ip: string, port: number) {
    super(PACKET_HANDSHAKE)

    this.varInt(PROTOCOL_NUMBER)
    this.string(ip)
    this.short(port)
    this.varInt(1)
  }
}

class StatusRequestPacket extends PacketWriter {
  constructor() {
    super(PACKET_HANDSHAKE)
  }
}

class PacketReader {
  buf: Buffer
  offset: number

  constructor(buf: Buffer) {
    this.buf = buf
    this.offset = 0
  }

  read(size: number): Buffer {
    const read = this.buf.subarray(this.offset, this.offset + size)
    this.offset += size
    return read
  }

  readByte(): number {
    const read = this.buf[this.offset]
    this.offset += 1
    return read
  }

  varInt(): number {
    let num = 0

    for (let offset = 0; offset < 32; offset += 7) {
      const byte = this.readByte()
      num |= (byte & 0x7F) << offset

      if ((byte & 0x80) == 0)
        break
    }

    return num
  }

  string(): string {
    const length = this.varInt()
    const data = this.read(length)
    return new TextDecoder().decode(data)
  }

  readPacket() {
    const packetId = this.varInt()
    if (packetId == PACKET_HANDSHAKE)
      this.packetStatus()
  }

  packetStatus() {
    const status = this.string()
    const json = JSON.parse(status)
    playerList = Array.from(json.players.sample?.map((x: any) => x.name) ?? [])
  }
}

let playerList: string[] = []
export async function fetchPlayerList() {
  let socket_buf = Buffer.alloc(0)

  return await new Promise<string[]>(async resolve => {
    setTimeout(() => resolve([]), 5000)

    await Bun.connect({
      hostname: FLIGHT_IP,
      port: FLIGHT_PORT,

      socket: {
        open: socket => {
          new HandshakePacket(FLIGHT_IP, FLIGHT_PORT).write(socket)
          new StatusRequestPacket().write(socket)
        },
        data: (socket, data) => {
          socket_buf = Buffer.concat([socket_buf, data])

          while (true) {
            const lengthPrefixLength = socket_buf.findIndex(byte => (byte & 0x80) == 0) + 1
            if (lengthPrefixLength == 0)
              return

            const reader = new PacketReader(socket_buf)
            const length = reader.varInt()
            const frameLength = lengthPrefixLength + length
            if (socket_buf.length < frameLength)
              return

            reader.readPacket()
            socket.close()

            socket_buf = socket_buf.subarray(frameLength)
          }
        },
        close: () => resolve(playerList),
        error: () => resolve([]),
      },
    })
  })
}

