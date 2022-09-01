import { Form, Link, useNavigate, useParams } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { Button, Modal, FlexList } from "~/components";
import { createNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

export async function action({ request, params }: ActionArgs) {
  await requireUserId(request)
  invariant(params.clientId, 'clientId not found')
  const clientId = params.clientId

  const formData = await request.formData()
  const body = formData.get('body')

  if (!body || typeof body !== 'string') {
    return null
  }
  await createNote({ body, clientId })
  return redirect(`/clients/${clientId}`)
}

export default function NewNote() {
  const params = useParams()
  const navigate = useNavigate()

  return (
    <Modal onClose={() => navigate(`/clients/${params.clientId}`)}>
      <Form method="post" className="w-full">
        <FlexList>
          <h2 className="text-lg font-bold">New Note</h2>
          <textarea name="body" placeholder="Your new note here..." className="w-full border p-2 rounded border-text-subdued" rows={10} />
          <div className="flex gap-4 justify-end">
            <Link to={`/clients/${params.clientId}`}><Button>Cancel</Button></Link>
            <Button type="submit" kind="primary">Save</Button>
          </div>
        </FlexList>
      </Form>
    </Modal>
  )
}