import { Form } from "@remix-run/react";
import type { ActionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Button, FlexList, Input } from "~/components";
import { Label } from "~/components/Label";
import { requireUserId } from "~/session.server";
import { validateEmail, validateName, validatePhoneNumber } from "~/utils";
import { createClient } from "~/models/client.server";
import { createNote } from "~/models/note.server";


export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData()
  const name = formData.get('name')
  const phoneNumber = formData.get('phoneNumber')
  const email = formData.get('email')
  const noteBody = formData.get('note')

  if (!validateName(name)) {
    return json(
      { errors: { name: 'Name must not be empty' } },
      { status: 400 }
    )
  }
  if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
    return json(
      { errors: { phoneNumber: 'Not a valid phone number' } },
      { status: 400 }
    )
  }
  if (email && !validateEmail(email)) {
    return json(
      { errors: { email: 'Email is invalid' } },
      { status: 400 }
    )
  }

  const client = await createClient({ name, phoneNumber, email, userId })
  if (noteBody && typeof noteBody === 'string') {
    await createNote({ body: noteBody, clientId: client.id })
  }

  return redirect(`/clients/${client.id}`)
}

export const meta: MetaFunction = () => {
  return {
    title: "New Client",
  };
};

export default function NewClient() {
  return (
    <Form method="post">
      <FlexList pad={4}>
        <FlexList gap={2}>
          <Label required>Name</Label>
          <Input name="name" placeholder="Add a name..." />
        </FlexList>

        <FlexList gap={2}>
          <Label>Phone number</Label>
          <Input name="phoneNumber" placeholder="Add a phone number..." />
        </FlexList>

        <FlexList gap={2}>
          <Label>Email</Label>
          <Input name="email" placeholder="Add an email..." />
        </FlexList>

        <FlexList gap={2}>
          <Label>Note</Label>
          <textarea className="p-2" name="note" placeholder="Add a note..." rows={10} />
        </FlexList>

        <Button kind="primary" type="submit">Create</Button>
      </FlexList>
    </Form>
  )
}