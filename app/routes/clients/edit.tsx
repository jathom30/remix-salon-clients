import type { LoaderArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { json } from '@remix-run/node'
import { getClients } from "~/models/client.server";
import { requireUserId } from "~/session.server";
import { FlexList, Input, Button } from "~/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request)

  const url = new URL(request.url)
  const q = url.searchParams.get('query')

  console.log(q)

  const params = {
    userId,
    ...(q ? { q } : null)
  }

  const clientList = await getClients(params)
  return json({ clientList })
}

const linkClassNames = "ease-in-out duration-200 rounded px-4 py-2 text-text-subdued cursor-pointer bg-component-background shadow hover:text-text hover:shadow-md"

export default function ClientList() {
  const { clientList } = useLoaderData<typeof loader>()
  const [params, setParams] = useSearchParams()
  const searchParam = params.get('query')

  return (
    <FlexList pad={4}>
      <Form action=".">
        <div className="flex gap-2 items-center">
          <FontAwesomeIcon icon={faSearch} />
          <Input name="query" placeholder="Search by name..." defaultValue={searchParam || ''} onChange={e => setParams({ query: e.target.value })} />
          {searchParam ? (
            <Button isRounded onClick={() => setParams({ query: '' })} icon={faTimes} />
          ) : null}
        </div>
      </Form>
      <FlexList gap={2}>
        {clientList.map(client => (
          <Link key={client.id} className={linkClassNames} prefetch="intent" to={client.id}>{client.name}</Link>
        ))}
        {clientList.length === 0 ? !searchParam ? (
          <FlexList items="center">
            <span>Looks like you don't have any clients created yet</span>
            <Link to="new">
              <Button kind="primary" icon={faPlus}>
                Create your first here
              </Button>
            </Link>
          </FlexList>
        ) : (
          <FlexList items="center">
            <span>No clients found matching that name.</span>
            <Button kind="primary" onClick={() => setParams({ query: '' })}>Clear Search</Button>
          </FlexList>
        ) : null}
      </FlexList>
    </FlexList>
  )
}