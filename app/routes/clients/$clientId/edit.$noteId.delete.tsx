import { Button, FlexList, Link, Modal } from "~/components";
import { requireUserId } from "~/session.server";
import type { LoaderArgs, ActionArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getClient } from "~/models/client.server";
import { deleteNote } from "~/models/note.server";
import { Form, useNavigate, useParams } from "@remix-run/react";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request)
  invariant(params.clientId, 'clientId not found')

  const client = await getClient({ id: params.clientId, userId })
  if (!client) {
    throw new Response('Client Not Found', { status: 404 })
  }
  return json({ client })
}

export async function action({ request, params }: ActionArgs) {
  await requireUserId(request)

  invariant(params.noteId, 'noteId not found')
  invariant(params.clientId, 'clientId not found')
  const noteId = params.noteId
  const clientId = params.clientId

  await deleteNote(noteId)
  return redirect(`/clients/${clientId}`)
}

export default function DeleteNote() {
  const navigate = useNavigate()
  const params = useParams()
  return (
    <Modal onClose={() => navigate(`/clients/${params.clientId}`)}>
      <FlexList>
        <FlexList items="center">
          <h3 className="text-xl font-bold text-danger">Are you sure?</h3>
          <p>This will permenantly delete this note!</p>
        </FlexList>
        <div className="flex gap-4 justify-end">
          <Link to={`/clients/${params.clientId}/edit/${params.noteId}`}>Cancel</Link>
          <Form method="delete">
            <Button type="submit" kind="danger">Delete</Button>
          </Form>
        </div>
      </FlexList>
    </Modal>
  )
}