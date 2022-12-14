import type { User, Client } from '@prisma/client'

import { prisma } from "~/db.server";

export function getClient({ id, userId }: Pick<Client, 'id'> & { userId: User['id'] }) {
  return prisma.client.findFirst({
    where: { id, userId }
  })
}

export function getClients({ userId, q }: { userId: User['id']; q?: string }) {
  return prisma.client.findMany({
    where: {
      userId,
      ...(q && {
        name: {
          contains: q
        }
      })
    },
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  })
}

export function createClient({
  name, email, phoneNumber, userId
}: Pick<Client, 'name' | 'email' | 'phoneNumber'> & { userId: User['id'] }) {
  return prisma.client.create({
    data: {
      name,
      email,
      phoneNumber,
      user: {
        connect: {
          id: userId
        }
      }
    }
  })
}

export function deleteClient({ id, userId }: Pick<Client, 'id'> & { userId: User['id'] }) {
  return prisma.client.deleteMany({
    where: { id, userId }
  })
}

export function editClient(id: Client['id'], client: Partial<Client>) {
  return prisma.client.update({
    where: { id },
    data: client
  })
}