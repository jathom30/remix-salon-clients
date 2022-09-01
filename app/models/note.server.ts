import type { Client, Note } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Note } from "@prisma/client";

export function getNotes({ clientId }: { clientId: Client['id'] }) {
  return prisma.note.findMany({
    where: { clientId },
    orderBy: { createdAt: 'desc' },
  })
}

export function getNote({ id, clientId }: Pick<Note, 'id'> & { clientId: Client['id'] }) {
  return prisma.note.findFirst({
    where: { id, clientId }
  })
}

export function createNote({ body, clientId }: Pick<Note, 'body'> & { clientId: Client['id'] }) {
  return prisma.note.create({
    data: {
      body,
      clientId
    }
  })
}

export function editNote(id: Note['id'], note: Partial<Note>) {
  return prisma.note.update({
    where: { id },
    data: note
  })
}

export function deleteNote(id: Note['id']) {
  return prisma.note.delete({
    where: { id }
  })
}