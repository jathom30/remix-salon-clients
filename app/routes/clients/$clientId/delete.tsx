import { Form, useLoaderData, useNavigate, useParams } from "@remix-run/react";
import type { LoaderArgs, ActionArgs, MetaFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { Button, FlexList, Link, Modal } from "~/components";
import { deleteClient, getClient } from "~/models/client.server";
import { requireUserId } from "~/session.server";
import { Client } from "@prisma/client";

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
  const userId = await requireUserId(request)
  invariant(params.clientId, 'clientId not found')
  const id = params.clientId

  await deleteClient({ id, userId })
  return redirect('/')
}

export const meta: MetaFunction = ({ data }: { data: { client: Client } | undefined }) => {
  if (!data) {
    return {
      title: "Client not found",
      description: "This client could not be found"
    }
  }
  return {
    title: `Delete ${data.client.name}?`,
  };
};

export default function DeleteClient() {
  const { client } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const params = useParams()
  return (
    <Modal onClose={() => navigate(`/clients/${params.clientId}`)}>
      <FlexList>
        <FlexList items="center">
          <h3 className="text-xl font-bold text-danger">Are you sure?</h3>
          <p>This will permenantly delete <strong>{client.name}</strong> and all of their notes!</p>
        </FlexList>
        <div className="flex gap-4 justify-end">
          <Link to={`/clients/${params.clientId}`}>Cancel</Link>
          <Form method="delete">
            <Button type="submit" kind="primary">Save</Button>
          </Form>
        </div>
      </FlexList>
    </Modal>
  )
}