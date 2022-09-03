import { faSave } from "@fortawesome/free-solid-svg-icons";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import type { LoaderArgs, ActionArgs } from "@remix-run/server-runtime";
import { Button, FlexList, Input, Label } from "~/components";
import { requireUser } from "~/session.server";
import { json } from '@remix-run/node'
import { updatePassword, updateUser } from "~/models/user.server";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request)
  return json({ user })
}

export async function action({ request, params }: ActionArgs) {
  const user = await requireUser(request)
  const formData = await request.formData()

  const firstName = formData.get('firstName')
  const lastName = formData.get('lastName')
  const password = formData.get('password')
  const intent = formData.get('intent')

  if (intent === 'user-name') {
    const hasFirstName = firstName && typeof firstName === 'string'
    const hasLastName = lastName && typeof lastName === 'string'
    const newUser = await updateUser(user.id, {
      ...(hasFirstName ? { firstName } : {}),
      ...(hasLastName ? { lastName } : {})
    })
    return json({ newUser })
  }
  if (intent === 'password') {
    const hasPassword = password && typeof password === 'string'
    if (!hasPassword) {
      return json(
        { errors: { password: 'Not a valid password' } },
        { status: 400 }
      )
    }
    const newUser = await updatePassword(user.id, password)
    console.log(newUser)
    return json({ user: newUser })
  }
  return null
}

export default function User() {
  const { user } = useLoaderData<typeof loader>()
  const transition = useTransition()

  return (
    <FlexList pad={4}>
      <FlexList gap={2}>
        <h3 className="text-xl font-bold">Update User Info</h3>
        <Form method="put">
          <FlexList>
            <FlexList gap={1}>
              <Label>First Name</Label>
              <Input defaultValue={user.firstName || ''} name="firstName" placeholder="First name" />
            </FlexList>
            <FlexList gap={1}>
              <Label>Last Name</Label>
              <Input defaultValue={user.lastName || ''} name="lastName" placeholder="Last name" />
            </FlexList>
            <Button isDisabled={!!transition.submission} type="submit" icon={faSave} kind="primary" name="intent" value="user-name">
              {transition.submission ? 'Saving...' : 'Save'}
            </Button>
          </FlexList>
        </Form>
      </FlexList>
      <h3 className="text-xl font-bold">Update Password</h3>
      <Form method="put">
        <FlexList>
          <Input name="password" type="password" placeholder="Never share your password..." />
          <Button kind="primary" type="submit" name="intent" value="password">Save</Button>
        </FlexList>
      </Form>
      <h3 className="text-xl font-bold">Download your contacts</h3>
    </FlexList>
  )
}