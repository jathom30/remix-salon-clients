import { faPencil, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Client } from "@prisma/client";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Outlet, useCatch, useLoaderData, useSubmit } from "@remix-run/react";
import React from "react";
import invariant from "tiny-invariant";
import { FlexHeader, FlexList, ItemBox, Link } from "~/components";
import { Label } from "~/components/Label";
import { editClient, getClient } from "~/models/client.server";
import { getNotes } from "~/models/note.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request)
  invariant(params.clientId, 'clientId not found')

  const client = await getClient({ id: params.clientId, userId })
  if (!client) {
    throw new Response("Not Found", { status: 404 })
  }

  const notes = await getNotes({ clientId: client.id })

  return json({ client, notes })
}

export async function action({ request, params }: ActionArgs) {
  await requireUserId(request)
  invariant(params.clientId, 'clientId not found')
  const id = params.clientId
  const formData = await request.formData()

  const name = formData.get('name')
  const phoneNumber = formData.get('phoneNumber')
  const email = formData.get('email')

  const hasName = name && typeof name === 'string'
  const hasPhone = phoneNumber && typeof phoneNumber === 'string'
  const hasEmail = email && typeof email === 'string'

  if (hasName) {
    await editClient(id, { name, ...(hasPhone ? { phoneNumber } : {}), ...(hasEmail ? { email } : {}) })
    return null
  }
  return null
}

export const meta: MetaFunction = ({ data }: { data: { client: Client } | undefined }) => {
  if (!data) {
    return {
      title: "Client not found",
      description: "This client could not be found"
    }
  }
  return {
    title: data.client.name,
  };
};

const headerDefaultClasses = "flex justify-between items-center md:rounded p-4 bg-component-background shadow"

export default function ClientRoute() {
  const { client, notes } = useLoaderData<typeof loader>()
  const submit = useSubmit()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    submit(e.currentTarget, { replace: true })
  }

  return (
    <FlexList>
      <Form method="put" onChange={handleSubmit}>
        <div className="md:p-4">
          <FlexList gap={2}>
            <div className="hidden md:block">
              <Label>Name</Label>
            </div>
            <div className={headerDefaultClasses}>
              <input type="text" name="name" className="text-4xl font-bold" defaultValue={client.name} />
              <Link to="delete" kind="danger" isRounded><FontAwesomeIcon icon={faTrash} /></Link>
            </div>
          </FlexList>
        </div>
        <FlexList pad={4}>
          <FlexList gap={2}>
            <Label>Details</Label>
            <ItemBox>
              <FlexList gap={4}>
                <input type="text" name="phoneNumber" defaultValue={client.phoneNumber || ''} placeholder="Add a phone number..." />
                <input type="text" name="email" defaultValue={client.email || ''} placeholder="Add an email..." />
              </FlexList>
            </ItemBox>
          </FlexList>
        </FlexList>
      </Form>
      <div className="px-4">
        <FlexList gap={2}>
          <div className="flex gap-4 items-center justify-between">
            <Label>Notes</Label>
            <Link to="new" icon={faPlusCircle} isRounded kind="secondary" isCollapsing>
              Create New Note
            </Link>
            <Outlet />
          </div>
          {notes.map(note => (
            <ItemBox key={note.id}>
              <FlexList>
                <FlexHeader>
                  <span className="text-text-subdued text-xs">{new Date(note.updatedAt).toDateString()}</span>
                  <Link to={`edit/${note.id}`} isRounded icon={faPencil}>Edit</Link>
                </FlexHeader>
                <FlexList gap={2}>
                  {note.body.split('\n\n').map((line, i) => (
                    <span key={i}>{line}</span>
                  ))}
                </FlexList>
              </FlexList>
            </ItemBox>
          ))}
          {notes.length === 0 ? (
            <ItemBox>
              <div className="flex flex-col items-center justify-center gap-2 p-4">
                <span className="text-lg text-text-subdued font-bold">No notes found...</span>
                <Link to="new" kind="primary" isRounded>Create your first for this client</Link>
              </div>
            </ItemBox>
          ) : null}
        </FlexList>
      </div>
    </FlexList>
  )
}

// TODO Add conditional Save and cancel buttons if form items change instead of update onchange OR debounce requests
// TODO Look into remix-forms

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Contact not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}