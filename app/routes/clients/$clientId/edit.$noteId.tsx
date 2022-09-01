import { Form, useCatch, useLoaderData, useNavigate, useParams } from "@remix-run/react"
import type { LoaderArgs, ActionArgs } from "@remix-run/server-runtime"
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant"
import { Button, FlexHeader, FlexList, Modal, Link } from "~/components"
import { deleteNote, editNote, getNote } from "~/models/note.server"
import { requireUserId } from "~/session.server"
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export async function loader({ request, params }: LoaderArgs) {
  await requireUserId(request)

  invariant(params.noteId, 'noteId not found')
  invariant(params.clientId, 'clientId not found')
  const noteId = params.noteId
  const clientId = params.clientId

  const note = await getNote({ id: noteId, clientId })
  if (!note) {
    throw new Response("Not Found", { status: 404 })
  }

  return json({ note })
}

export async function action({ request, params }: ActionArgs) {
  await requireUserId(request)

  invariant(params.noteId, 'noteId not found')
  invariant(params.clientId, 'clientId not found')
  const noteId = params.noteId
  const clientId = params.clientId

  const formData = await request.formData()
  const button = formData.get('button')

  if (button === 'delete') {
    await deleteNote(noteId)
    return redirect(`/clients/${clientId}`)
  }

  const body = formData.get('body')

  if (!body || typeof body !== 'string') {
    return null
  }

  if (button === 'edit') {
    await editNote(noteId, { body })
    return redirect(`/clients/${clientId}`)
  }

  return null
}

export default function EditNote() {
  const { note } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const params = useParams()

  return (
    <Modal onClose={() => navigate(`/clients/${params.clientId}`)}>
      <Form method="put" className="w-full">
        <FlexList>
          <FlexHeader>
            <h2 className="text-lg font-bold">Edit Note</h2>
            <Button isCollapsing isRounded kind="danger" type="submit" name="button" value="delete" icon={faTrash}>Delete</Button>
          </FlexHeader>
          <textarea defaultValue={note.body} name="body" placeholder="Your new note here..." className="w-full border p-2 rounded border-text-subdued" rows={10} />
          <div className="flex gap-4 justify-end">
            <Link to={`/clients/${params.clientId}`}>Cancel</Link>
            <Button type="submit" kind="primary" name="button" value="edit">Save</Button>
          </div>
        </FlexList>
      </Form>
    </Modal>
  )
}

export function CatchBoundary() {
  const caught = useCatch();
  const navigate = useNavigate()
  const params = useParams()

  if (caught.status === 404) {
    return <Modal onClose={() => navigate(`/clients/${params.clientId}`)}>Note not found</Modal>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}